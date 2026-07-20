# SmartBloodLife - Post Android Studio Setup Script
# Run this AFTER Android Studio is installed
# Open PowerShell as Administrator and execute:
#   .\docs\setup_after_android_studio.ps1

Write-Host "=== SmartBloodLife Post-Android Studio Setup ===" -ForegroundColor Cyan

# ─── Step 1: Detect Android SDK path ───────────────────────────────────────
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (-not (Test-Path $sdkPath)) {
    Write-Host "ERROR: Android SDK not found at $sdkPath" -ForegroundColor Red
    Write-Host "Please in
    stall Android Studio first: https://developer.android.com/studio" -ForegroundColor Yellow
    exit 1
}
Write-Host "✔ Android SDK found at: $sdkPath" -ForegroundColor Green

# ─── Step 2: Set ANDROID_HOME environment variable ─────────────────────────
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
Write-Host "✔ ANDROID_HOME set to: $sdkPath" -ForegroundColor Green

# ─── Step 3: Add SDK tools to PATH ─────────────────────────────────────────
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$additions = @(
    "$sdkPath\platform-tools",
    "$sdkPath\cmdline-tools\latest\bin",
    "$sdkPath\tools"
)
$newEntries = $additions | Where-Object { $currentPath -notlike "*$_*" }
if ($newEntries.Count -gt 0) {
    $newPath = $currentPath.TrimEnd(";") + ";" + ($newEntries -join ";")
    [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "✔ Added to PATH: $($newEntries -join ', ')" -ForegroundColor Green
} else {
    Write-Host "✔ Android SDK tools already in PATH" -ForegroundColor Green
}

# ─── Step 4: Reload PATH in current session ────────────────────────────────
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "User") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$env:ANDROID_HOME = $sdkPath

# ─── Step 5: Verify ADB ────────────────────────────────────────────────────
try {
    $adbVersion = & adb --version 2>&1 | Select-Object -First 1
    Write-Host "✔ ADB: $adbVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ ADB not found in PATH yet — restart terminal after this script" -ForegroundColor Yellow
}

# ─── Step 6: Accept Flutter Android Licenses ───────────────────────────────
Write-Host "`nAccepting Android SDK licenses (press y for each prompt)..." -ForegroundColor Cyan
& "C:\flutter\bin\flutter.bat" doctor --android-licenses

# ─── Step 7: Run flutter doctor ────────────────────────────────────────────
Write-Host "`n=== flutter doctor output ===" -ForegroundColor Cyan
& "C:\flutter\bin\flutter.bat" doctor -v

# ─── Step 8: Run flutter pub get in SmartBloodLife project ────────────────
$projectPath = "$env:USERPROFILE\life-flow-Smart-Blood-Donor-Finder-\mobile"
if (Test-Path $projectPath) {
    Write-Host "`n=== Running flutter pub get in $projectPath ===" -ForegroundColor Cyan
    Set-Location $projectPath
    & "C:\flutter\bin\flutter.bat" clean
    & "C:\flutter\bin\flutter.bat" pub get
    & "C:\flutter\bin\flutter.bat" analyze
    Write-Host "`n✔ Project is ready. Run: flutter run" -ForegroundColor Green
} else {
    Write-Host "⚠ Project not found at $projectPath — navigate manually and run flutter pub get" -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Next: Open Android Studio -> Device Manager -> Create Pixel 8 emulator (Android 15)" -ForegroundColor White
