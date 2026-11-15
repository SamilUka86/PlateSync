# 🏋️‍♂️ PlateSync – Smart Barbell Loading & Workout Analytics Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.3-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**PlateSync** is an advanced, high-performance Progressive Web Application (PWA) crafted for strength athletes, powerlifters, bodybuilders, and fitness enthusiasts. It bridges the gap between precision barbell loading math and structured workout tracking with real-time biometric analytics, an active workout timer, a 7-day weekly planner, mixed-unit plate math (Kilograms & Pounds), bilingual support (English & Hindi), and an enterprise administrative portal with real-time user telemetry.

---

## 🌟 Key Features

### 🏋️‍♂️ Smart Barbell Loading Visualizer & Calculator
- **Mixed-Unit Precision (KG & LBS)**: Automatically computes optimal barbell loading with exact collar/barbell deductions and symmetric sleeve distribution.
- **Dynamic 2D Visualizer**: Interactive sleeve rendering featuring IPF/IWF competition color codes (Red: 25kg, Blue: 20kg, Yellow: 15kg, Green: 10kg, White: 5kg, etc.).
- **Inventory Customizer**: Toggle available plate counts in your gym to only generate loads using the plates you actually own.
- **Reverse Calculator**: Enter plates physically loaded on the bar to instantly deduce total weight and percentage milestones.
- **Barbell Presets**: Quick switching between Olympic Men's (20 kg / 45 lbs), Women's (15 kg / 35 lbs), Technique (10 kg), and EZ-Curl bars.

### ⏱️ Workout Tracker & Live Session Logger
- **Real-Time Logging**: Record sets, reps, weight, RPE (Rate of Perceived Exertion), and exercise notes on the fly.
- **Audio & Haptic Rest Timer**: Integrated rest countdown with customizable duration, audio bell chime, and mobile vibration feedback.
- **1-Rep Max (1RM) Estimator**: Dynamic Brzycki and Epley formula predictions updated with every logged set.
- **Superset & Drop Set Support**: Group exercises together and track multi-phase movements seamlessly.

### 📅 7-Day Weekly Workout Planner
- **Full Monday – Sunday Schedule**: Visual day-by-day training calendar with split tags (Push, Pull, Legs, Upper, Lower, Cardio, Rest).
- **Template Architecture**: Build, save, and reload reusable workout programs or select from prebuilt powerlifting and hypertrophy routines.
- **Volume & Set Allocations**: Live target summaries showing muscle group distribution across the entire training week.

### 📈 Personal Records (PRs) & Performance Analytics
- **Historical Milestones**: Automatically detects and celebrates new PRs for Bench Press, Squat, Deadlift, Overhead Press, and custom movements.
- **Interactive Recharts Visualizations**: Track total training volume (kg/lbs), session duration, and intensity over 7-day, 30-day, and all-time horizons.
- **Workout History Vault**: Filter past workouts by date, exercise, or muscle group with full set-by-set replay.

### ⚖️ Body Weight Tracker & Composition
- **Daily Weigh-In Logging**: Record body weight with date tracking, BMI estimation, and physical progression logs.
- **Moving Average Trends**: Visual trendlines highlighting weight loss, muscle gain, and plateau patterns.

### 📱 Progressive Web Application (PWA) & Offline Resilience
- **Multi-Platform Installation**: Install directly on Android, iOS, Windows, macOS, and Linux as a native standalone app.
- **Custom App Manifest**: Includes dark-themed high-res app icons, display modes, and offline splash screens.
- **Offline Storage**: LocalStorage and IndexedDB synchronization ensure full functionality even with zero network connectivity.

### 🌐 Bilingual Platform Localization (English & Hindi)
- **Instant Language Toggle**: Seamlessly switch the entire application UI between **English** and **Hindi (हिंदी)** with a single click.
- **Cultural Accessibility**: Comprehensive translation mapping covering exercise terminology, units, navigation, and system notifications.

### 🛡️ Administrative Portal & Live User Telemetry
- **Restricted Access Control**: Dedicated, secure administrative portal accessible strictly to verified administrators.
- **Live User Directory & Telemetry**: Real-time heartbeat stream tracking active online athletes, devices, login providers, and workout activity.
- **Community Feedback Desk**: Centralized stream for bug reports, athlete suggestions, and platform reviews.
- **Global Platform Controls**: Emergency maintenance mode toggle, system-wide broadcast banners, and default unit configuration.

### 🔒 Enterprise-Grade Cryptographic Security
- **SHA-256 One-Way Password Hashing**: Administrative master credentials are cryptographically verified using SHA-256 hashing—never stored or committed in plain text.
- **Environment Isolation**: Private API tokens and credentials isolated via `.env.local` with safe obfuscated fallbacks.
- **Hardened Cloud Firestore Rules**: Multi-tier permission rules protecting athlete workout history, personal records, and administrative collections.

---

## 🛠️ Technology Stack

| Layer | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component architecture, state management & reactivity |
| **Build Tool & Bundler** | [Vite 5](https://vitejs.dev/) | Lightning-fast HMR and optimized production build bundling |
| **Styling & Design System** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Midnight-slate dark athletic theme & responsive layouts |
| **Backend & Cloud Services** | [Google Firebase 11](https://firebase.google.com/) | Cloud Firestore real-time NoSQL database & Auth SDK |
| **Authentication Flow** | [Google Identity Services (GIS)](https://developers.google.com/identity) | Popup & redirect OAuth 2.0 authentication |
| **Data Visualization** | [Recharts 2.15](https://recharts.org/) | Responsive charts for volume progression & PR history |
| **Iconography** | [Lucide React](https://lucide.dev/) | Crisp, modern SVG interface icons |
| **Cryptographic Utilities** | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | Client-side SHA-256 cryptographic one-way hashing |
| **Serverless Backend** | [Vercel Serverless Functions](https://vercel.com/docs/functions) | Edge API authentication token verification (`/api/admin/verify`) |
| **Production Deployment** | [Vercel](https://vercel.com/) | Global Edge CDN hosting with continuous deployment |

---

## 📁 Repository Directory Structure

```
PlateSync/
├── api/                                # Serverless Backend Functions
│   └── admin/
│       └── verify.js                   # Secure edge token verification endpoint
├── public/                             # Static Assets & PWA Resources
│   ├── icons/                          # PWA icons (192x192, 512x512, maskable)
│   ├── favicon.svg                     # High-res vector favicon
│   ├── manifest.json                   # Web App Manifest for native installation
│   └── sw.js                           # Service worker for offline caching
├── src/                                # Core Application Source Code
│   ├── components/                     # Reusable UI & Layout Components
│   │   ├── auth/                       # Auth modals (Google, Firebase, Password Reset)
│   │   ├── feedback/                   # Athlete feedback submission modal
│   │   ├── layout/                     # Header, Sidebar, Footer, Navigation
│   │   └── pwa/                        # PWA install prompt & guide modal
│   ├── context/                        # React Global Context Providers
│   │   ├── AdminContext.jsx            # Administrative session & role authorization
│   │   ├── AuthContext.jsx             # User profile, Google Auth & GIS state
│   │   ├── NotificationContext.jsx     # Global toast notification provider
│   │   └── WorkoutContext.jsx          # Active workout session, logs & timer state
│   ├── hooks/                          # Custom React Hooks
│   │   ├── usePWAInstall.js            # Native PWA install event listener
│   │   └── useUserActivityTracker.js   # Presence heartbeats & activity telemetry
│   ├── pages/                          # Application Route Views
│   │   ├── admin/                      # Admin Suite (Overview, Users, Live, Feedback, Settings)
│   │   ├── analytics/                  # Training volume & progression charts
│   │   ├── auth/                       # User Login & Athlete Registration page
│   │   ├── bodyweight/                 # Body weight tracking & trend analysis
│   │   ├── calculator/                 # Mixed-unit barbell visualizer & plate loader
│   │   ├── dashboard/                  # Athlete dashboard summary & quick actions
│   │   ├── history/                    # Workout log replay & historical sessions
│   │   ├── library/                    # Exercise database & workout programs
│   │   ├── planner/                    # 7-Day weekly training schedule
│   │   ├── profile/                    # Athlete profile, biometric settings & theme
│   │   ├── records/                    # Personal Records (PRs) & 1RM calculator
│   │   ├── settings/                   # Units, audio buzzer duration, language toggle
│   │   └── workout/                    # Live workout execution & rest timer
│   ├── services/                       # Business Logic & External Integrations
│   │   ├── admin/                      # Admin data streaming & audit logger
│   │   ├── auth/                       # Firebase Auth & Google GIS integration
│   │   ├── firebase/                   # Firebase configuration & initialization
│   │   ├── firestore/                  # Cloud Firestore CRUD & offline sync
│   │   └── translation/                # English <-> Hindi website translator
│   ├── utils/                          # Calculations & Security Utilities
│   │   ├── adminSecurity.js            # SHA-256 password hash & credential security
│   │   ├── exerciseData.js             # Prebuilt exercises & default programs
│   │   └── plateCalculator.js          # Core plate loading algorithms & reverse math
│   ├── App.jsx                         # Main application controller & routing
│   ├── index.css                       # Tailwind CSS directives & custom design system
│   └── main.jsx                        # React root entry point
├── .env.example                        # Environment variables template
├── firestore.rules                     # Cloud Firestore production security rules
├── index.html                          # HTML5 root template with meta tags
├── package.json                        # Node dependencies & project scripts
├── tailwind.config.js                  # Tailwind design tokens & custom theme
├── vercel.json                         # Vercel routing rewrites & security headers
├── vite.config.js                      # Vite bundling configuration
└── README.md                           # Project documentation
```

---

## ⚙️ Quick Start & Installation Guide

### Prerequisites
Make sure you have the following installed on your development workstation:
- [Node.js](https://nodejs.org/) (Version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`
- A [Firebase](https://console.firebase.google.com/) account (for real-time database and authentication)

### Step 1: Clone the Repository
```bash
git clone https://github.com/SamilUka86/PlateSync.git
cd PlateSync
```

### Step 2: Install Project Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a local `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Update `.env.local` with your Firebase project credentials and Google OAuth Client ID:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Identity Services (GIS) Web Client ID
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com

# Platform Administrative Configuration (Optional)
VITE_ADMIN_EMAIL=your-admin-email@gmail.com
VITE_ADMIN_MASTER_HASH=your_sha256_hash_here
```

### Step 4: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to explore PlateSync in development mode.

### Step 5: Build for Production
To generate a production-ready, minified bundle:
```bash
npm run build
```
Preview the built bundle locally:
```bash
npm run preview
```

---

## 🌐 Live Production Deployment

PlateSync is continuously integrated and deployed to production via Vercel:

| Environment | URL | Status |
| :--- | :--- | :--- |
| **Production Website** | [https://platesync.vercel.app](https://platesync.vercel.app) | ![Status](https://img.shields.io/badge/Status-Live-success?style=flat-square) |
| **Production Alias** | [https://platesyncapp.com](https://platesyncapp.com) | ![Status](https://img.shields.io/badge/Status-Active-blue?style=flat-square) |
| **Deployment URL** | [https://platesync-dwzeg2rcq-sam-f857.vercel.app](https://platesync-dwzeg2rcq-sam-f857.vercel.app) | ![Status](https://img.shields.io/badge/Status-Ready-success?style=flat-square) |

---

## 👨‍💻 Author & Connect

**Samil Uka**  
*Full Stack Developer & Strength Training Enthusiast*

- 🐙 **GitHub**: [@SamilUka86](https://github.com/SamilUka86)
- 💼 **LinkedIn**: [Samil Uka](https://www.linkedin.com/in/samil-uka-53049b359)
- 📸 **Instagram**: [@_.samil._86](https://www.instagram.com/_.samil._86)
- ✉️ **Support Email**: [platesync86@gmail.com](mailto:platesync86@gmail.com)

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the `LICENSE` file for more information.
