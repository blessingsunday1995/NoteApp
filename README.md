# Notes App - React Native + Supabase

A simple, clean Notes application built with **React Native (Expo)** and **Supabase** as the backend.

This app fulfills all technical assignment requirements:
- Email/password authentication with session persistence
- Secure CRUD operations on personal notes (Row Level Security enforced)
- Clean and usable UI
- Standalone Android APK built locally
- **Additional Requirement: Option A – Offline Handling**

## 🚀 Project Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NotesApp.git
   cd NotesApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase keys**
   - Create a free project at [supabase.com](https://supabase.com)
   - Go to Settings → API
   - Copy your **Project URL** and **anon (public) key**
   - Update `lib/supabase.ts`:
     ```ts
     const supabaseUrl = 'YOUR_SUPABASE_URL';
     const supabaseAnonKey = 'YOUR_ANON_KEY';
     ```

4. **Run the app**
   ```bash
   npx expo start
   ```
   - Press `a` for Android emulator
   - Or scan the QR code with Expo Go on your phone

## 📱 How to Run Locally

- **Development**: `npx expo start`
- **Android**: `npx expo run:android`
- **iOS** (macOS only): `npx expo run:ios`

## 🗄 Supabase Schema Details

### Table: `notes`

| Column       | Type         | Constraints / Notes                     |
|--------------|--------------|-----------------------------------------|
| id           | UUID         | Primary key, default `uuid_generate_v4()` |
| user_id      | UUID         | References `auth.users(id)`, NOT NULL   |
| title        | TEXT         | NOT NULL                                |
| content      | TEXT         | Optional                                |
| created_at   | TIMESTAMPTZ  | Default `NOW()`                         |
| updated_at   | TIMESTAMPTZ  | Default `NOW()`                         |

### Row Level Security (RLS)

RLS is **enabled** on the `notes` table.

Policies:
- SELECT: `auth.uid() = user_id`
- INSERT: `user_id IS NULL OR auth.uid() = user_id` (allows auto-fill)
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

> Users can only view, create, edit, and delete **their own** notes.

## 🔐 Authentication Approach

- **Supabase Auth** with email + password
- Session persistence using **AsyncStorage** (configured in Supabase client)
- Protected routes via `AuthContext` and root layout
- Automatic redirect:
  - Logged in → Notes list
  - Not logged in → Login/Signup screen
- Logout clears session and redirects to login

Session survives app restart and backgrounding.

## 🧠 Additional Requirement: Option A – Offline Handling

**Chosen and implemented: Option A**

Features:
- Uses `@react-native-community/netinfo` to detect internet connectivity
- Displays a red **offline banner** at the top of the notes list when disconnected
- Shows a friendly **"No internet connection"** message when notes fail to load
- App does **not crash** when offline — fetch errors are caught gracefully
- Pull-to-refresh works when connection is restored

> The app remains stable and provides clear feedback in offline scenarios.

## ⚙️ Assumptions & Trade-offs

- **Expo managed workflow** used for faster development
- **Dark theme** only (clean, modern look)
- **No email confirmation** required during sign-up (disabled in Supabase Auth settings for testing)
- Focused on **core requirements + Option A** — no extra features added
- Used **client-side RLS** enforcement — secure because policies are server-side

## 📦 Building the APK (Standalone - Local Build)

The APK was built **locally** using Expo prebuild + Gradle (no cloud services required).

### Build Steps

1. **Generate native Android project**
   ```bash
   npx expo prebuild --platform android --clean
   ```

2. **Navigate to Android folder**
   ```bash
   cd android
   ```

3. **Build the release APK**
   ```bash
   ./gradlew assembleRelease
   ```
   - On Windows: `gradlew.bat assembleRelease`

4. **Find the APK**
   - Location: `android/app/build/outputs/apk/release/app-release.apk`
   - This is a **fully standalone, installable APK** (no Expo Go required)

### Notes
- The APK is **unsigned** (suitable for testing/sideloading)
- Tested and working on Android devices and emulators

The resulting APK meets the assignment requirement: **installable on a physical Android device or emulator**.

---

**Clean execution. Secure. Persistent. Offline-aware. Locally built APK. Ready for review.**

Thank you! 
