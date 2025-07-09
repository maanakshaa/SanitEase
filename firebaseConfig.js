// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDgE5eFuBQ5xO8SOrKzBErily8L0dxyVg",
  authDomain: "toilettracker-73ec7.firebaseapp.com",
  projectId: "toilettracker-73ec7",
  storageBucket: "toilettracker-73ec7.appspot.com",
  messagingSenderId: "670915786394",
  appId: "1:670915786394:web:4ee9cd4229f9d1dfac5123",
  measurementId: "G-DVYVGZKFW0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app); 

export { auth, db };
