@echo off
rem Installs the IELTS Focus game blocker: starts now and at every logon. No admin needed.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
pause
