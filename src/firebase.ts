import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- ADDED THIS

const firebaseConfig = {
  apiKey: "AIzaSyAAr5FHeKVKIwdhT30BeUome5aOZ2jP3_g",
  authDomain: "keyforge-ai-72e5a.firebaseapp.com",
  projectId: "keyforge-ai-72e5a",
  storageBucket: "keyforge-ai-72e5a.firebasestorage.app",
  messagingSenderId: "790403783863",
  appId: "1:790403783863:web:3d9e6fbae2c6b0f3074132",
  measurementId: "G-EE7VJL88SW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // <-- ADDED THIS

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  return await signOut(auth);
};