// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBn-w0MUV7EOYOx9EZce9Q7Np0HCFpt-H8",
    authDomain: "whatsapp-clone-90108.firebaseapp.com",
    projectId: "whatsapp-clone-90108",
    storageBucket: "whatsapp-clone-90108.appspot.com",
    messagingSenderId: "559248200638",
    appId: "1:559248200638:web:60955800b0ef1454631fef",
    measurementId: "G-VR56B3JRLW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db, collection, addDoc };
