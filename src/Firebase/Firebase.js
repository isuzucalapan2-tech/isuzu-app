// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAolEPWrcreSgFDuARoWvCUP6WWmoQIwN8",
  authDomain: "isuzu-inventory.firebaseapp.com",
  projectId: "isuzu-inventory",
  storageBucket: "isuzu-inventory.appspot.com",
  messagingSenderId: "572489604841",
  appId: "1:572489604841:web:7e14a5eb7aa51b0f9a9a78",
  measurementId: "G-43P6GTKZ1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const analytics = getAnalytics(app); // optional
const auth = getAuth(app);
const db = getFirestore(app);

// Export services
export { auth, db };
