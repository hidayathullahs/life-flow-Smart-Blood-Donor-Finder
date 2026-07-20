# Windows 11 - Flutter Environment Setup & Launch Guide

This guide provides step-by-step instructions to configure your Windows 11 development environment to run and deploy the **SmartBloodLife** Flutter mobile application.

---

## 📦 1. Flutter SDK Placement

If you extracted the Flutter SDK inside your `Downloads/` directory, you **must move it** to a system-wide root path like:
- `C:\src\flutter`
- `C:\flutter`

### Why is this required?
1. **Path Length Limits:** Windows has a default `MAX_PATH` character limit of 260 characters. Deeply nested paths inside user directories (e.g., `C:\Users\username\Downloads\...`) can cause build-time failures during Dart compilation.
2. **Permission Privileges:** Files inside Downloads can sometimes have restricted user permissions, blocking Gradle or ADB build tools from reading/writing caches.
3. **Space Character Issues:** Some user profile folders contain space characters (e.g., `C:\Users\John Doe\`), which can break script executions in command-line environments.

---

## ⚙️ 2. Configure Windows Environment Variables (PATH)

To make the `flutter` command available globally in your terminals (Command Prompt, PowerShell, VS Code Terminal):

1. Press `Win + R`, type `sysdm.cpl`, and hit Enter to open **System Properties**.
2. Go to the **Advanced** tab and click **Environment Variables**.
3. Under **User variables** (or System variables to apply to all users), look for the `Path` variable and double-click it.
4. Click **New** and paste the path to your Flutter bin folder:
   ```text
   C:\src\flutter\bin
   ```
5. Click **OK** to close all windows.
6. Restart your IDE and all open terminals to load the new PATH.

### Verify the PATH
Open a new PowerShell terminal and check:
```powershell
Get-Command flutter | Format-Table -Property Source
```

---

## 🔍 3. Verify Flutter Installation

Run the following commands in your terminal:

```bash
flutter --version
flutter doctor -v
```

### Common Issues & Troubleshooting:
- **Error:** *"flutter is not recognized as an internal or external command"*
  - **Fix:** Double-check your environment variables. Ensure the path points to the `bin` directory of your Flutter folder, and that you restarted your terminal/IDE.
- **Error:** *Android SDK missing or not found*
  - **Fix:** Run the following command to link Flutter to your Android SDK installation:
    ```bash
    flutter config --android-sdk "C:\Users\<YourUsername>\AppData\Local\Android\Sdk"
    ```

---

## 🛠️ 4. Android Studio & SDK Tools Configuration

Ensure you have Android Studio installed. Launch Android Studio and configure the SDK packages:

1. Open **SDK Manager** (More Actions -> SDK Manager).
2. Go to the **SDK Platforms** tab and check:
   - **Android 15.0 (VanillaIceCream)** or **Android 14.0 (UpsideDownCake)** (API Level 34+).
3. Go to the **SDK Tools** tab and ensure the following are installed:
   - **Android SDK Build-Tools**
   - **Android SDK Command-line Tools (latest)** (Crucial for `flutter doctor` checks)
   - **Android SDK Platform-Tools**
   - **Android Emulator**
4. Click **Apply** to install the selected packages.

### Accept SDK Licenses
Run this command in your terminal and press `y` to accept all licenses:
```bash
flutter doctor --licenses
```

---

## 📱 5. Create Android Emulator

We recommend creating a **Pixel 8** emulator running **Android 15**:

1. In Android Studio, open the **Device Manager** (More Actions -> Device Manager).
2. Click **Create Device**.
3. Select **Phone** -> **Pixel 8** and click **Next**.
4. Select the system image: **VanillaIceCream (API Level 35, Android 15.0, Google APIs)**. If it is not downloaded, click the download icon next to it first.
5. Click **Next** -> **Finish**.

### How to Launch:
- Open terminal and list available devices:
  ```bash
  flutter devices
  ```
- Launch emulator directly from terminal:
  ```bash
  flutter emulators --launch pix_8
  ```
  *(Or launch it from the Device Manager UI in Android Studio).*

---

## 🚀 6. Running the SmartBloodLife Flutter App

Navigate to the `mobile/` directory:
```bash
cd mobile
```

### Setup Sequence:
1. **Clean build directories:**
   ```bash
   flutter clean
   ```
   *Deletes build files and caches to prevent cache conflicts.*
2. **Download dependencies:**
   ```bash
   flutter pub get
   ```
   *Downloads all Riverpod, GoRouter, and Firebase packages declared in pubspec.yaml.*
3. **Static Analysis Check:**
   ```bash
   flutter analyze
   ```
   *Validates type safety and style rules. Should return zero issues.*
4. **Environment Check:**
   ```bash
   flutter doctor
   ```
   *Verifies local system requirements are ready.*
5. **Run App:**
   ```bash
   flutter run
   ```

### Likely Build Errors & Diagnoses:
- **Error:** *MultiDex build failure*
  - **Fix:** Flutter handles multidex automatically, but if a legacy plugin fails, verify that `multiDexEnabled true` is active inside `mobile/android/app/build.gradle` (which has already been added to your codebase).
- **Error:** *Gradle build daemon failed to start*
  - **Fix:** Usually caused by insufficient RAM or incorrect JDK installation. Ensure Java JDK 17+ is installed and your `JAVA_HOME` variable points to your JDK directory.
