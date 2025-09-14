import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5K6U7zXpojAeSf3qHl2g2b-cqPsljC5w",
  authDomain: "mahe-ramdas-pai.firebaseapp.com",
  projectId: "mahe-ramdas-pai",
  storageBucket: "mahe-ramdas-pai.firebasestorage.app",
  messagingSenderId: "738956549278",
  appId: "1:738956549278:web:e06b37dea66c8a3ea36f8f",
  measurementId: "G-83MY30WB1X"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
