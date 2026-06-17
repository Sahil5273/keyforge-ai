# >_ KEYFORGE_AI

A high-performance, multilingual coding TypeRacer application designed to track, analyze, and predict user typing speeds using AI. 

KeyForge AI allows users to practice typing code snippets, compete on a global leaderboard, and visualize their performance trends. The platform features an integrated AI prediction engine that utilizes Linear Regression to forecast future Words Per Minute (WPM) based on historical performance.

## ✨ Features

* **Real-time Typing Arena:** Custom-built code editor interface tracking keystrokes, accuracy, and WPM in real-time.
* **Authentication:** Secure Google Sign-In powered by Firebase Authentication.
* **Global Leaderboard & User Profiles:** Persistent cloud storage of test results, displaying global rankings, personal history, and high scores.
* **AI Prediction Engine:** Built-in linear regression model that analyzes past test trajectories to predict the user's next target WPM.
* **Multilingual Support:** Includes specialized typing guides and layouts (e.g., Hindi Guide) to accommodate diverse developers.
* **Dark Mode UI:** A sleek, developer-focused aesthetic using Tailwind CSS and glassmorphism effects.

## 🛠 Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS
* **Backend/Database:** Firebase Firestore (NoSQL)
* **Authentication:** Firebase Auth (Google Provider)
* **Hosting:** Firebase Hosting
* **Routing:** React Router v6

---

## 🚀 Getting Started (Local Setup)

To run KeyForge AI locally on your machine, follow these steps:

### 1. Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Git](https://git-scm.com/)

### 2. Clone the Repository
Open your terminal and clone the project:
```bash
git clone [https://github.com/Sahil5273/keyforge-ai.git](https://github.com/Sahil5273/keyforge-ai.git)
cd keyforge-ai

```

### 3. Install Dependencies

Install all the required NPM packages:

```bash
npm install

```

### 4. Configure Firebase

To connect the app to your own database, you need to set up Firebase:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google Sign-In Provider).
3. Enable **Firestore Database** (Start in Test Mode).
4. Go to Project Settings, add a Web App, and copy your configuration keys.
5. In your local project, open `src/firebase.ts` and replace the placeholder `firebaseConfig` object with your keys:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

```



### 5. Start the Development Server

Spin up the local Vite server:

```bash
npm run dev

```

The application will be running locally at `http://localhost:5173`.

---

## 📈 Deployment

This project is configured for rapid deployment via Firebase Hosting.

### 1. Build the Production App

Compile the TypeScript and React code into optimized static files:

```bash
npm run build

```

### 2. Deploy to Firebase

Ensure you have the Firebase CLI installed (`npm install -g firebase-tools`) and are logged in (`firebase login`), then run:

```bash
firebase deploy

```

Your app is now live!

---

## 📝 License

This project is open-source and available under the MIT License.
