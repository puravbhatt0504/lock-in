# Builds out\lockin-food.apk with the bare SDK tools (no Gradle).
$ErrorActionPreference = 'Stop'
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$bt  = "$sdk\build-tools\35.0.0"
$jar = "$sdk\platforms\android-35\android.jar"
$jdk = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot\bin'
Set-Location $PSScriptRoot

Remove-Item out -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory out\classes | Out-Null

& "$bt\aapt2.exe" compile --dir res -o out\res.zip
& "$bt\aapt2.exe" link out\res.zip -I $jar --manifest AndroidManifest.xml -o out\unsigned.apk
& "$jdk\javac.exe" -encoding UTF-8 -source 11 -target 11 -classpath $jar -d out\classes (Get-ChildItem src -Recurse -Filter *.java).FullName
if ($LASTEXITCODE) { throw 'javac failed' }
& "$bt\d8.bat" --min-api 30 --lib $jar --output out (Get-ChildItem out\classes -Recurse -Filter *.class).FullName

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::Open("$PWD\out\unsigned.apk", 'Update')
[void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, "$PWD\out\classes.dex", 'classes.dex')
$zip.Dispose()

if (-not (Test-Path signing.keystore)) {
    & "$jdk\keytool.exe" -genkeypair -keystore signing.keystore -storepass lockinfood -alias k -keyalg RSA -validity 3650 -dname CN=lockin
}
& "$bt\zipalign.exe" -p -f 4 out\unsigned.apk out\aligned.apk
& "$bt\apksigner.bat" sign --ks signing.keystore --ks-pass pass:lockinfood --out out\lockin-food.apk out\aligned.apk
if ($LASTEXITCODE) { throw 'signing failed' }
Write-Host "built $PWD\out\lockin-food.apk"
