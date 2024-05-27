// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "kouportofilio.firebaseapp.com",
    projectId: "kouportofilio",
    storageBucket: "kouportofilio.appspot.com",
    messagingSenderId: "251404479044",
    appId: "1:251404479044:web:740e5be8b3c3e94f036a11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
