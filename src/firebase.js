// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWi3Ko7dncB_qdSoHEyvysZ0W9N63io0o",
  authDomain: "maramura-test.firebaseapp.com",
  projectId: "maramura-test",
  storageBucket: "maramura-test.firebasestorage.app",
  messagingSenderId: "942432359032",
  appId: "1:942432359032:web:05544367d38b6989a7138d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);