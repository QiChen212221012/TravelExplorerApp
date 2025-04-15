# 🧭 TravelExplorerApp

A mobile app developed for the **Dynamic Web Technologies** coursework using **React Native** and **Expo**.  
TravelExplorerApp allows modern travellers to **explore locations**, **check in with notes and images**, and **earn badges** for their adventures — all without needing a backend.

---

## 🌟 Key Features

- 📍 **Real-Time Location Detection**  
  Uses `expo-location` to get the current position and detect nearby check-in points (within 50m).

- 🧾 **Smart Check-In System**  
  Records place, timestamp, coordinates, and optional notes/images per check-in.

- 🏆 **Achievement Badges**  
  Unlock badges for milestones like first check-in or visiting four unique locations.

- 💬 **Photo & Note Diary**  
  View and manage all past check-ins in a scrollable diary.  
  Users can **edit**, **add notes**, **update images**, or **delete records** (fully supports CRUD).

- 📸 **Camera & Gallery Integration**  
  Upload travel moments via `expo-image-picker`, supporting both camera and gallery access.

- 💾 **Offline Local Storage**  
  Uses `AsyncStorage` to persist all user activity and badge progress.

- 📡 **Simulated Web API**  
  Sends a `fetch()` POST request to a mock endpoint (e.g., `https://example.com/checkin`) to simulate a real-time check-in notification system.

---

## 🧩 Technologies Used

| Tech Stack               | Purpose                                       |
|--------------------------|-----------------------------------------------|
| **React Native**         | Build cross-platform mobile UI                |
| **Expo**                 | Simplify setup, debugging, and native APIs    |
| **expo-location**        | Retrieve user’s real-time GPS coordinates     |
| **expo-image-picker**    | Capture or select images                      |
| **AsyncStorage**         | Local persistent storage for records & badges |
| **React Navigation**     | Stack + tab navigation                        |
| **JavaScript (ES6)**     | Application logic                             |

---

## 📦 Folder Structure

TravelExplorerApp/ ├── screens/ │ ├── HomeScreen.js # Map + nearby point detection │ ├── CheckInScreen.js # Main check-in logic │ ├── DiaryScreen.js # Full CRUD of check-in logs │ └── BadgesScreen.js # Badge showcase ├── assets/ # Icons, images, badges ├── checkpoints.js # JSON-like list of coordinates ├── styles/ # Modular StyleSheet files └── App.js # App entry point with navigation


---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/QiChen212221012/TravelExplorerApp.git
cd TravelExplorerApp

# 2. Install dependencies
npm install

# 3. Start development server
npx expo start --tunnel


Then scan the QR code using Expo Go on iOS/Android to test on real devices.
✅ For image + camera permissions, allow access when prompted.

📌 Project Highlights
Built with modern React Hooks: useState, useEffect, and useFocusEffect

Offers full CRUD operations for local data using AsyncStorage

Responsive UI with gradient animations, dynamic map markers, and modals

Check-in points placed around a university campus for easy real-world testing

💡 All features work entirely offline (except optional fetch API simulation)

🧠 Author
Qi Chen
University of the West of Scotland
Student ID: B01734414
Course: Dynamic Web Technologies – Coursework 2
GitHub: @QiChen212221012
