# Emergency unlock: games allowed for 15 minutes, once per day. You have to type the sentence.
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$passPath = Join-Path $root 'unlock.json'
$phrase = 'I am choosing to play instead of studying right now'
$today = (Get-Date).ToString('yyyy-MM-dd')

if (Test-Path $passPath) {
  try {
    $p = Get-Content -Raw $passPath | ConvertFrom-Json
    if ($p.date -eq $today) { Write-Host "`nToday's unlock is already used. Back to the plan." -ForegroundColor Yellow; Read-Host 'Press Enter to close'; exit }
  } catch {}
}

Write-Host "`nType exactly:`n  $phrase`n" -ForegroundColor Cyan
$typed = Read-Host '>'
if ($typed.Trim() -ne $phrase) { Write-Host 'Does not match. No unlock.' -ForegroundColor Red; Read-Host 'Press Enter to close'; exit }

$until = (Get-Date).AddMinutes(15)
@{ date = $today; until = $until.ToString('s') } | ConvertTo-Json | Set-Content -Path $passPath
Add-Content -Path (Join-Path $root 'blocker-log.txt') -Value ("{0:yyyy-MM-dd HH:mm:ss}  Emergency unlock used (15 min)" -f (Get-Date))
Write-Host ("Games unlocked until {0:HH:mm}." -f $until) -ForegroundColor Green
Read-Host 'Press Enter to close'
