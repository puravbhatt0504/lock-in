$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$vbs = Join-Path $here 'start-hidden.vbs'
$shell = New-Object -ComObject WScript.Shell

# First install from a fresh clone: start from the example schedule (schedule.json is git-ignored)
$sched = Join-Path $here '..\chrome-extension\schedule.json'
if (-not (Test-Path $sched)) { Copy-Item (Join-Path $here '..\chrome-extension\schedule.example.json') $sched }

# Startup: runs hidden at every logon. Start Menu: opens the dashboard.
foreach ($l in @(
  @{ path = Join-Path ([Environment]::GetFolderPath('Startup')) 'IELTS Focus Game Blocker.lnk'; args = '"' + $vbs + '"' },
  @{ path = Join-Path ([Environment]::GetFolderPath('Programs')) 'IELTS Focus Game Blocker.lnk'; args = '"' + $vbs + '" open' }
)) {
  $lnk = $shell.CreateShortcut($l.path)
  $lnk.TargetPath = 'wscript.exe'
  $lnk.Arguments = $l.args
  $lnk.WorkingDirectory = $here
  $lnk.Description = 'IELTS Focus game blocker'
  $lnk.IconLocation = (Join-Path $here 'ielts-focus.ico') + ',0'
  $lnk.Save()
}

# Lets the extension's "Edit schedule" page save schedule.json (browser native messaging, current user only).
# The ID is fixed by the "key" in chrome-extension\manifest.json.
$hostJson = Join-Path $here 'schedule-host.json'
[ordered]@{
  name = 'com.ieltsfocus.schedule'; description = 'IELTS Focus schedule saver'
  path = Join-Path $here 'schedule-host.bat'; type = 'stdio'
  allowed_origins = @('chrome-extension://gpamkfjfdmblpjbcomemefhbpckdikek/')
} | ConvertTo-Json | Set-Content -Path $hostJson -Encoding ascii
foreach ($browser in 'Google\Chrome', 'Microsoft\Edge') {
  $key = "HKCU:\Software\$browser\NativeMessagingHosts\com.ieltsfocus.schedule"
  New-Item -Path $key -Force | Out-Null
  Set-Item -Path $key -Value $hostJson
}

# Restart so a reinstall picks up the new version
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*game-blocker.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-Process -FilePath 'wscript.exe' -ArgumentList ('"' + $vbs + '" open')
Write-Host ''
Write-Host 'IELTS Focus game blocker installed and running.' -ForegroundColor Green
Write-Host 'It starts automatically every time you log in and lives in the tray (bottom-right, by the clock).'
Write-Host 'Open the dashboard: double-click the tray icon, or Start menu > IELTS Focus Game Blocker.'
Write-Host ('Log file: ' + (Join-Path $here 'blocker-log.txt'))
Write-Host ''
