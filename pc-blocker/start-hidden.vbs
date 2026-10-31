' Starts game-blocker.ps1 with no console window. Used by the Startup and Start Menu shortcuts.
' Any argument (the Start Menu shortcut passes "open") also shows the dashboard.
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
extra = ""
If WScript.Arguments.Count > 0 Then extra = " -Open"
Set sh = CreateObject("WScript.Shell")
sh.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dir & "\game-blocker.ps1""" & extra, 0, False
