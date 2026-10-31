# Chrome/Edge native messaging host. The extension's "Edit schedule" page sends {"schedule": {...}};
# this checks it and saves ..\chrome-extension\schedule.json. Registered by install.ps1, launched by the browser.
# Messages are a 4-byte length followed by UTF-8 JSON, both ways. Nothing else may be written to stdout.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $root 'schedule-lib.ps1')
$schedPath = Join-Path $root '..\chrome-extension\schedule.json'

$stdin = [Console]::OpenStandardInput()
$stdout = [Console]::OpenStandardOutput()

function Read-Exact($n) {
  $buf = New-Object byte[] $n
  $got = 0
  while ($got -lt $n) { $r = $stdin.Read($buf, $got, $n - $got); if ($r -le 0) { exit }; $got += $r }
  return , $buf
}
function Reply($obj) {
  $bytes = [Text.Encoding]::UTF8.GetBytes(($obj | ConvertTo-Json -Compress))
  $stdout.Write([BitConverter]::GetBytes($bytes.Length), 0, 4)
  $stdout.Write($bytes, 0, $bytes.Length)
  $stdout.Flush()
}

try {
  $len = [BitConverter]::ToInt32((Read-Exact 4), 0)
  if ($len -le 0 -or $len -gt 65536) { Reply @{ ok = $false; error = 'Message too large.' }; exit }
  $msg = [Text.Encoding]::UTF8.GetString((Read-Exact $len)) | ConvertFrom-Json
  $problem = Test-Schedule $msg.schedule
  if ($problem) { Reply @{ ok = $false; error = $problem }; exit }
  Save-Schedule $msg.schedule $schedPath
  Add-Content -Path (Join-Path $root 'blocker-log.txt') -Value ("{0:yyyy-MM-dd HH:mm:ss}  Schedule changed from the Chrome extension" -f (Get-Date))
  Reply @{ ok = $true }
} catch {
  Reply @{ ok = $false; error = "Could not save: $($_.Exception.Message)" }
}
