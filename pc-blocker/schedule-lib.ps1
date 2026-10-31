# Checks and saves schedule.json. Shared by game-blocker.ps1 (desktop editor) and
# schedule-host.ps1 (the Chrome extension's editor saves through it).

$DayNames = @('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')

function Get-EnvValue($path, $name) {
  # NAME=value from a .env file (quotes optional); $null if the file or name is missing
  if (-not (Test-Path $path)) { return $null }
  foreach ($line in Get-Content $path) { if ($line -match "^\s*$name\s*=\s*(.*?)\s*$") { return $Matches[1].Trim('"', "'") } }
  return $null
}
function Test-Time($t) { return [bool]("$t" -match '^([01]\d|2[0-3]):[0-5]\d$') }
function Test-Date($d) {
  $x = [datetime]::MinValue
  return ("$d" -match '^\d{4}-\d\d-\d\d$') -and
    [datetime]::TryParseExact("$d", 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture, 'None', [ref]$x)
}

function Test-Schedule($s) {
  # Returns a message for the first problem found, or $null if the schedule is fine.
  if (-not $s) { return 'The schedule is empty.' }
  if (-not (Test-Date $s.activeFrom) -or -not (Test-Date $s.activeUntil)) { return 'Pick both study plan dates.' }
  if ($s.activeFrom -gt $s.activeUntil) { return 'The study plan ends before it starts.' }
  $blocks = @($s.blocks | Where-Object { $_ })
  if ($blocks.Count -gt 20) { return 'Too many study blocks (20 max).' }
  $n = 0
  foreach ($b in $blocks) {
    $n++
    $label = "$($b.label)".Trim()
    if (-not $label) { return "Study block ${n}: give it a name." }
    if ($label.Length -gt 60) { return "Study block ${n}: the name is too long (60 characters max)." }
    $picked = @($b.days | Where-Object { $_ })
    if ($picked.Count -eq 0) { return "${label}: pick at least one day." }
    foreach ($d in $picked) { if ($DayNames -notcontains $d) { return "${label}: unknown day '$d'." } }
    if (-not (Test-Time $b.start) -or -not (Test-Time $b.end)) { return "${label}: times must be 24-hour, like 19:15." }
    if ($b.start -ge $b.end) { return "${label}: the end time must be after the start time." }
    if ($b.from -and -not (Test-Date $b.from)) { return "${label}: the 'from' date is not valid." }
    if ($b.until -and -not (Test-Date $b.until)) { return "${label}: the 'until' date is not valid." }
    if ($b.from -and $b.until -and $b.from -gt $b.until) { return "${label}: the 'until' date is before the 'from' date." }
  }
  if ($s.games) {
    foreach ($d in $DayNames) {
      if (-not (Test-Time $s.games.freeAfter.$d)) { return "Games unlock time for $d must be 24-hour, like 20:45 (00:00 = only during blocks)." }
    }
    if ($s.games.curfew -and -not (Test-Time $s.games.curfew)) { return 'The curfew must be 24-hour, like 23:30, or empty for none.' }
  }
  if ($s.calendar -and $s.calendar.url) {
    if ("$($s.calendar.url)" -notmatch '^https://\S+$' -or "$($s.calendar.url)".Length -gt 2000) { return 'The calendar link must be the https:// "Secret address in iCal format" from Google Calendar.' }
    if ("$($s.calendar.prefix)".Length -gt 40) { return 'The calendar title filter is too long (40 characters max).' }
  }
  return $null
}

# ---------- Google Calendar (secret iCal address) ----------

function Get-Blocks($s) {
  # Once the calendar has synced, its events ARE the study blocks (one dated block per event);
  # until then, or with no calendar, the weekly blocks apply.
  if ($s.calendar -and $s.calendar.url -and $s.calendar.syncedAt) {
    return @(foreach ($e in @($s.calendar.events | Where-Object { $_ })) {
      [pscustomobject]@{ label = $e.label; days = @(([datetime]$e.date).DayOfWeek.ToString().Substring(0, 3)); start = $e.start; end = $e.end; from = $e.date; until = $e.date }
    })
  }
  return @($s.blocks | Where-Object { $_ })
}

function ConvertFrom-IcsTime($head, $val) {
  # ponytail: TZID times are read as this PC's local time (fine while the calendar and PC share a zone)
  if ($head -match 'VALUE=DATE(;|$)' -or $val.Length -eq 8) {
    return @{ allDay = $true; time = [datetime]::ParseExact($val.Substring(0, 8), 'yyyyMMdd', $null) }
  }
  if ($val.EndsWith('Z')) {
    $utc = [datetime]::ParseExact($val, "yyyyMMdd'T'HHmmss'Z'", $null, [Globalization.DateTimeStyles]'AssumeUniversal,AdjustToUniversal')
    return @{ allDay = $false; time = $utc.ToLocalTime() }
  }
  return @{ allDay = $false; time = [datetime]::ParseExact($val.Substring(0, 15), "yyyyMMdd'T'HHmmss", $null) }
}

function Get-Occurrences($start, $rrule, $to) {
  # Expands DAILY / WEEKLY rules (INTERVAL, BYDAY, UNTIL, COUNT). Other frequencies: first occurrence only.
  if (-not $rrule) { return , @($start) }
  $r = @{}
  foreach ($part in $rrule -split ';') { $kv = $part -split '=', 2; $r[$kv[0]] = $kv[1] }
  $step = if ($r.INTERVAL) { [int]$r.INTERVAL } else { 1 }
  $until = if ($r.UNTIL) { (ConvertFrom-IcsTime 'UNTIL' $r.UNTIL).time } else { $to.AddDays(1) }
  if ($r.UNTIL -and $r.UNTIL.Length -eq 8) { $until = $until.AddDays(1).AddSeconds(-1) }
  $max = if ($r['COUNT']) { [int]$r['COUNT'] } else { [int]::MaxValue }   # not $r.COUNT: that's the hashtable's own Count
  $out = New-Object System.Collections.Generic.List[datetime]
  switch ($r.FREQ) {
    'DAILY' {
      for ($t = $start; $t -le $until -and $t.Date -le $to -and $out.Count -lt $max; $t = $t.AddDays($step)) { $out.Add($t) }
    }
    'WEEKLY' {
      $codes = @{ MO = 0; TU = 1; WE = 2; TH = 3; FR = 4; SA = 5; SU = 6 }
      $offsets = if ($r.BYDAY) { @($r.BYDAY -split ',' | ForEach-Object { $codes[$_.Substring($_.Length - 2)] } | Sort-Object) } else { @(([int]$start.DayOfWeek + 6) % 7) }
      $monday = $start.Date.AddDays(-(([int]$start.DayOfWeek + 6) % 7))
      for ($wk = $monday; $wk -le $to -and $out.Count -lt $max; $wk = $wk.AddDays(7 * $step)) {
        foreach ($o in $offsets) {
          $t = $wk.AddDays($o).Add($start.TimeOfDay)
          if ($t -lt $start) { continue }
          if ($t -gt $until -or $out.Count -ge $max) { break }
          $out.Add($t)
        }
        if ($wk.AddDays(7) -gt $until) { break }
      }
    }
    default { $out.Add($start) }
  }
  return , $out.ToArray()
}

function ConvertFrom-Ics($text, $prefix, $from, $to) {
  # Timed events whose title starts with $prefix (comma-separated list, empty = all), between $from and $to (dates),
  # as @{ label; date; start; end } in local time. Events crossing midnight end at 23:59.
  $lines = ($text -replace "\r?\n[ \t]", '') -split "\r?\n"   # unfold continuation lines
  $all = New-Object System.Collections.Generic.List[object]
  $cur = $null
  foreach ($l in $lines) {
    if ($l -eq 'BEGIN:VEVENT') { $cur = @{ exdates = @() }; continue }
    if ($l -eq 'END:VEVENT') { if ($cur -and $cur.start) { $all.Add($cur) }; $cur = $null; continue }
    if (-not $cur) { continue }
    $i = $l.IndexOf(':'); if ($i -lt 0) { continue }
    $head = $l.Substring(0, $i); $val = $l.Substring($i + 1)
    switch (($head -split ';')[0]) {
      'SUMMARY'       { $cur.summary = ($val -replace '\\n', ' ' -replace '\\([,;\\])', '$1').Trim() }
      'DTSTART'       { $cur.start = ConvertFrom-IcsTime $head $val }
      'DTEND'         { $cur.end = ConvertFrom-IcsTime $head $val }
      'RRULE'         { $cur.rrule = $val }
      'EXDATE'        { foreach ($v in $val -split ',') { $cur.exdates += (ConvertFrom-IcsTime $head $v).time } }
      'RECURRENCE-ID' { $cur.recurId = (ConvertFrom-IcsTime $head $val).time }
      'STATUS'        { $cur.status = $val }
      'UID'           { $cur.uid = $val }
    }
  }
  # Moved or cancelled single occurrences of a repeating event
  $moved = @{}
  foreach ($e in $all) { if ($e.recurId) { $moved["$($e.uid)|$($e.recurId.ToString('s'))"] = $true } }

  $prefixes = @("$prefix" -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  $keep = { param($e) -not $e.start.allDay -and $e.status -ne 'CANCELLED' -and (-not $prefixes -or @($prefixes | Where-Object { "$($e.summary)" -like "$_*" }).Count) }
  $emit = {
    param($label, $s, $e)
    if ($e.Date -gt $s.Date) { $e = $s.Date.AddHours(23).AddMinutes(59) }
    if ($s.Date -lt $from -or $s.Date -gt $to -or $e -le $s) { return }
    [pscustomobject]@{ label = $label; date = $s.ToString('yyyy-MM-dd'); start = $s.ToString('HH:mm'); end = $e.ToString('HH:mm') }
  }
  $events = foreach ($e in $all) {
    if (-not (& $keep $e)) { continue }
    $len = if ($e.end) { $e.end.time - $e.start.time } else { [TimeSpan]::FromHours(1) }
    if ($e.recurId) { & $emit $e.summary $e.start.time ($e.start.time + $len); continue }
    foreach ($t in (Get-Occurrences $e.start.time $e.rrule $to)) {
      if ($e.exdates -contains $t -or $moved.ContainsKey("$($e.uid)|$($t.ToString('s'))")) { continue }
      & $emit $e.summary $t ($t + $len)
    }
  }
  return @($events | Sort-Object date, start)
}

function Save-Schedule($s, $path) {
  # Writes a clean copy (fixed key order, days in week order) and swaps it in, so readers never see half a file.
  $blocks = @(foreach ($b in @($s.blocks | Where-Object { $_ })) {
    $o = [ordered]@{ label = "$($b.label)".Trim(); days = @($DayNames | Where-Object { @($b.days) -contains $_ }); start = "$($b.start)"; end = "$($b.end)" }
    if ($b.from) { $o.from = "$($b.from)" }
    if ($b.until) { $o.until = "$($b.until)" }
    $o
  })
  $out = [ordered]@{
    _readme     = 'Single source of truth for study blocks, used by the Chrome extension AND the PC game blocker. Times are your PC''s local time. Edit it from the extension (new tab > Edit schedule) or the game blocker dashboard (Edit schedule).'
    activeFrom  = "$($s.activeFrom)"
    activeUntil = "$($s.activeUntil)"
    blocks      = $blocks
  }
  if ($s.games) {
    $free = [ordered]@{}
    foreach ($d in $DayNames) { $free[$d] = "$($s.games.freeAfter.$d)" }
    $out.games = [ordered]@{
      _readme   = 'Games stay closed until freeAfter each day (on top of the study blocks). 00:00 = only block during study blocks. curfew null = no curfew.'
      freeAfter = $free
      curfew    = $(if ($s.games.curfew) { "$($s.games.curfew)" } else { $null })
    }
  }
  # Calendar: editors send only url + prefix. Keep the last sync if the link didn't change.
  $cal = $s.calendar
  if ($cal -and "$($cal.url)".Trim()) {
    $url = "$($cal.url)".Trim()
    # Sync results only count for the link they were fetched from
    $old = try { (Get-Content -Raw -LiteralPath $path -ErrorAction Stop | ConvertFrom-Json).calendar } catch { $null }
    $sync = if ($null -ne $cal.events -and (-not $old -or "$($old.url)" -eq $url)) { $cal } elseif ($old -and "$($old.url)" -eq $url) { $old } else { $null }
    $out.calendar = [ordered]@{
      _readme  = 'Google Calendar secret iCal address. Once synced, its timed events whose title starts with prefix replace the weekly blocks. The game blocker re-syncs every 10 minutes.'
      url      = $url
      prefix   = "$($cal.prefix)".Trim()
      syncedAt = $(if ($sync) { $sync.syncedAt } else { $null })
      error    = $(if ($sync) { $sync.error } else { $null })
      events   = @(if ($sync) { @($sync.events | Where-Object { $_ } | ForEach-Object { [ordered]@{ label = "$($_.label)"; date = "$($_.date)"; start = "$($_.start)"; end = "$($_.end)" } }) })
    }
  }
  $tmp = "$path.tmp"
  [IO.File]::WriteAllText($tmp, ($out | ConvertTo-Json -Depth 6), (New-Object Text.UTF8Encoding $false))
  Move-Item -Force -LiteralPath $tmp -Destination $path
}
