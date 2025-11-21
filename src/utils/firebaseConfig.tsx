import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvQljubh5Zd8B7LITkAgx4bAtSns0vco8",
  authDomain: "open-the-door-db8cc.firebaseapp.com",
  projectId: "open-the-door-db8cc",
  storageBucket: "open-the-door-db8cc.firebasestorage.app",
  messagingSenderId: "1028138267805",
  appId: "1:1028138267805:web:00460d4f9419c5b02b9074",
  measurementId: "G-LMXQWP58VL"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);