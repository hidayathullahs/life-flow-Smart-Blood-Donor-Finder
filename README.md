# SmartBloodLife - Smart Blood Donor Finder Network

**SmartBloodLife** is a production-ready, startup-quality healthcare platform built to connect blood donors, hospitals, and blood banks in real time. It features a fully responsive React web dashboard and an enterprise-grade Flutter mobile application, both synchronized bidirectionally through a single Firebase backend.

---

## 🚀 Key Features

- **Real-Time Synchronisation:** Using Firestore Streams, data updates (new registrations, availability changes, SOS broadcasts) reflect instantly across both the website and mobile app without requiring page refreshes.
- **Urgent SOS Requests:** Hospitals or users can broadcast emergency blood requests. Donors nearby are notified immediately.
- **AI Matching Assistant:** Integrated natural language processing powered by the **Gemini API** scans active Firestore donor registries to recommend eligible donors based on proximity and blood group compatibility.
- **Digital Donor Card:** Generates a professional digital card with a dynamic verification QR code, support for downloading as a PDF, and sharing capabilities.
- **Administrative Moderation Consoles:** Dedicated dashboards for admins (moderating verified checkmarks), hospitals (managing patient requests), and blood banks (managing unit inventory levels).

---

## 📁 Repository Structure

```text
SmartBloodLife/
├── web/                  # Responsive React + Vite Web Application
│   ├── src/              # React code (auth, pages, stats, map views)
│   └── package.json      # NPM dependencies & scripts
├── mobile/               # Cross-platform Flutter Mobile Application
│   ├── lib/              # Clean Architecture Dart source files
│   ├── android/          # Android platform build & permission settings
│   ├── ios/              # iOS platform configuration files
│   └── pubspec.yaml      # Flutter package dependencies (Riverpod, Maps, Firebase)
├── firebase/             # Firestore Security Rules & configuration files
├── docs/                 # Detailed setup, Firebase, and API guides
├── assets/               # General assets and branding resources
└── screenshots/          # Application screenshots & walk-through videos
```

---

## 🛠️ Tech Stack

### Web Dashboard

- React & Vite
- TailwindCSS
- Firebase Suite (Authentication, Firestore, Hosting, Cloud Functions)

### Mobile App

- Flutter 3.x & Material 3
- State Management: Riverpod & Flutter Hooks
- Routing: GoRouter
- Local Caching: Hive & Flutter Secure Storage
- Maps & Location: Google Maps SDK & Geolocator
- Camera Scanning: Mobile Scanner
- AI Engine: Google Generative AI (Gemini SDK)

---

## 💻 Local Setup & Execution

### 1. Web Application (`/web`)

```bash
cd web
npm install
npm run dev
```

*Access local web server at `http://localhost:5173/`.*

### 2. Mobile Application (`/mobile`)

1. Place client configuration files:
   - Android: `mobile/android/app/google-services.json`
   - iOS: `mobile/ios/Runner/GoogleService-Info.plist`
2. Register your API Keys:
   - Google Maps API: Place key in `strings.xml` (Android) and `AppDelegate.swift` (iOS).
   - Gemini API: Define `$env:GEMINI_API_KEY` on your local terminal environment.
3. Launch app:

```bash
cd mobile
flutter pub get
flutter run
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/bajar/life-flow-Smart-Blood-Donor-Finder-/LICENSE) file for details.
