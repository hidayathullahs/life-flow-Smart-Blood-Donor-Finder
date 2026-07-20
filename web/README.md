# 🩸 SmartBloodLife — Smart Blood Donor Finder

A modern, fast, and secure web application to connect blood donors with those in need. Built with React 18, TailwindCSS, and Firebase.

## 🚀 Features

- **Smart Search**: Filter donors by blood group, city, and eligibility.
- **Eligibility Calculator**: Automatically hides donors who donated < 90 days ago (or shows them as ineligible).
- **Admin Dashboard**: Secure portal to manage donor records (CRUD).
- **Direct Connect**: One-click Call and WhatsApp buttons.
- **Premium UI**: Medical-themed, responsive design with smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Lucide Icons
- **Backend**: Firebase Firestore (NoSQL Database)
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting

## 📦 Project Structure

```
src/
├── admin/          # Admin specific pages (Dashboard, Login)
├── components/     # Reusable UI components & Layouts
├── context/        # Global state (Auth)
├── lib/            # Firebase configuration
├── pages/          # Public pages (Home, Search, Details)
├── routes/         # Protected route logic
├── services/       # backend API abstraction (donorService, authService)
└── utils/          # Helpers (validation, eligibility)
```

## 🏁 Setup Guide

### 1. Prerequisites
- Node.js installed
- A Google ID for Firebase

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project **"BloodLink"**.
3. **Enable Authentication**:
   - Go to Build > Authentication > Sign-in method.
   - Enable **Email/Password**.
   - Create a user for yourself (e.g., `admin@bloodlink.com`).
4. **Enable Firestore**:
   - Go to Build > Firestore Database.
   - Create Database > Start in **production mode** (we have rules ready).
   - Select a location near you (e.g., `asia-south1`).

### 3. Clone & Install
```bash
# Clone the repo (if using git) or just open the folder
npm install
```

### 4. Environment Variables
Create a file named `.env` in the root directory and add your Firebase config keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Deployment Rules
Copy the content of `firestore.rules` to your Firebase Console > Firestore > Rules tab and publish.

### 6. Run Locally
```bash
npm run dev
```

### 7. Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select "Use an existing project"
# Public directory: "dist"
# Configure as single-page app? Yes
# Set up automatic builds? No (unless you want GitHub actions)

npm run build
firebase deploy
```

## ⚠️ Troubleshooting
- **Permission Denied**: Check if your `firestore.rules` are published matching the repo.
- **Login Failed**: Ensure you created the user in Firebase Auth console first.
- **Empty Search**: Ensure you have added donors via the Admin Dashboard.
