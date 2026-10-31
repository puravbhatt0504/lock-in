# IELTS Focus - PC game blocker
# Closes Riot/Valorant, Steam, Epic and any game installed through them during study blocks,
# before the daily "free after" time, and after the curfew. Reads ..\chrome-extension\schedule.json.
# Runs hidden at logon (see install.bat) with a tray icon; double-click it for the dashboard.
# -Open shows the dashboard (used by the Start Menu shortcut). Log: blocker-log.txt next to this file.
param([switch]$Open)

$ErrorActionPreference = 'SilentlyContinue'
$root      = Split-Path -Parent $MyInvocation.MyCommand.Path
$schedPath = Join-Path $root '..\chrome-extension\schedule.json'
$logPath   = Join-Path $root 'blocker-log.txt'
$passPath  = Join-Path $root 'unlock.json'
$Phrase    = 'I am choosing to play instead of studying right now'   # same sentence as unlock.ps1
. (Join-Path $root 'schedule-lib.ps1')   # Test-Schedule, Save-Schedule, $DayNames

# One copy only. A second launch with -Open asks the running copy to show its dashboard.
$mutex   = New-Object System.Threading.Mutex($false, 'Local\IELTSFocusGameBlocker')
$showEvt = New-Object System.Threading.EventWaitHandle($false, [System.Threading.EventResetMode]::AutoReset, 'Local\IELTSFocusGameBlockerShow')
if (-not $mutex.WaitOne(0)) { if ($Open) { [void]$showEvt.Set() }; exit }

$ProcessNames = @(
  'VALORANT', 'VALORANT-Win64-Shipping', 'RiotClientServices', 'RiotClientUx', 'RiotClientUxRender', 'Riot Client',
  'LeagueClient', 'LeagueClientUx',
  'steam', 'steamwebhelper',
  'EpicGamesLauncher', 'EpicWebHelper',
  'RobloxPlayerBeta', 'Minecraft.Windows', 'MinecraftLauncher', 'upc', 'UbisoftConnect', 'EADesktop', 'Origin',
  'Battle.net', 'GalaxyClient', 'REDlauncher', 'RockstarService', 'PlayGTAV'
)
# Anything running from these folders is a game or launcher (Riot Vanguard lives elsewhere and is left alone)
$PathPatterns = @('*\steamapps\*', '*\Epic Games\*', '*\Riot Games\*', '*\Rockstar Games\*', '*\Ubisoft\*', '*\XboxGames\*',
  '*\Roblox\*', '*\.minecraft\*', '*\CD Projekt RED\*', '*\GOG Galaxy\*', '*\GOG Games\*', '*\EA Games\*', '*\Electronic Arts\*',
  '*\Battle.net\*', '?:\Games\*')
# Never closed, even if Windows' game list names them (Win+G "this is a game" can be clicked on anything)
$NeverClose = @('msedge', 'chrome', 'firefox', 'brave', 'opera', 'explorer', 'powershell', 'pwsh', 'Code')

Add-Type -AssemblyName System.Windows.Forms, System.Drawing, PresentationFramework, PresentationCore, WindowsBase

# Own taskbar identity, so Windows shows our icon instead of grouping the window under PowerShell.
# Must run before any window exists.
Add-Type -Namespace IELTSFocus -Name Shell -MemberDefinition '[DllImport("shell32.dll")] public static extern int SetCurrentProcessExplicitAppUserModelID([MarshalAs(UnmanagedType.LPWStr)] string id);
[DllImport("dwmapi.dll")] public static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int value, int size);'
[void][IELTSFocus.Shell]::SetCurrentProcessExplicitAppUserModelID('IELTSFocus.GameBlocker')

# ---------- schedule logic ----------

function Log($msg) { Add-Content -Path $logPath -Value ("{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $msg) }

function Load-Schedule {
  try { $s = Get-Content -Raw -Path $schedPath | ConvertFrom-Json } catch { Log "Could not read schedule.json: $_"; return $null }
  # The calendar's secret address lives in ..\.env (kept out of git) and wins over schedule.json.
  $url = Get-EnvValue (Join-Path $root '..\.env') 'GOOGLE_CALENDAR_ICS_URL'
  if ($s -and $s.calendar -and $url) { $s.calendar.url = $url }
  return $s
}

function At($day, $hhmm) { return $day.Date.Add([TimeSpan]::Parse($hhmm)) }
function Dow($day) { return $day.DayOfWeek.ToString().Substring(0, 3) }

function Test-BlockDay($b, $day) {
  if ($b.days -notcontains (Dow $day)) { return $false }
  if ($b.from -and $day.Date -lt ([datetime]$b.from)) { return $false }
  if ($b.until -and $day.Date -gt ([datetime]$b.until)) { return $false }
  return $true
}

function Get-Reason($now, $s) {
  $today = $now.Date
  if ($today -lt ([datetime]$s.activeFrom) -or $today -gt ([datetime]$s.activeUntil)) { return $null }
  $dow = Dow $now

  foreach ($b in (Get-Blocks $s)) {
    if (-not (Test-BlockDay $b $now)) { continue }
    if ($now -ge (At $now $b.start) -and $now -lt (At $now $b.end)) { return "$($b.label) until $($b.end)" }
  }
  if ($s.games) {
    $free = $s.games.freeAfter.$dow; $c = $s.games.curfew
    if (Test-LateCurfew $now $s) {
      # After-midnight curfew (e.g. 01:30): last night's free time runs on until it, then games stay shut until today's unlock.
      if ($now -lt (At $now $c)) { return $null }
      if ($now.Hour -lt 6) { return "Curfew $c. Sleep, the morning block is at 10:00" }
    }
    if ($free -and $free -ne '00:00' -and $now -lt (At $now $free)) { return "Games unlock at $free today" }
    if ($c -and -not (Test-LateCurfew $now $s) -and $now -ge (At $now $c)) { return "Curfew $c. Sleep, the morning block is at 10:00" }
  }
  return $null
}

function Test-LateCurfew($now, $s) {
  # A curfew earlier than the day's unlock time belongs to the night before (01:30 vs 20:45).
  $free = $s.games.freeAfter.(Dow $now)
  return [bool]($s.games.curfew -and $free -and $free -ne '00:00' -and (At $now $s.games.curfew) -lt (At $now $free))
}

function Get-UpcomingBlock($now, $s) {
  # A study block starting within the next 5 minutes (for a heads-up)
  foreach ($b in (Get-Blocks $s)) {
    if (-not (Test-BlockDay $b $now)) { continue }
    $mins = ((At $now $b.start) - $now).TotalMinutes
    if ($mins -gt 0 -and $mins -le 5) { return $b }
  }
  return $null
}

function Get-ActiveBlock($now, $s) {
  if ($now.Date -lt ([datetime]$s.activeFrom) -or $now.Date -gt ([datetime]$s.activeUntil)) { return $null }
  foreach ($b in (Get-Blocks $s)) {
    if ((Test-BlockDay $b $now) -and $now -ge (At $now $b.start) -and $now -lt (At $now $b.end)) { return $b }
  }
  return $null
}

function Get-NextChange($now, $s, [bool]$toBlocked) {
  # First moment after $now when games become blocked ($true) or allowed ($false).
  # The state can only flip at midnight, a block start/end, the free-after time or the curfew.
  $times = foreach ($d in 0..2) {
    $day = $now.Date.AddDays($d)
    $day
    foreach ($b in (Get-Blocks $s)) { At $day $b.start; At $day $b.end }
    if ($s.games) { foreach ($t in @($s.games.freeAfter.(Dow $day), $s.games.curfew)) { if ($t) { At $day $t } } }
  }
  $times | Where-Object { $_ -gt $now } | Sort-Object -Unique |
    Where-Object { [bool](Get-Reason $_ $s) -eq $toBlocked } | Select-Object -First 1
}

function Get-Pass {
  if (-not (Test-Path $passPath)) { return $null }
  try { return Get-Content -Raw $passPath | ConvertFrom-Json } catch { return $null }
}
function Test-Pass { $p = Get-Pass; return [bool]($p -and (Get-Date) -lt ([datetime]$p.until)) }

$script:winGames = @{}; $script:winGamesKeys = -1
function Update-WindowsGames {
  # Windows (Game Bar) records every exe it has recognised as a game, wherever it is installed
  $reg = 'HKCU:\System\GameConfigStore\Children'
  $n = try { (Get-Item $reg -ErrorAction Stop).SubKeyCount } catch { 0 }
  if ($n -eq $script:winGamesKeys) { return }   # unchanged: skip reading ~100 keys
  $set = @{}
  foreach ($k in Get-ChildItem $reg -ErrorAction SilentlyContinue) {
    $g = Get-ItemProperty $k.PSPath
    if ($g.Type -eq 1 -and $g.MatchedExeFullPath) { $set[$g.MatchedExeFullPath] = $true }   # @{} keys ignore case
  }
  $script:winGames = $set; $script:winGamesKeys = $n
  $script:procVerdict = @{}   # a newly seen game may already be running
}

function Test-Game($name, $path) {
  if ($NeverClose -contains $name) { return $false }
  if ($ProcessNames -contains $name) { return $true }
  if (-not $path) { return $false }
  return $script:winGames.ContainsKey($path) -or [bool]($PathPatterns | Where-Object { $path -like $_ })
}

$script:procVerdict = @{}   # "pid|name" -> is it a game. Reading .Path opens the process, so do it once per process.
function Get-GameProcesses {
  Update-WindowsGames
  $seen = @{}
  foreach ($p in Get-Process) {
    $k = "$($p.Id)|$($p.ProcessName)"
    $seen[$k] = $true
    $v = $script:procVerdict[$k]
    if ($null -eq $v) {
      $v = Test-Game $p.ProcessName $p.Path
      $script:procVerdict[$k] = $v
    }
    if ($v) { $p }
  }
  foreach ($k in @($script:procVerdict.Keys)) { if (-not $seen.ContainsKey($k)) { $script:procVerdict.Remove($k) } }
}

function Format-When($t, $now) {
  $span = $t - $now
  $day = if ($t.Date -eq $now.Date) { 'at' } elseif ($t.Date -eq $now.Date.AddDays(1)) { 'tomorrow at' } else { $t.ToString('ddd') + ' at' }
  $in = if ($span.TotalHours -ge 1) { '{0}h {1}m' -f [int][math]::Floor($span.TotalHours), $span.Minutes } else { '{0}m' -f [int][math]::Max(1, [math]::Ceiling($span.TotalMinutes)) }
  return '{0} {1:HH:mm} (in {2})' -f $day, $t, $in
}

function Get-State($now, [bool]$full = $true) {
  # $full = $false skips the next-change search (only the dashboard shows it; the tray needs kind + title)
  $s = $script:schedule
  if (-not $s) { return @{ kind = 'idle'; title = 'Schedule not found'; detail = 'Could not read chrome-extension\schedule.json.'; when = '' } }
  $reason = Get-Reason $now $s
  $p = Get-Pass
  if ($reason -and $p -and $now -lt ([datetime]$p.until)) {
    return @{ kind = 'pass'; title = 'Emergency pass active'; detail = "Otherwise blocked: $reason."; when = 'Games close again ' + (Format-When ([datetime]$p.until) $now); at = [datetime]$p.until; prefix = 'Games close again' }
  }
  if ($reason) {
    $t = if ($full) { Get-NextChange $now $s $false }
    $when = if ($t) { 'Games allowed ' + (Format-When $t $now) } else { '' }
    $detail = if ($reason -like 'Games unlock*') { 'Study first. Games stay closed until free time starts.' } else { "$reason." }
    return @{ kind = 'blocked'; title = 'Games blocked'; detail = $detail; when = $when; at = $t; prefix = 'Games allowed' }
  }
  if ($now.Date -lt ([datetime]$s.activeFrom) -or $now.Date -gt ([datetime]$s.activeUntil)) {
    $range = '{0:d MMM} - {1:d MMM}' -f ([datetime]$s.activeFrom), ([datetime]$s.activeUntil)
    return @{ kind = 'idle'; title = 'Blocker idle'; detail = "Outside the study plan ($range). Nothing is blocked."; when = '' }
  }
  $t = if ($full) { Get-NextChange $now $s $true }
  $when = if ($t) { 'Next lock ' + (Format-When $t $now) } else { '' }
  return @{ kind = 'free'; title = 'Games allowed'; detail = 'No study block right now. You earned it.'; when = $when; at = $t; prefix = 'Next lock' }
}

function Get-TodayRows($now) {
  $s = $script:schedule
  if (-not $s -or $now.Date -lt ([datetime]$s.activeFrom) -or $now.Date -gt ([datetime]$s.activeUntil)) { return @() }
  $rows = @()
  foreach ($b in (Get-Blocks $s)) {
    if (-not (Test-BlockDay $b $now)) { continue }
    $st = At $now $b.start; $en = At $now $b.end
    $tag = if ($now -ge $en) { 'done' } elseif ($now -ge $st) { 'now' } else { 'later' }
    $rows += [pscustomobject]@{ at = $st; time = "$($b.start) - $($b.end)"; label = $b.label; tag = $tag }
  }
  if ($s.games) {
    $free = $s.games.freeAfter.(Dow $now)
    if ($free -and $free -ne '00:00') {
      $t = At $now $free
      $rows += [pscustomobject]@{ at = $t; time = $free; label = 'Games unlock'; tag = $(if ($now -ge $t) { 'done' } else { 'later' }) }
    }
    if ($s.games.curfew) {
      $t = At $now $s.games.curfew
      $tag = if ($now -lt $t) { 'later' } elseif (Test-LateCurfew $now $s) { 'done' } else { 'now' }
      $rows += [pscustomobject]@{ at = $t; time = $s.games.curfew; label = 'Curfew, games close'; tag = $tag }
    }
  }
  return $rows | Sort-Object at
}

# ---------- tray icon ----------

function New-TrayIcon($badge) {
  # Same 7.5 icon as the taskbar, at the tray's own size; a small corner badge while games are blocked or on a pass
  $n = [System.Windows.Forms.SystemInformation]::SmallIconSize.Width
  # The .ico holds PNG frames, which System.Drawing can't decode; WPF reads them, then hand over as PNG bytes
  $frames = [System.Windows.Media.Imaging.BitmapDecoder]::Create([Uri](Join-Path $root 'ielts-focus.ico'), 'None', 'OnLoad').Frames
  $fr = $frames | Where-Object { $_.PixelWidth -ge $n } | Sort-Object PixelWidth | Select-Object -First 1
  $enc = New-Object System.Windows.Media.Imaging.PngBitmapEncoder; $enc.Frames.Add($fr)
  $ms = New-Object IO.MemoryStream; $enc.Save($ms)
  $bmp = New-Object System.Drawing.Bitmap ([System.Drawing.Bitmap]::FromStream($ms)), $n, $n
  if ($badge) {
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $d = [single][math]::Max(6, $n * 0.4); $x = [single]($n - $d)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#121316'))), $x - 1, -1, $d + 2, $d + 2)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($badge))), $x + 1, 1, $d - 2, $d - 2)
    $g.Dispose()
  }
  return [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
}
$Icons = @{ blocked = New-TrayIcon '#FF4A50'; free = New-TrayIcon $null; pass = New-TrayIcon '#F2B544'; idle = New-TrayIcon $null }

$tray = New-Object System.Windows.Forms.NotifyIcon
$tray.Icon = $Icons.idle
$tray.Text = 'IELTS Focus game blocker'
$tray.Visible = $true

function Notify($title, $text) {
  $tray.BalloonTipTitle = $title
  $tray.BalloonTipText = $text
  $tray.ShowBalloonTip(8000)
}

# ---------- dashboard window ----------

$xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="IELTS Focus - Game Blocker" Width="480" SizeToContent="Height" ResizeMode="CanMinimize"
        WindowStartupLocation="CenterScreen" Background="#121316" FontFamily="Segoe UI" Foreground="#F3F2EF"
        UseLayoutRounding="True" TextOptions.TextFormattingMode="Display">
  <Window.Resources>
    <Style x:Key="Btn" TargetType="Button">
      <Setter Property="Background" Value="#24252B"/>
      <Setter Property="Foreground" Value="#F3F2EF"/>
      <Setter Property="BorderBrush" Value="#34353D"/>
      <Setter Property="FontSize" Value="13"/>
      <Setter Property="FontWeight" Value="SemiBold"/>
      <Setter Property="Padding" Value="16,9"/>
      <Setter Property="Cursor" Value="Hand"/>
      <Setter Property="FocusVisualStyle" Value="{x:Null}"/>
      <Setter Property="Template">
        <Setter.Value>
          <ControlTemplate TargetType="Button">
            <Grid x:Name="root" RenderTransformOrigin="0.5,0.5">
              <Border x:Name="bd" Background="{TemplateBinding Background}" BorderBrush="{TemplateBinding BorderBrush}" BorderThickness="1" CornerRadius="8"/>
              <Border x:Name="hl" Background="#FFFFFF" CornerRadius="8" Opacity="0"/>
              <ContentPresenter Margin="{TemplateBinding Padding}" HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Grid>
            <ControlTemplate.Triggers>
              <Trigger Property="IsMouseOver" Value="True"><Setter TargetName="hl" Property="Opacity" Value="0.07"/></Trigger>
              <Trigger Property="IsPressed" Value="True">
                <Setter TargetName="hl" Property="Opacity" Value="0.13"/>
                <Setter TargetName="root" Property="RenderTransform"><Setter.Value><ScaleTransform ScaleX="0.98" ScaleY="0.98"/></Setter.Value></Setter>
              </Trigger>
              <Trigger Property="IsKeyboardFocused" Value="True"><Setter TargetName="bd" Property="BorderBrush" Value="#F3F2EF"/></Trigger>
              <Trigger Property="IsEnabled" Value="False"><Setter TargetName="root" Property="Opacity" Value="0.4"/></Trigger>
            </ControlTemplate.Triggers>
          </ControlTemplate>
        </Setter.Value>
      </Setter>
    </Style>
    <Style x:Key="Primary" TargetType="Button" BasedOn="{StaticResource Btn}">
      <Setter Property="Background" Value="#E3242B"/>
      <Setter Property="Foreground" Value="#FFFFFF"/>
      <Setter Property="BorderBrush" Value="#E3242B"/>
    </Style>
    <Style x:Key="Card" TargetType="Border">
      <Setter Property="Background" Value="#1A1B20"/>
      <Setter Property="BorderBrush" Value="#2A2B31"/>
      <Setter Property="BorderThickness" Value="1"/>
      <Setter Property="CornerRadius" Value="12"/>
      <Setter Property="Padding" Value="18,15,18,16"/>
      <Setter Property="Margin" Value="0,0,0,12"/>
    </Style>
    <Style x:Key="Kicker" TargetType="TextBlock">
      <Setter Property="FontFamily" Value="Bahnschrift"/>
      <Setter Property="FontWeight" Value="SemiBold"/>
      <Setter Property="FontSize" Value="11.5"/>
      <Setter Property="Foreground" Value="#8C8B86"/>
      <Setter Property="Margin" Value="0,0,0,10"/>
    </Style>
    <Style x:Key="Field" TargetType="TextBox">
      <Setter Property="Background" Value="#141519"/>
      <Setter Property="Foreground" Value="#F3F2EF"/>
      <Setter Property="BorderBrush" Value="#34353D"/>
      <Setter Property="CaretBrush" Value="#F3F2EF"/>
      <Setter Property="SelectionBrush" Value="#E3242B"/>
      <Setter Property="FontSize" Value="13.5"/>
      <Setter Property="Padding" Value="8,0"/>
      <Setter Property="Height" Value="34"/>
      <Setter Property="VerticalContentAlignment" Value="Center"/>
      <Setter Property="Template">
        <Setter.Value>
          <ControlTemplate TargetType="TextBox">
            <Border x:Name="bd" Background="{TemplateBinding Background}" BorderBrush="{TemplateBinding BorderBrush}" BorderThickness="1" CornerRadius="7">
              <Grid>
                <ScrollViewer x:Name="PART_ContentHost" Focusable="False" VerticalAlignment="Center"
                              HorizontalScrollBarVisibility="Hidden" VerticalScrollBarVisibility="Hidden"/>
                <TextBlock x:Name="hint" Text="{Binding Tag, RelativeSource={RelativeSource TemplatedParent}}" Foreground="#5E5D5A"
                           Margin="10,0" VerticalAlignment="Center" IsHitTestVisible="False" Visibility="Collapsed" TextTrimming="CharacterEllipsis"/>
              </Grid>
            </Border>
            <ControlTemplate.Triggers>
              <Trigger Property="Text" Value=""><Setter TargetName="hint" Property="Visibility" Value="Visible"/></Trigger>
              <Trigger Property="IsMouseOver" Value="True"><Setter TargetName="bd" Property="BorderBrush" Value="#4A4B54"/></Trigger>
              <Trigger Property="IsKeyboardFocused" Value="True"><Setter TargetName="bd" Property="BorderBrush" Value="#E3242B"/></Trigger>
            </ControlTemplate.Triggers>
          </ControlTemplate>
        </Setter.Value>
      </Setter>
    </Style>
    <Style x:Key="Day" TargetType="ToggleButton">
      <Setter Property="Width" Value="46"/>
      <Setter Property="Height" Value="30"/>
      <Setter Property="Margin" Value="0,0,6,0"/>
      <Setter Property="FontSize" Value="12"/>
      <Setter Property="FontWeight" Value="SemiBold"/>
      <Setter Property="Foreground" Value="#A9A8A3"/>
      <Setter Property="Cursor" Value="Hand"/>
      <Setter Property="FocusVisualStyle" Value="{x:Null}"/>
      <Setter Property="Template">
        <Setter.Value>
          <ControlTemplate TargetType="ToggleButton">
            <Border x:Name="bd" Background="#1F2025" BorderBrush="#34353D" BorderThickness="1" CornerRadius="8">
              <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
            </Border>
            <ControlTemplate.Triggers>
              <Trigger Property="IsMouseOver" Value="True"><Setter TargetName="bd" Property="BorderBrush" Value="#4A4B54"/></Trigger>
              <Trigger Property="IsChecked" Value="True">
                <Setter TargetName="bd" Property="Background" Value="#E3242B"/>
                <Setter TargetName="bd" Property="BorderBrush" Value="#E3242B"/>
                <Setter Property="Foreground" Value="#FFFFFF"/>
              </Trigger>
              <Trigger Property="IsKeyboardFocused" Value="True"><Setter TargetName="bd" Property="BorderBrush" Value="#F3F2EF"/></Trigger>
            </ControlTemplate.Triggers>
          </ControlTemplate>
        </Setter.Value>
      </Setter>
    </Style>
    <Style TargetType="ToolTip">
      <Setter Property="Background" Value="#24252B"/>
      <Setter Property="Foreground" Value="#F3F2EF"/>
      <Setter Property="BorderBrush" Value="#34353D"/>
      <Setter Property="Padding" Value="9,5"/>
      <Setter Property="FontSize" Value="12.5"/>
    </Style>
    <Style TargetType="ScrollBar">
      <Setter Property="Width" Value="10"/>
      <Setter Property="MinWidth" Value="10"/>
      <Setter Property="Template">
        <Setter.Value>
          <ControlTemplate TargetType="ScrollBar">
            <Track x:Name="PART_Track" IsDirectionReversed="True">
              <Track.Thumb>
                <Thumb>
                  <Thumb.Template>
                    <ControlTemplate TargetType="Thumb"><Border Background="#3A3B43" CornerRadius="3" Margin="2,2"/></ControlTemplate>
                  </Thumb.Template>
                </Thumb>
              </Track.Thumb>
            </Track>
          </ControlTemplate>
        </Setter.Value>
      </Setter>
    </Style>
  </Window.Resources>
  <StackPanel x:Name="Root">
    <StackPanel.RenderTransform><TranslateTransform/></StackPanel.RenderTransform>
    <Grid Margin="22,20,22,0">
      <StackPanel Orientation="Horizontal">
        <Image x:Name="Logo" Width="40" Height="40" RenderOptions.BitmapScalingMode="HighQuality"/>
        <StackPanel Margin="12,0,0,0" VerticalAlignment="Center">
          <TextBlock Text="IELTS Focus" FontFamily="Bahnschrift" FontWeight="SemiBold" FontSize="19"/>
          <TextBlock Text="Game blocker" FontSize="12" Foreground="#8C8B86" Margin="0,1,0,0"/>
        </StackPanel>
      </StackPanel>
      <StackPanel HorizontalAlignment="Right" VerticalAlignment="Center">
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,-4,0,-2">
          <TextBlock x:Name="Clock" FontFamily="Bahnschrift" FontWeight="Light" FontSize="30"/>
          <TextBlock x:Name="ClockSec" FontFamily="Bahnschrift" FontWeight="Light" FontSize="15" Foreground="#6F6E6A" VerticalAlignment="Bottom" Margin="3,0,0,5"/>
        </StackPanel>
        <TextBlock x:Name="DateText" FontSize="12" Foreground="#8C8B86" HorizontalAlignment="Right"/>
      </StackPanel>
    </Grid>
    <StackPanel Margin="22,18,22,0">
      <Grid>
        <TextBlock x:Name="PlanText" FontFamily="Bahnschrift" FontSize="12.5" Foreground="#A9A8A3"/>
        <TextBlock x:Name="PlanLeft" FontFamily="Bahnschrift" FontSize="12.5" Foreground="#A9A8A3" HorizontalAlignment="Right"/>
      </Grid>
      <Grid Margin="0,7,0,0">
        <Border Height="4" CornerRadius="2" Background="#24252B"/>
        <Border x:Name="PlanFill" Height="4" CornerRadius="2" Background="#E3242B"/>
      </Grid>
    </StackPanel>
    <StackPanel Margin="22,18,22,16">
      <Border x:Name="StatusCard" CornerRadius="14" Padding="20,16,20,18" Margin="0,0,0,12" BorderThickness="1">
        <Grid>
        <Grid.ColumnDefinitions><ColumnDefinition/><ColumnDefinition Width="Auto"/></Grid.ColumnDefinitions>
        <Grid x:Name="Ring" Grid.Column="1" Width="96" Height="96" Margin="14,0,0,0" VerticalAlignment="Center" Visibility="Collapsed">
          <Path Stroke="#1AFFFFFF" StrokeThickness="7"><Path.Data><EllipseGeometry Center="48,48" RadiusX="41" RadiusY="41"/></Path.Data></Path>
          <Path x:Name="RingArc" StrokeThickness="7" StrokeStartLineCap="Round" StrokeEndLineCap="Round"/>
          <StackPanel VerticalAlignment="Center" HorizontalAlignment="Center">
            <TextBlock x:Name="RingNum" FontFamily="Bahnschrift" FontWeight="SemiBold" FontSize="21" HorizontalAlignment="Center"/>
            <TextBlock x:Name="RingUnit" FontSize="10.5" Foreground="#A9A8A3" HorizontalAlignment="Center" Margin="0,-1,0,0"/>
          </StackPanel>
        </Grid>
        <StackPanel>
          <StackPanel Orientation="Horizontal">
            <Ellipse x:Name="StatusDot" Width="8" Height="8" VerticalAlignment="Center" Margin="0,0,8,0"/>
            <TextBlock x:Name="StatusKicker" FontFamily="Bahnschrift" FontWeight="SemiBold" FontSize="11.5"/>
          </StackPanel>
          <TextBlock x:Name="StatusTitle" FontFamily="Bahnschrift" FontWeight="SemiBold" FontSize="28" Margin="0,6,0,0"/>
          <TextBlock x:Name="StatusDetail" FontSize="13.5" TextWrapping="Wrap" Margin="0,3,0,0" Foreground="#C9C8C3"/>
          <TextBlock x:Name="BlockSpan" FontFamily="Bahnschrift" FontSize="12.5" Foreground="#A9A8A3" Margin="0,8,0,0" Visibility="Collapsed"/>
          <TextBlock x:Name="StatusWhen" FontFamily="Bahnschrift" FontWeight="SemiBold" FontSize="14" Margin="0,12,0,0"/>
        </StackPanel>
        </Grid>
      </Border>
      <Border Style="{StaticResource Card}">
        <StackPanel>
          <Grid>
            <TextBlock Text="TODAY" Style="{StaticResource Kicker}"/>
            <TextBlock x:Name="TodayCount" Style="{StaticResource Kicker}" HorizontalAlignment="Right"/>
          </Grid>
          <StackPanel x:Name="TodayList"/>
        </StackPanel>
      </Border>
      <Border Style="{StaticResource Card}">
        <StackPanel>
          <TextBlock Text="RECENTLY CLOSED" Style="{StaticResource Kicker}"/>
          <StackPanel x:Name="LogList"/>
        </StackPanel>
      </Border>
      <Border x:Name="UnlockPanel" Style="{StaticResource Card}" Visibility="Collapsed" Background="#211C12" BorderBrush="#4A3B1C">
        <StackPanel>
          <TextBlock Text="EMERGENCY UNLOCK" Style="{StaticResource Kicker}" Foreground="#F2B544"/>
          <TextBlock TextWrapping="Wrap" FontSize="13" Foreground="#C9C8C3"
                     Text="15 minutes of games, once a day. Type this sentence exactly (pasting is off):"/>
          <TextBlock x:Name="PhraseText" TextWrapping="Wrap" FontSize="13.5" FontWeight="SemiBold" Margin="0,6,0,10"/>
          <TextBox x:Name="PhraseBox" Style="{StaticResource Field}" AllowDrop="False"/>
          <Grid Margin="0,8,0,0">
            <Border Height="4" CornerRadius="2" Background="#14FFFFFF" Margin="0,0,52,0" VerticalAlignment="Center"/>
            <Border x:Name="PhraseFill" Height="4" CornerRadius="2" Background="#F2B544" Margin="0,0,52,0" VerticalAlignment="Center"/>
            <TextBlock x:Name="PhraseCount" FontFamily="Bahnschrift" FontSize="12" Foreground="#A9A8A3" HorizontalAlignment="Right"/>
          </Grid>
          <Grid Margin="0,10,0,0">
            <TextBlock x:Name="UnlockMsg" FontSize="12.5" Foreground="#FF6B6F" VerticalAlignment="Center" TextWrapping="Wrap" Margin="0,0,130,0"/>
            <Button x:Name="UnlockGo" Content="Unlock 15 min" Style="{StaticResource Primary}" HorizontalAlignment="Right" IsDefault="True"/>
          </Grid>
        </StackPanel>
      </Border>
      <Grid Margin="0,2,0,0">
        <Button x:Name="UnlockBtn" Content="Emergency unlock" Style="{StaticResource Btn}" HorizontalAlignment="Left"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
          <Button x:Name="LogBtn" Content="Open log" Style="{StaticResource Btn}" Margin="0,0,8,0"/>
          <Button x:Name="EditBtn" Content="Edit schedule" Style="{StaticResource Primary}"/>
        </StackPanel>
      </Grid>
      <TextBlock x:Name="CalLine" FontSize="11.5" Foreground="#8C8B86" Margin="0,16,0,0" HorizontalAlignment="Center" TextWrapping="Wrap" TextAlignment="Center"/>
      <TextBlock Text="Closing this window keeps the blocker running in the tray." FontSize="11.5" Foreground="#6F6E6A"
                 Margin="0,3,0,0" HorizontalAlignment="Center"/>
    </StackPanel>
  </StackPanel>
</Window>
'@

$app = New-Object System.Windows.Application
$app.ShutdownMode = 'OnExplicitShutdown'
$app.add_DispatcherUnhandledException({ param($s, $e) Log "UI error: $($e.Exception.Message)"; $e.Handled = $true })
$script:ending = $false
$app.add_SessionEnding({ $script:ending = $true })

$win = [Windows.Markup.XamlReader]::Parse($xaml)
$ui = @{}
foreach ($n in 'Clock', 'DateText', 'StatusCard', 'StatusTitle', 'StatusDetail', 'StatusWhen', 'TodayList', 'LogList',
               'UnlockPanel', 'PhraseText', 'PhraseBox', 'UnlockMsg', 'UnlockGo', 'UnlockBtn', 'LogBtn', 'EditBtn',
               'Logo', 'PlanText', 'PlanLeft', 'PlanFill', 'StatusDot', 'StatusKicker', 'BlockSpan', 'CalLine',
               'Root', 'ClockSec', 'Ring', 'RingArc', 'RingNum', 'RingUnit', 'TodayCount', 'PhraseFill', 'PhraseCount') { $ui[$n] = $win.FindName($n) }
$ui.PhraseText.Text = $Phrase

$brushes = New-Object System.Windows.Media.BrushConverter
function Brush($hex) { return $brushes.ConvertFromString($hex) }
# kind -> card background, card border, accent, kicker
$Palette = @{
  blocked = @('#241517', '#4A2125', '#FF5A5F', 'LOCKED')
  free    = @('#13221B', '#22402F', '#4CC38A', 'FREE TIME')
  pass    = @('#251F12', '#4A3B1C', '#F2B544', 'PASS ACTIVE')
  idle    = @('#1A1B20', '#2A2B31', '#A9A8A3', 'IDLE')
}
# Title bar + taskbar. OnLoad reads the file once instead of keeping it locked.
$icoFrames = [System.Windows.Media.Imaging.BitmapDecoder]::Create([Uri](Join-Path $root 'ielts-focus.ico'), 'None', 'OnLoad').Frames
$win.Icon = $icoFrames[0]
$ui.Logo.Source = $icoFrames | Sort-Object PixelWidth | Select-Object -Last 1

function Set-DarkTitle($w) {
  # Dark title bar matching the window (Windows 11; older builds ignore it)
  $h = (New-Object System.Windows.Interop.WindowInteropHelper $w).EnsureHandle()
  $on = 1; [void][IELTSFocus.Shell]::DwmSetWindowAttribute($h, 20, [ref]$on, 4)
  $cap = 0x161312; [void][IELTSFocus.Shell]::DwmSetWindowAttribute($h, 35, [ref]$cap, 4)   # #121316 as 0x00BBGGRR
}
Set-DarkTitle $win

function New-Row($time, $label, $tag, $tip) {
  # tag: done | now | later | none
  $tagText, $tagBg, $tagFg, $dot = switch ($tag) {
    'done'  { 'Done', '#16261E', '#4CC38A', '#4CC38A' }
    'now'   { 'Now', '#E3242B', '#FFFFFF', '#E3242B' }
    'later' { 'Later', '#24252B', '#A9A8A3', '#4A4B54' }
    default { '', '#1A1B20', '#1A1B20', '#4A4B54' }
  }
  $labelFg = if ($tag -eq 'done') { '#8C8B86' } else { '#F3F2EF' }
  $show = if ($tagText) { 'Visible' } else { 'Collapsed' }
  $dotShow = if ($time) { 'Visible' } else { 'Collapsed' }
  $esc = { param($t) [System.Security.SecurityElement]::Escape([string]$t) }
  return [Windows.Markup.XamlReader]::Parse(@"
<Border xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" CornerRadius="8" Padding="8,5" Margin="-8,0" Background="Transparent" ToolTip="$(& $esc $tip)" ToolTipService.IsEnabled="$([bool]$tip)">
<Border.Style><Style TargetType="Border"><Style.Triggers><Trigger Property="IsMouseOver" Value="True"><Setter Property="Background" Value="#22232A"/></Trigger></Style.Triggers></Style></Border.Style>
<Grid>
  <Grid.ColumnDefinitions><ColumnDefinition Width="Auto"/><ColumnDefinition Width="Auto"/><ColumnDefinition Width="*"/><ColumnDefinition Width="Auto"/></Grid.ColumnDefinitions>
  <Ellipse Width="7" Height="7" Fill="$dot" Margin="0,0,12,0" VerticalAlignment="Center" Visibility="$dotShow"/>
  <TextBlock Grid.Column="1" Text="$(& $esc $time)" FontFamily="Bahnschrift" FontSize="13.5" Foreground="#A9A8A3" VerticalAlignment="Center" MinWidth="104" Visibility="$dotShow"/>
  <TextBlock Grid.Column="2" Text="$(& $esc $label)" FontSize="13.5" Foreground="$labelFg" VerticalAlignment="Center" TextTrimming="CharacterEllipsis"/>
  <Border Grid.Column="3" CornerRadius="6" Padding="8,2,8,3" Background="$tagBg" Visibility="$show" VerticalAlignment="Center">
    <TextBlock Text="$tagText" FontFamily="Bahnschrift" FontSize="11.5" FontWeight="SemiBold" Foreground="$tagFg"/>
  </Border>
</Grid>
</Border>
"@)
}

function New-Anim($from, $to, $ms) {
  $a = New-Object System.Windows.Media.Animation.DoubleAnimation ([double]$from), ([double]$to), ([System.Windows.Duration][TimeSpan]::FromMilliseconds($ms))
  $a.EasingFunction = New-Object System.Windows.Media.Animation.CubicEase -Property @{ EasingMode = 'EaseOut' }
  return $a
}

function Set-Fill($bar, $frac) {
  # Progress bars grow smoothly to their new value
  if ($bar.RenderTransform -isnot [System.Windows.Media.ScaleTransform] -or $bar.RenderTransform.IsFrozen) { $bar.RenderTransform = New-Object System.Windows.Media.ScaleTransform 0.0, 1.0 }
  $bar.RenderTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleXProperty, (New-Anim $bar.RenderTransform.ScaleX $frac 700))
}

function Set-Ring($frac) {
  $frac = [math]::Min(0.9999, [math]::Max(0.0001, $frac))
  $r = 41.0; $c = 48.0; $ang = $frac * 2 * [math]::PI
  $inv = [Globalization.CultureInfo]::InvariantCulture
  $ui.RingArc.Data = [System.Windows.Media.Geometry]::Parse([string]::Format($inv, 'M {0},{1} A {2},{2} 0 {3} 1 {4:0.##},{5:0.##}',
    $c, ($c - $r), $r, [int]($frac -gt 0.5), ($c + $r * [math]::Sin($ang)), ($c - $r * [math]::Cos($ang))))
}

function Format-Count($span) {
  if ($span.TotalHours -ge 1) { return '{0}:{1:mm}:{1:ss}' -f [int][math]::Floor($span.TotalHours), $span }
  return '{0:mm}:{0:ss}' -f $span
}

function Update-Live {
  # Runs every second while the dashboard is open: clock, countdown, ring
  if (-not $win.IsVisible) { return }
  $now = Get-Date
  $ui.Clock.Text = $now.ToString('HH:mm')
  $ui.ClockSec.Text = $now.ToString('ss')
  $l = $script:live
  if (-not $l) { return }
  if ($l.at -and $l.at -gt $now) {
    $ui.StatusWhen.Text = '{0} in {1}  {4}  {2:HH:mm}{3}' -f $l.prefix, (Format-Count ($l.at - $now)), $l.at, $(if ($l.at.Date -ne $now.Date) { ' ' + $l.at.ToString('ddd') } else { '' }), [char]0xB7
  }
  if ($l.to) {
    $left = $l.to - $now
    Set-Ring (($now - $l.from).TotalSeconds / [math]::Max(1.0, ($l.to - $l.from).TotalSeconds))
    if ($left.TotalMinutes -lt 10) { $ui.RingNum.Text = Format-Count $left; $ui.RingUnit.Text = 'left' }
    else { $ui.RingNum.Text = [string][math]::Ceiling($left.TotalMinutes); $ui.RingUnit.Text = $l.unit }
  }
}

function Update-PhraseMeter {
  # Shows how much of the sentence is typed correctly; turns red on a typo, green when it matches
  $t = $ui.PhraseBox.Text
  $ok = 0
  while ($ok -lt $t.Length -and $ok -lt $Phrase.Length -and $t[$ok] -ceq $Phrase[$ok]) { $ok++ }
  $typo = $ok -lt $t.Length
  $done = $t.Trim() -ceq $Phrase
  Set-Fill $ui.PhraseFill ($ok / $Phrase.Length)
  $ui.PhraseFill.Background = Brush $(if ($done) { '#4CC38A' } elseif ($typo) { '#FF5A5F' } else { '#F2B544' })
  $ui.PhraseCount.Text = '{0}/{1}' -f $ok, $Phrase.Length
  $ui.PhraseBox.BorderBrush = Brush $(if ($typo) { '#FF5A5F' } elseif ($done) { '#4CC38A' } else { '#34353D' })
  $ui.UnlockGo.IsEnabled = $done
}

function Update-Dashboard($st) {
  if (-not $win.IsVisible) { return }
  $now = Get-Date
  $ui.DateText.Text = $now.ToString('ddd d MMM')

  $s = $script:schedule
  $c = $Palette[$st.kind]
  $ui.StatusCard.Background = Brush $c[0]
  $ui.StatusCard.BorderBrush = Brush $c[1]
  $ui.StatusDot.Fill = Brush $c[2]
  $ui.StatusKicker.Foreground = Brush $c[2]
  $ui.StatusWhen.Foreground = Brush $c[2]
  $ui.RingArc.Stroke = Brush $c[2]
  $blk = if ($s -and $st.kind -ne 'idle') { Get-ActiveBlock $now $s }
  $ui.StatusKicker.Text = if ($blk) { "$($blk.label)".ToUpper() } else { $c[3] }
  # What the ring counts down: the study block, or the emergency pass
  $script:live = @{ at = $st.at; prefix = $st.prefix; from = $null; to = $null; unit = '' }
  if ($st.kind -eq 'pass') { $script:live.from = $st.at.AddMinutes(-15); $script:live.to = $st.at; $script:live.unit = 'pass left' }
  elseif ($blk) { $script:live.from = At $now $blk.start; $script:live.to = At $now $blk.end; $script:live.unit = 'min left' }
  $ui.Ring.Visibility = if ($script:live.to) { 'Visible' } else { 'Collapsed' }
  $ui.BlockSpan.Text = if ($blk) { "$($blk.start) - $($blk.end)" } else { '' }
  $ui.BlockSpan.Visibility = if ($blk -and $st.kind -ne 'pass') { 'Visible' } else { 'Collapsed' }
  if ($st.kind -ne $script:lastKind) {
    # State changed: fade the card in, and pulse the dot while games are blocked
    $script:lastKind = $st.kind
    $ui.StatusCard.BeginAnimation([System.Windows.UIElement]::OpacityProperty, (New-Anim 0.35 1 450))
    $pulse = if ($st.kind -eq 'blocked') { $a = New-Anim 1 0.25 900; $a.AutoReverse = $true; $a.RepeatBehavior = [System.Windows.Media.Animation.RepeatBehavior]::Forever; $a }
    $ui.StatusDot.BeginAnimation([System.Windows.UIElement]::OpacityProperty, $pulse)
  }

  if ($s) {
    $from = [datetime]$s.activeFrom; $to = [datetime]$s.activeUntil
    $total = ($to - $from).Days + 1; $day = ($now.Date - $from).Days + 1
    $ui.PlanText.Text = if ($day -lt 1) { 'Plan starts {0:d MMM}' -f $from } elseif ($day -gt $total) { 'Plan finished' } else { "Day $day of $total" }
    $left = ($to - $now.Date).Days
    $ui.PlanLeft.Text = if ($left -gt 1) { "$left days to go" } elseif ($left -eq 1) { '1 day to go' } elseif ($left -eq 0) { 'Last day' } else { '' }
    Set-Fill $ui.PlanFill ([math]::Min(1.0, [math]::Max(0.0, $day / $total)))
    $cal = $s.calendar
    $ui.CalLine.Text = if (-not $cal.url) { 'Using weekly blocks. Connect Google Calendar in Edit schedule.' }
      elseif ($cal.error) { 'Google Calendar sync failed. Open Edit schedule for details.' }
      elseif ($cal.syncedAt) { 'Google Calendar synced {0:HH:mm}' -f [datetime]$cal.syncedAt }
      else { 'Connecting to Google Calendar...' }
  }
  $ui.StatusTitle.Text = $st.title
  Update-Live
  $ui.StatusDetail.Text = $st.detail
  $ui.StatusWhen.Visibility = if ($st.when) { 'Visible' } else { 'Collapsed' }

  $ui.TodayList.Children.Clear()
  $rows = @(Get-TodayRows $now)
  if ($rows.Count -eq 0) { [void]$ui.TodayList.Children.Add((New-Row '' 'No study blocks today' 'none')) }
  foreach ($r in $rows) {
    $tip = switch ($r.tag) { 'later' { 'Starts ' + (Format-When $r.at $now) } 'now' { 'Happening now' } 'done' { 'Done for today' } }
    [void]$ui.TodayList.Children.Add((New-Row $r.time $r.label $r.tag $tip))
  }
  $blocksToday = @($rows | Where-Object { $_.label -notin 'Games unlock', 'Curfew, games close' })
  $ui.TodayCount.Text = if ($blocksToday.Count) { '{0} OF {1} DONE' -f @($blocksToday | Where-Object { $_.tag -eq 'done' }).Count, $blocksToday.Count } else { '' }

  $ui.LogList.Children.Clear()
  $closed = @(Get-Content $logPath -Tail 200 | Where-Object { $_ -match 'Closed: ' } | Select-Object -Last 4)
  [array]::Reverse($closed)
  if ($closed.Count -eq 0) { [void]$ui.LogList.Children.Add((New-Row '' 'Nothing closed yet' 'none')) }
  foreach ($line in $closed) {
    if ($line -match '^(\S+) (\d\d:\d\d):\d\d  Closed: (.+?) \(') {
      [void]$ui.LogList.Children.Add((New-Row (('{0:d MMM}' -f [datetime]$Matches[1]) + ' ' + $Matches[2]) $Matches[3] 'none'))
    }
  }

  $p = Get-Pass
  $usedToday = $p -and $p.date -eq $now.ToString('yyyy-MM-dd')
  $ui.UnlockBtn.IsEnabled = -not $usedToday
  $ui.UnlockBtn.Content = if ($usedToday) { 'Unlock used today' } else { 'Emergency unlock' }
  if ($usedToday) { $ui.UnlockPanel.Visibility = 'Collapsed' }
}

function Show-Dashboard {
  $fresh = -not $win.IsVisible
  $win.Show()
  $liveTimer.Start()
  if ($fresh) {
    # Slide up + fade in
    $ui.Root.BeginAnimation([System.Windows.UIElement]::OpacityProperty, (New-Anim 0 1 380))
    $ui.Root.RenderTransform.BeginAnimation([System.Windows.Media.TranslateTransform]::YProperty, (New-Anim 14 0 480))
  }
  if ($win.WindowState -eq 'Minimized') { $win.WindowState = 'Normal' }
  $win.Topmost = $true; $win.Topmost = $false   # bring to front
  [void]$win.Activate()
  Invoke-Tick
}

function Show-Unlock {
  $ui.UnlockPanel.Visibility = 'Visible'
  $ui.PhraseBox.Clear()
  Update-PhraseMeter
  $ui.UnlockPanel.BeginAnimation([System.Windows.UIElement]::OpacityProperty, (New-Anim 0 1 300))
  $ui.UnlockMsg.Text = ''
  [void]$ui.PhraseBox.Focus()
}

function Open-Log {
  if (-not (Test-Path $logPath)) { Log 'Log opened' }
  Start-Process notepad.exe -ArgumentList ('"' + $logPath + '"')
}

$win.add_Closing({ param($s, $e) if (-not $script:ending) { $e.Cancel = $true; $win.Hide(); Stop-Live } })
$win.add_StateChanged({ if ($win.WindowState -eq 'Minimized') { Stop-Live } else { $liveTimer.Start(); Invoke-Tick } })
function Stop-Live {
  # Hidden window: stop the 1-second timer and the pulsing dot so they cost nothing
  $liveTimer.Stop()
  $ui.StatusDot.BeginAnimation([System.Windows.UIElement]::OpacityProperty, $null)
  $script:lastKind = $null   # re-applies the pulse next time the window opens
}
$ui.LogBtn.add_Click({ Open-Log })
$ui.EditBtn.add_Click({ Show-Editor })
$ui.UnlockBtn.add_Click({ if ($ui.UnlockPanel.Visibility -eq 'Visible') { $ui.UnlockPanel.Visibility = 'Collapsed' } else { Show-Unlock } })
$ui.PhraseBox.add_TextChanged({ Update-PhraseMeter })
[System.Windows.DataObject]::AddPastingHandler($ui.PhraseBox, [System.Windows.DataObjectPastingEventHandler]{ param($s, $e) $e.CancelCommand() })
$ui.UnlockGo.add_Click({
  $today = (Get-Date).ToString('yyyy-MM-dd')
  $p = Get-Pass
  if ($p -and $p.date -eq $today) { $ui.UnlockMsg.Text = "Today's unlock is already used."; return }
  if ($ui.PhraseBox.Text.Trim() -ne $Phrase) { $ui.UnlockMsg.Text = 'Does not match. Type it exactly.'; return }
  $until = (Get-Date).AddMinutes(15)
  @{ date = $today; until = $until.ToString('s') } | ConvertTo-Json | Set-Content -Path $passPath
  Log 'Emergency unlock used (15 min)'
  $ui.UnlockPanel.Visibility = 'Collapsed'
  Invoke-Tick
})

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$openItem = $menu.Items.Add('Open dashboard', $null, { Show-Dashboard })
$openItem.Font = New-Object System.Drawing.Font($openItem.Font, [System.Drawing.FontStyle]::Bold)
[void]$menu.Items.Add('Emergency unlock...', $null, { Show-Dashboard; if ($ui.UnlockBtn.IsEnabled) { Show-Unlock } })
[void]$menu.Items.Add('Edit schedule...', $null, { Show-Editor })
[void]$menu.Items.Add('Open log', $null, { Open-Log })
$tray.ContextMenuStrip = $menu
$tray.add_DoubleClick({ Show-Dashboard })
$tray.add_BalloonTipClicked({ Show-Dashboard })

# ---------- schedule editor ----------

$editorXaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="IELTS Focus - Edit Schedule" Width="580" Height="800" MinWidth="580" MinHeight="420"
        WindowStartupLocation="CenterScreen" Background="#121316" FontFamily="Segoe UI" Foreground="#F3F2EF"
        UseLayoutRounding="True" TextOptions.TextFormattingMode="Display">
  <Window.Resources>
    __SHARED__
  </Window.Resources>
  <DockPanel>
    <Grid DockPanel.Dock="Top" Margin="22,20,22,8">
      <StackPanel Orientation="Horizontal">
        <Image x:Name="EdLogo" Width="40" Height="40" RenderOptions.BitmapScalingMode="HighQuality"/>
        <StackPanel Margin="12,0,0,0" VerticalAlignment="Center">
          <TextBlock Text="Edit schedule" FontFamily="Bahnschrift" FontWeight="SemiBold" FontSize="19"/>
          <TextBlock Text="Shared by the game blocker and the browser extension." FontSize="12" Foreground="#8C8B86" Margin="0,1,0,0"/>
        </StackPanel>
      </StackPanel>
    </Grid>
    <Border DockPanel.Dock="Bottom" Background="#17181C" BorderBrush="#2A2B31" BorderThickness="0,1,0,0" Padding="22,14">
      <Grid>
        <TextBlock x:Name="EdMsg" Foreground="#FF6B6F" FontSize="12.5" TextWrapping="Wrap" VerticalAlignment="Center" Margin="0,0,230,0"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
          <Button x:Name="EdCancel" Content="Cancel" Style="{StaticResource Btn}" Margin="0,0,8,0" IsCancel="True"/>
          <Button x:Name="EdSave" Content="Save schedule" Style="{StaticResource Primary}"/>
        </StackPanel>
      </Grid>
    </Border>
    <ScrollViewer VerticalScrollBarVisibility="Auto">
      <StackPanel Margin="22,12,22,8">
        <Border Style="{StaticResource Card}">
          <StackPanel>
            <TextBlock Text="STUDY PLAN" Style="{StaticResource Kicker}"/>
            <StackPanel Orientation="Horizontal">
              <TextBlock Text="Blocking runs from" VerticalAlignment="Center" Margin="0,0,10,0" FontSize="13.5"/>
              <TextBox x:Name="PlanFrom" Width="118" Style="{StaticResource Field}" Tag="YYYY-MM-DD" MaxLength="10"/>
              <TextBlock Text="to" VerticalAlignment="Center" Margin="10,0" FontSize="13.5"/>
              <TextBox x:Name="PlanUntil" Width="118" Style="{StaticResource Field}" Tag="YYYY-MM-DD" MaxLength="10"/>
            </StackPanel>
            <TextBlock Text="Outside these dates nothing is blocked." FontSize="12" Foreground="#6F6E6A" Margin="0,9,0,0"/>
          </StackPanel>
        </Border>
        <Border Style="{StaticResource Card}">
          <StackPanel>
            <TextBlock Text="GOOGLE CALENDAR" Style="{StaticResource Kicker}"/>
            <TextBlock TextWrapping="Wrap" FontSize="12.5" Foreground="#A9A8A3" Margin="0,0,0,10" LineHeight="18"
                       Text="Timed events whose title starts with the filter (separate several with commas) become your study blocks, so you add, move or delete study sessions in Google Calendar. Synced every 10 minutes. Leave the link empty to use the weekly blocks below."/>
            <TextBox x:Name="CalUrl" Style="{StaticResource Field}" Margin="0,0,0,8" Tag="Secret address in iCal format (https://calendar.google.com/calendar/ical/...)"/>
            <StackPanel Orientation="Horizontal">
              <TextBlock Text="Title starts with" VerticalAlignment="Center" Margin="0,0,10,0" FontSize="13.5"/>
              <TextBox x:Name="CalPrefix" Width="110" Style="{StaticResource Field}" MaxLength="40" Tag="all events"/>
            </StackPanel>
            <TextBlock x:Name="CalStatus" TextWrapping="Wrap" FontSize="12" Foreground="#A9A8A3" Margin="0,10,0,0"/>
            <TextBlock TextWrapping="Wrap" FontSize="12" Foreground="#6F6E6A" Margin="0,6,0,0" LineHeight="17"
                       Text="Where to find the link: calendar.google.com, Settings, click your calendar on the left, Integrate calendar, copy 'Secret address in iCal format'. Keep it private."/>
          </StackPanel>
        </Border>
        <Border Style="{StaticResource Card}">
          <StackPanel>
            <TextBlock Text="WEEKLY BLOCKS" Style="{StaticResource Kicker}"/>
            <TextBlock TextWrapping="Wrap" FontSize="12.5" Foreground="#A9A8A3" Margin="0,0,0,12" LineHeight="18"
                       Text="YouTube, anime sites and games are blocked during these. Times are 24-hour (19:15). Leave a block's dates empty to run it for the whole plan. Paused while Google Calendar is connected."/>
            <StackPanel x:Name="BlockList"/>
            <Button x:Name="AddBlock" Content="+ Add block" Style="{StaticResource Btn}" HorizontalAlignment="Left"/>
          </StackPanel>
        </Border>
        <Border Style="{StaticResource Card}">
          <StackPanel>
            <TextBlock Text="GAMES" Style="{StaticResource Kicker}"/>
            <TextBlock TextWrapping="Wrap" FontSize="12.5" Foreground="#A9A8A3" Margin="0,0,0,10" LineHeight="18"
                       Text="Outside study blocks, games stay closed until this time each day. 00:00 = only during study blocks."/>
            <UniformGrid x:Name="FreeGrid" Columns="7"/>
            <StackPanel Orientation="Horizontal" Margin="0,14,0,0">
              <TextBlock Text="Curfew: games close at" VerticalAlignment="Center" Margin="0,0,10,0" FontSize="13.5"/>
              <TextBox x:Name="Curfew" Width="70" Style="{StaticResource Field}" Tag="none"/>
              <TextBlock Text="empty = no curfew" VerticalAlignment="Center" Margin="10,0,0,0" FontSize="12" Foreground="#6F6E6A"/>
            </StackPanel>
          </StackPanel>
        </Border>
      </StackPanel>
    </ScrollViewer>
  </DockPanel>
</Window>
'@.Replace('__SHARED__', [regex]::Match($xaml, '(?s)<Window.Resources>(.*?)</Window.Resources>').Groups[1].Value)

$blockRowXaml = @'
<Border xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Background="#141519" BorderBrush="#2A2B31" BorderThickness="1" CornerRadius="10" Padding="14,12" Margin="0,0,0,10">
  <StackPanel>
    <Grid Margin="0,0,0,10">
      <TextBox x:Name="Label" Style="{DynamicResource Field}" Margin="0,0,90,0" MaxLength="60" Tag="Block name"/>
      <Button x:Name="Remove" Content="Remove" Style="{DynamicResource Btn}" Padding="12,6" HorizontalAlignment="Right"/>
    </Grid>
    <StackPanel Orientation="Horizontal" Margin="0,0,0,10">
      <ToggleButton x:Name="D_Mon" Content="Mon" Style="{DynamicResource Day}"/>
      <ToggleButton x:Name="D_Tue" Content="Tue" Style="{DynamicResource Day}"/>
      <ToggleButton x:Name="D_Wed" Content="Wed" Style="{DynamicResource Day}"/>
      <ToggleButton x:Name="D_Thu" Content="Thu" Style="{DynamicResource Day}"/>
      <ToggleButton x:Name="D_Fri" Content="Fri" Style="{DynamicResource Day}"/>
      <ToggleButton x:Name="D_Sat" Content="Sat" Style="{DynamicResource Day}"/>
      <ToggleButton x:Name="D_Sun" Content="Sun" Style="{DynamicResource Day}"/>
    </StackPanel>
    <StackPanel Orientation="Horizontal" Margin="0,0,0,8">
      <TextBlock Text="Time" Width="46" VerticalAlignment="Center" Foreground="#A9A8A3" FontSize="13"/>
      <TextBox x:Name="Start" Width="70" Style="{DynamicResource Field}" Tag="HH:MM"/>
      <TextBlock Text="to" Margin="10,0" VerticalAlignment="Center" Foreground="#A9A8A3" FontSize="13"/>
      <TextBox x:Name="End" Width="70" Style="{DynamicResource Field}" Tag="HH:MM"/>
    </StackPanel>
    <StackPanel Orientation="Horizontal">
      <TextBlock Text="Dates" Width="46" VerticalAlignment="Center" Foreground="#A9A8A3" FontSize="13"/>
      <TextBox x:Name="From" Width="118" Style="{DynamicResource Field}" Tag="YYYY-MM-DD" MaxLength="10"/>
      <TextBlock Text="to" Margin="10,0" VerticalAlignment="Center" Foreground="#A9A8A3" FontSize="13"/>
      <TextBox x:Name="Until" Width="118" Style="{DynamicResource Field}" Tag="YYYY-MM-DD" MaxLength="10"/>
      <TextBlock Text="optional" Margin="10,0,0,0" VerticalAlignment="Center" Foreground="#6F6E6A" FontSize="12"/>
    </StackPanel>
  </StackPanel>
</Border>
'@

function Add-BlockRow($b) {
  $row = [Windows.Markup.XamlReader]::Parse($blockRowXaml)
  $row.FindName('Label').Text = "$($b.label)"
  foreach ($d in $DayNames) { $row.FindName("D_$d").IsChecked = (@($b.days) -contains $d) }
  $row.FindName('Start').Text = "$($b.start)"
  $row.FindName('End').Text = "$($b.end)"
  $row.FindName('From').Text = "$($b.from)"
  $row.FindName('Until').Text = "$($b.until)"
  $rm = $row.FindName('Remove')
  $rm.Tag = $row
  $rm.add_Click({ param($sender) $script:ed.BlockList.Children.Remove($sender.Tag) })
  [void]$script:ed.BlockList.Children.Add($row)
}

function Read-Editor {
  $ymd = { param($t) $t = $t.Text.Trim(); if ($t) { $t } else { $null } }
  $blocks = @(foreach ($row in $script:ed.BlockList.Children) {
    $b = [ordered]@{
      label = $row.FindName('Label').Text
      days  = @($DayNames | Where-Object { $row.FindName("D_$_").IsChecked })
      start = $row.FindName('Start').Text.Trim()
      end   = $row.FindName('End').Text.Trim()
      from  = & $ymd $row.FindName('From')
      until = & $ymd $row.FindName('Until')
    }
    [pscustomobject]$b
  })
  $free = [ordered]@{}
  foreach ($d in $DayNames) { $free[$d] = $script:ed["Free_$d"].Text.Trim() }
  return [pscustomobject]@{
    activeFrom  = & $ymd $script:ed.PlanFrom
    activeUntil = & $ymd $script:ed.PlanUntil
    blocks      = $blocks
    games       = [pscustomobject]@{ freeAfter = [pscustomobject]$free; curfew = $script:ed.Curfew.Text.Trim() }
    calendar    = [pscustomobject]@{ url = $script:ed.CalUrl.Text.Trim(); prefix = $script:ed.CalPrefix.Text.Trim() }
  }
}

function Show-Editor {
  if ($script:edWin -and $script:edWin.IsVisible) { [void]$script:edWin.Activate(); return }
  $s = Load-Schedule
  if (-not $s) { $s = $script:schedule }
  $w = [Windows.Markup.XamlReader]::Parse($editorXaml)
  $script:edWin = $w
  $script:ed = @{}
  foreach ($n in 'EdMsg', 'EdCancel', 'EdSave', 'PlanFrom', 'PlanUntil', 'BlockList', 'AddBlock', 'FreeGrid', 'Curfew', 'CalUrl', 'CalPrefix', 'CalStatus') { $script:ed[$n] = $w.FindName($n) }
  $w.Icon = $win.Icon
  $w.FindName('EdLogo').Source = $ui.Logo.Source
  Set-DarkTitle $w

  $script:ed.PlanFrom.Text = "$($s.activeFrom)"
  $script:ed.PlanUntil.Text = "$($s.activeUntil)"
  foreach ($b in @($s.blocks | Where-Object { $_ })) { Add-BlockRow $b }
  foreach ($d in $DayNames) {
    $cell = [Windows.Markup.XamlReader]::Parse(@"
<StackPanel xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" Margin="0,0,6,0">
  <TextBlock Text="$d" FontSize="12" FontWeight="SemiBold" Foreground="#A9A8A3" Margin="0,0,0,5"/>
  <TextBox Style="{DynamicResource Field}"/>
</StackPanel>
"@)
    $cell.Children[1].Text = "$($s.games.freeAfter.$d)"
    $script:ed["Free_$d"] = $cell.Children[1]
    [void]$script:ed.FreeGrid.Children.Add($cell)
  }
  $script:ed.Curfew.Text = "$($s.games.curfew)"
  $script:ed.CalUrl.Text = "$($s.calendar.url)"
  $script:ed.CalPrefix.Text = if ($s.calendar) { "$($s.calendar.prefix)" } else { 'IELTS' }
  $script:ed.CalStatus.Text = Get-CalendarStatus $s

  # No moving the goalposts mid-block: saving waits until the block is over.
  $active = Get-ActiveBlock (Get-Date) $script:schedule
  if ($active) {
    $script:ed.EdSave.IsEnabled = $false
    $script:ed.EdMsg.Text = "Locked during $($active.label) (until $($active.end)). You can save after the block."
  }

  $script:ed.AddBlock.add_Click({ Add-BlockRow ([pscustomobject]@{ label = 'New block'; days = @('Mon', 'Tue', 'Wed', 'Thu', 'Fri'); start = '18:00'; end = '19:00' }) })
  $script:ed.EdCancel.add_Click({ $script:edWin.Close() })
  $script:ed.EdSave.add_Click({ Save-Editor })
  $w.Show()
  [void]$w.Activate()
}

function Save-Editor {
  $active = Get-ActiveBlock (Get-Date) $script:schedule
  if ($active) { $script:ed.EdMsg.Text = "Locked during $($active.label) (until $($active.end))."; return }
  $new = Read-Editor
  $problem = Test-Schedule $new
  if ($problem) { $script:ed.EdMsg.Text = $problem; return }
  try { Save-Schedule $new $schedPath } catch { $script:ed.EdMsg.Text = "Could not save: $($_.Exception.Message)"; return }
  Log 'Schedule changed from the dashboard'
  $script:schedule = Load-Schedule
  $script:calLast = [datetime]::MinValue   # sync right away
  $script:schedTime = (Get-Item $schedPath).LastWriteTime
  $script:edWin.Close()
  Invoke-Tick
  Notify 'Schedule saved' 'The game blocker uses it now. Chrome picks it up within 30 seconds.'
}

# ---------- Google Calendar sync ----------

function Get-CalendarStatus($s) {
  $c = $s.calendar
  if (-not $c -or -not $c.url) { return 'Not connected. The weekly blocks below apply.' }
  if ($c.error) { return "Last sync failed: $($c.error)" + $(if ($c.syncedAt) { ' Using the events from the last good sync.' } else { ' The weekly blocks apply until it works.' }) }
  if (-not $c.syncedAt) { return 'Connected. Waiting for the first sync...' }
  return "Synced {0:d MMM HH:mm}: {1} study events in the next 3 weeks. The weekly blocks are paused." -f ([datetime]$c.syncedAt), @($c.events | Where-Object { $_ }).Count
}

$script:calLast = [datetime]::MinValue
$script:calTask = $null

function Invoke-CalendarSync($s) {
  # Download runs in the background; the next tick picks up the result and writes schedule.json.
  if (-not $s.calendar -or -not $s.calendar.url) { return }
  if ($script:calTask) {
    if (-not $script:calTask.job.IsCompleted) { return }
    $task = $script:calTask; $script:calTask = $null
    $cur = Load-Schedule
    if (-not $cur -or $cur.calendar.url -ne $task.url) { return }   # link changed while downloading
    if ($task.job.IsFaulted) {
      $msg = $task.job.Exception.InnerException.Message
      if ($msg -match '(40[134])') { $msg = 'Google refused the link. Copy the secret address again (it changes if you reset it).' }
      $cur.calendar.error = "$msg"
      Log "Calendar sync failed: $msg"
    } else {
      try {
        $text = $task.job.Result
        if ($text -notmatch 'BEGIN:VCALENDAR') { throw 'That link did not return a calendar. Use the "Secret address in iCal format".' }
        $events = ConvertFrom-Ics $text $cur.calendar.prefix (Get-Date).Date.AddDays(-1) (Get-Date).Date.AddDays(21)
        $cur.calendar.events = @($events)
        $cur.calendar.syncedAt = (Get-Date).ToString('s')
        $cur.calendar.error = $null
      } catch { $cur.calendar.error = "$($_.Exception.Message)"; Log "Calendar sync failed: $($cur.calendar.error)" }
    }
    # Same guard as the editors: no changing blocks mid-block
    if (Get-ActiveBlock (Get-Date) $script:schedule) { $script:calLast = (Get-Date).AddMinutes(-5); return }
    Save-Schedule $cur $schedPath
    return
  }
  if (((Get-Date) - $script:calLast).TotalMinutes -lt 10) { return }
  $script:calLast = Get-Date
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
  $wc = New-Object Net.WebClient
  $wc.Encoding = [Text.Encoding]::UTF8
  $script:calTask = @{ url = $s.calendar.url; job = $wc.DownloadStringTaskAsync([Uri]$s.calendar.url) }
}

# ---------- main tick ----------

$script:schedule = Load-Schedule
$script:schedTime = (Get-Item $schedPath).LastWriteTime
$warned = @{}

function Invoke-Tick {
  try {
    $now = Get-Date
    $mtime = (Get-Item $schedPath).LastWriteTime   # edited from the extension or by hand
    if ($mtime -ne $script:schedTime) {
      $s2 = Load-Schedule
      if ($s2) {
        if ("$($s2.calendar.url)|$($s2.calendar.prefix)" -ne "$($script:schedule.calendar.url)|$($script:schedule.calendar.prefix)") { $script:calLast = [datetime]::MinValue }
        $script:schedule = $s2
      }
      $script:schedTime = $mtime
    }
    $schedule = $script:schedule
    if ($schedule) { try { Invoke-CalendarSync $schedule } catch { Log "Calendar sync error: $_" } }

    if ($schedule) {
      $up = Get-UpcomingBlock $now $schedule
      if ($up) {
        $key = '{0:yyyyMMdd}-{1}' -f $now, $up.start
        if (-not $warned.ContainsKey($key)) {
          $warned[$key] = $true
          if (Get-GameProcesses) { Notify 'Study block in 5 minutes' "$($up.label) starts at $($up.start). Games will close then. Finish the round." }
        }
      }

      $reason = Get-Reason $now $schedule
      if ($reason -and -not (Test-Pass)) {
        $procs = @(Get-GameProcesses)
        if ($procs.Count -gt 0) {
          $names = ($procs | Select-Object -ExpandProperty ProcessName -Unique) -join ', '
          $procs | Stop-Process -Force
          Log "Closed: $names ($reason)"
          Notify 'Game closed' "$reason. Check your IELTS tracker (new tab) for today's task."
        }
      }
    }

    $st = Get-State $now $win.IsVisible
    $tray.Icon = $Icons[$st.kind]
    $tip = "IELTS Focus: $($st.title)"
    $tray.Text = if ($tip.Length -gt 63) { $tip.Substring(0, 63) } else { $tip }   # NotifyIcon limit
    Update-Dashboard $st
  } catch { Log "Tick error: $_" }
}

$timer = New-Object System.Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromSeconds(10)
$timer.add_Tick({ Invoke-Tick })
$timer.Start()

$liveTimer = New-Object System.Windows.Threading.DispatcherTimer
$liveTimer.Interval = [TimeSpan]::FromSeconds(1)
$liveTimer.add_Tick({ try { Update-Live } catch { } })   # started by Show-Dashboard, stopped when hidden

$showTimer = New-Object System.Windows.Threading.DispatcherTimer
$showTimer.Interval = [TimeSpan]::FromSeconds(1)   # a second launch (Start Menu) asks us to show the window
$showTimer.add_Tick({ if ($showEvt.WaitOne(0)) { Show-Dashboard } })
$showTimer.Start()

Log 'Blocker started'
Invoke-Tick
if ($Open) { Show-Dashboard }
[void]$app.Run()
