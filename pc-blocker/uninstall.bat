@echo off
rem Removes the IELTS Focus game blocker from startup and the Start Menu, and stops it.
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\IELTS Focus Game Blocker.lnk" 2>nul
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\IELTS Focus Game Blocker.lnk" 2>nul
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.ieltsfocus.schedule" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Edge\NativeMessagingHosts\com.ieltsfocus.schedule" /f >nul 2>&1
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='powershell.exe'\" | Where-Object { $_.CommandLine -like '*game-blocker.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
echo IELTS Focus game blocker stopped and removed from startup.
pause
