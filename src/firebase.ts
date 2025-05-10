// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACIBAnhCZDlkFIis1GRQEBvXt4fJGc1MM",
  authDomain: "student-dashboard-7d41d.firebaseapp.com",
  projectId: "student-dashboard-7d41d",
  storageBucket: "student-dashboard-7d41d.firebasestorage.app",
  messagingSenderId: "1033721671797",
  appId: "1:1033721671797:web:80ae549d5180710f99083c",
  measurementId: "G-MSP42M0FGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the necessary Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// **Export firebaseConfig** so it can be used elsewhere
export { firebaseConfig };
