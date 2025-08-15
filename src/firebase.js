import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxxKyOX27zNZ3iasDXVJBsoQsdIMm0H_0",
  authDomain: "resume-3b564.firebaseapp.com",
  projectId: "resume-3b564",
  storageBucket: "resume-3b564.firebasestorage.app",
  messagingSenderId: "819142207586",
  appId: "1:819142207586:web:9b04398efb98e2d111893b",
  measurementId: "G-3LE2F1BQ7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
