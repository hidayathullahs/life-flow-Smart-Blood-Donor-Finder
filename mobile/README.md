# SmartBloodLife Mobile Application

This repository contains the enterprise-grade Flutter mobile application for **SmartBloodLife**, integrating directly with the production website's shared Firebase backend.

## Features

- **Real-Time Data Synchronization:** Using Firestore streams, any updates (new donors, availability changes, emergency requests) synchronize immediately between the web dashboard and mobile app with zero refresh lag.
- **Urgent SOS Requests:** An emergency SOS broadcast trigger notifies nearby donors instantly.
- **AI Matching Assistant:** Integrated natural language processing helps search and identify eligible donors based on proximity and blood group compatibility.
- **Offline Support:** Local caches (Hive) store profiles and offline write queues to retry updates once connection returns.
- **Digital Blood Donor Card:** QR code generation for hospital/blood bank verification, along with PDF generation and sharing.
- **Moderation Console:** Administrative interface for verification approvals and user management.

## Project Structure

```
mobile/
├── android/            # Android project files (build, permission profiles)
├── ios/                # iOS project files (Info.plist, Pods configuration)
├── assets/             # Assets (Lottie and image branding resources)
└── lib/
    ├── main.dart       # App initialization, Hive, Firebase
    └── src/
        ├── core/       # Global routing, constants, themes
        ├── data/       # Models, remote/local datasources
        ├── domain/     # Clean business use cases and repository contracts
        └── presentation/ # Riverpod state providers, pages, and components
```

## Running the App

Ensure you have the Flutter SDK installed on your system.

1. **Install Dependencies:**
   ```bash
   flutter pub get
   ```

2. **Configure Firebase Keys:**
   - Place `google-services.json` in `android/app/`.
   - Place `GoogleService-Info.plist` in `ios/Runner/`.

3. **Configure Maps Keys:**
   - Update your API Key in `android/app/src/main/res/values/strings.xml` inside `<string name="google_maps_key">`.
   - Add your maps metadata to iOS if running on actual devices.

4. **Launch Application:**
   ```bash
   flutter run
   ```
