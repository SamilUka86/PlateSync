# 🏋️‍♂️ PlateSync – Smart Barbell Loading & Workout Analytics Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.3-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**PlateSync** is an all-in-one fitness and strength training web platform engineered for weightlifters, powerlifters, bodybuilders, and everyday athletes. It solves barbell plate loading math with an interactive real-time visualizer, provides structured workout logging with rest timers, offers a 7-day training planner, tracks personal records and body composition, supports bilingual translation (English & Hindi), and works offline as an installable Progressive Web App (PWA).

---

## 🌟 Key Platform Features

### 🏋️‍♂️ 1. Smart Barbell Calculator & Visualizer
- **Mixed-Unit Precision (KG & LBS)**: Automatically computes the exact combination of plates needed on each side of the barbell for any target weight in Kilograms (KG) or Pounds (LBS).
- **Interactive 2D Barbell Rendering**: Visually illustrates the loaded barbell sleeve using official IPF/IWF competition color codes (Red: 25kg, Blue: 20kg, Yellow: 15kg, Green: 10kg, White: 5kg, etc.).
- **Reverse Plate Calculator**: Input whatever plates are currently loaded on the barbell to instantly find out the total weight, barbell deduction, and percentages.
- **Gym Plate Inventory Customizer**: Toggle on/off which plate denominations exist in your gym, ensuring the calculator only recommends plates you actually have.
- **Barbell Type Presets**: Switch instantly between standard Men's Olympic (20 kg / 45 lbs), Women's Olympic (15 kg / 35 lbs), Technique (10 kg), and EZ-Curl bars.

### ⏱️ 2. Workout Tracker & Live Session Logger
- **Dynamic Exercise Logging**: Record completed exercises, sets, repetitions, weights, and Rate of Perceived Exertion (RPE).
- **Integrated Rest Interval Timer**: Built-in rest countdown timer with audio chime alerts and mobile device vibration so you never miss your next set.
- **Automatic 1-Rep Max (1RM) Estimations**: Computes predicted single-rep maximums across every set using proven Brzycki and Epley strength formulas.
- **Supersets & Drop Sets**: Flexibly link exercises together for supersets and circuit training.

### 📅 3. 7-Day Weekly Workout Planner
- **Monday-to-Sunday Schedule**: Visual overview of your complete 7-day training routine with muscle split labels (Push, Pull, Legs, Upper, Lower, Full Body, Cardio, Rest).
- **Reusable Program Templates**: Save personalized routines or choose from prebuilt strength and hypertrophy programs.
- **Weekly Volume Allocations**: Real-time summaries showing set distribution and volume load across each muscle group.

### 🏆 4. Personal Records (PRs) & Strength Analytics
- **Milestone Detection**: Automatically detects and archives all-time Personal Records for Squat, Bench Press, Deadlift, Overhead Press, and custom movements.
- **Visual Analytics**: Interactive performance graphs highlighting total training volume, session duration, and intensity trends over 7-day, 30-day, and all-time periods.
- **Workout History Vault**: Filter and inspect past workout sessions with full set-by-set exercise replays.

### ⚖️ 5. Body Weight Tracker & Composition
- **Daily Weigh-In Logging**: Track body weight over time alongside BMI calculations and date logs.
- **Trendline Analytics**: Moving-average charts to clearly visualize weight loss, bulking phases, and plateaus without daily water-weight noise.

### 📱 6. Progressive Web App (PWA) & Offline Access
- **Native App Experience**: One-click installable on Android, iOS, Windows, macOS, and Chromebooks directly from the browser.
- **Full Offline Capability**: Caches application resources so you can calculate plates, log workouts, and view plans inside gym basements with no internet connection.

### 🌐 7. Bilingual Language Support (English & Hindi)
- **Instant Translation**: Switch between English and Hindi (हिंदी) across the entire application with a single tap.
- **Culturally Accessible**: Fully localized interface labels, exercise databases, plate descriptions, and notifications.

### 🛡️ 8. Administrator Suite & Community Desk
- **Restricted Admin Portal**: Dedicated management portal accessible exclusively to verified administrators.
- **Live User Directory & Telemetry**: Real-time presence monitoring of active athletes, devices, and training sessions.
- **Athlete Feedback Inbox**: Direct channel for users to submit feedback, bug reports, and feature requests.
- **Platform Health Controls**: Maintenance mode switch, global announcement banners, and platform-wide defaults.

### 🔐 9. Privacy & Security
- **Secure Authentication**: Supports Google Identity Services (GIS) one-tap login and standard email/password accounts.
- **Cryptographic Security**: Administrative access is cryptographically verified using SHA-256 one-way hashing, ensuring no plain text credentials exist in source files.

---

## 📄 Application Pages Overview

| Page | Section | Description & Highlights |
| :--- | :--- | :--- |
| **Dashboard** | Athlete Hub | Quick overview of recent activity, weekly targets, quick calculator, and current workout status. |
| **Calculator** | Barbell Math | Visual sleeve loader, plate inventory settings, reverse calculator, and percentage warm-up tables. |
| **Tracker** | Live Workout | Active workout logging interface, set counters, rest countdown buzzer, and exercise picker. |
| **Planner** | Weekly Routine | Monday-through-Sunday visual training calendar, muscle split tags, and routine manager. |
| **Library** | Exercises | Comprehensive exercise database with categorized movements, instructions, and target muscles. |
| **History** | Log Vault | Searchable archive of all historical workouts with date filtering and full set replays. |
| **Analytics** | Progress Charts | Interactive volume charts, workout consistency frequency, and muscle group distribution. |
| **Records** | PR Milestones | Personal records showcase, 1RM strength calculator, and historical milestone tracking. |
| **Body Weight** | Biometrics | Daily weigh-in logger, trendline graphs, BMI estimations, and body progress history. |
| **Profile** | Athlete Settings | Biometric parameters, default barbell weight and unit (KG/LBS), and custom theme preferences. |
| **Settings** | App Preferences | Audio buzzer duration, haptic vibration toggle, and English/Hindi language selector. |
| **Admin Portal** | Platform Suite | Protected administrative desk with live user directory, telemetry, feedback inbox, and system settings. |

---

## 🛠️ Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component architecture, responsive user interface, and state management |
| **Build Tooling** | [Vite 5](https://vitejs.dev/) | Fast Hot Module Replacement (HMR) and production bundling |
| **Styling & Theme** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Midnight-slate dark athletic theme, custom gradients, and responsive layouts |
| **Backend & Database** | [Google Firebase 11](https://firebase.google.com/) | Cloud Firestore real-time NoSQL database and offline synchronization |
| **Authentication** | [Google Identity Services](https://developers.google.com/identity) | Native Google OAuth 2.0 and Firebase Authentication |
| **Visual Analytics** | [Recharts 2.15](https://recharts.org/) | Responsive SVG line, bar, and area charts for workout volume and PR trends |
| **Iconography** | [Lucide React](https://lucide.dev/) | Clean, scalable vector icons |
| **Security & Crypto** | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | Client-side SHA-256 cryptographic one-way hashing for secure administration |
| **Deployment** | [Vercel](https://platesyncapp.vercel.app/) | Edge hosting, global CDN caching, and automated deployment pipelines |

---



---

## 🌐 Live Website

PlateSync is deployed and accessible worldwide:
- **Official Website**: [https://platesync.vercel.app](https://platesync.vercel.app)

---
