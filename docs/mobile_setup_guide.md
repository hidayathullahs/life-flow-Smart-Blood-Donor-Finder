# Mobile Setup & Deployment Guide

This guide documents the Firebase registration and configuration details required to connect the Flutter mobile app to the existing `smartlifeblood` website project.

## Firebase Integration Steps

The website utilizes the Firebase project ID: `smartlifeblood`. To connect your mobile app:

### 1. Register Mobile Applications
In the Firebase Console under project settings:

#### Android
- **Package Name:** `com.smartbloodlife.app`
- **App Nickname:** `SmartBloodLife Android`
- **SHA-1 Fingerprint:** Required for Google Sign-In and phone number authentication.
- **Download:** `google-services.json` and place it in:
  `mobile/android/app/google-services.json`

#### iOS
- **Bundle ID:** `com.smartbloodlife.app`
- **App Nickname:** `SmartBloodLife iOS`
- **App Store ID:** (Leave blank for development)
- **Download:** `GoogleService-Info.plist` and place it in:
  `mobile/ios/Runner/GoogleService-Info.plist`

---

## Google Maps Integration

1. Go to the **Google Cloud Console** linked to your Firebase project.
2. Enable the **Maps SDK for Android** and **Maps SDK for iOS** APIs.
3. Create an API Key under Credentials.
4. Restrict the API key to Android and iOS apps using package signatures in production.
5. In your code:
   - **Android:** Place the key in `mobile/android/app/src/main/res/values/strings.xml`:
     ```xml
     <string name="google_maps_key">YOUR_KEY_HERE</string>
     ```
   - **iOS:** Register the key in `AppDelegate.swift` when configuring Google Maps SDK.

---

## Deployment & Builds

### Android Build
To build a production app bundle (AAB) for Google Play:
```bash
cd mobile
flutter build appbundle
```
The output will be generated at `build/app/outputs/bundle/release/app-release.aab`.

### iOS Build
To build the Archive for TestFlight / App Store:
```bash
cd mobile
flutter build ipa --export-method=ad-hoc
```
Ensure you have set up your Apple Developer Profile and signing certificates inside Xcode.
