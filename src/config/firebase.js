// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAl-Lcw8Y8DHiyN4BVDZRBxr9EgxT981A",
  authDomain: "pulse-palette-f1982.firebaseapp.com",
  projectId: "pulse-palette-f1982",
  storageBucket: "pulse-palette-f1982.appspot.com",
  messagingSenderId: "858918437585",
  appId: "1:858918437585:web:b41a62a10d6e2ff219bbf0",
  measurementId: "G-GW0FBV3826"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getFirestore(app);