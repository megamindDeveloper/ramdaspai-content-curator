// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaLeHWUAYKq9g4JDwFb8SE-m-fjimYN9I",
  authDomain: "test-db-5c896.firebaseapp.com",
  projectId: "test-db-5c896",
  storageBucket: "test-db-5c896.firebasestorage.app",
  messagingSenderId: "894979511609",
  appId: "1:894979511609:web:6ebc79d91613cdf73c44e8"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
