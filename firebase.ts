import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase Configuration object
// You can get this from the Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db;

try {
  // Check if config is still placeholder
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn("⚠️ Firebase Config is missing. App is running in STATIC MODE.");
    console.warn("⚠️ To enable Admin/CMS, update firebase.ts with your keys.");
  } else {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase initialization failed. Check your configuration in firebase.ts", error);
}

export { db };
