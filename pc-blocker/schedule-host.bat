@echo off
rem Started by Chrome/Edge when the extension saves the schedule. See schedule-host.ps1.
powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%~dp0schedule-host.ps1"
