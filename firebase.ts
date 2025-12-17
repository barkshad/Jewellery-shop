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
// We wrap this in a try-catch to avoid crashing if config is invalid during development
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed. Check your configuration in firebase.ts");
}

export { db };
