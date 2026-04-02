import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBf78XFyGz0h84X3ZQfhsdbg6JtegfPQc",
  authDomain: "nest-wallet-luxury.firebaseapp.com",
  projectId: "nest-wallet-luxury",
  storageBucket: "nest-wallet-luxury.firebasestorage.app",
  messagingSenderId: "487319544318",
  appId: "1:487319544318:web:d7649a9a1c48949451a0af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
