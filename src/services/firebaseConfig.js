import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
   apiKey: "AIzaSyBN5TrGe1jUg2HvogLGbvfiQQywlhtkxis",
  authDomain: "career-recommendation-ap-e80e2.firebaseapp.com",
  databaseURL: "https://career-recommendation-ap-e80e2-default-rtdb.firebaseio.com",
  projectId: "career-recommendation-ap-e80e2",
  storageBucket: "career-recommendation-ap-e80e2.firebasestorage.app",
  messagingSenderId: "833430479034",
  appId: "1:833430479034:web:5c89bffb2b5bac4ced6283"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);
