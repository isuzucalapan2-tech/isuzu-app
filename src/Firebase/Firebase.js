// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAolEPWrcreSgFDuARoWvCUP6WWmoQIwN8",
  authDomain: "isuzu-inventory.firebaseapp.com",
  projectId: "isuzu-inventory",
  storageBucket: "isuzu-inventory.firebasestorage.app",
  messagingSenderId: "572489604841",
  appId: "1:572489604841:web:7e14a5eb7aa51b0f9a9a78",
  measurementId: "G-43P6GTKZ1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);