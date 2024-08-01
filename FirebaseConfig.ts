import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpTNF3sail7NPF2pQxu2FrcYN1h7IEjhU",
  authDomain: "tiremngdtbase.firebaseapp.com",
  projectId: "tiremngdtbase",
  storageBucket: "tiremngdtbase.appspot.com",
  messagingSenderId: "65340283845",
  appId: "1:65340283845:web:7fcdc376f0ae656a5449ac",
  measurementId: "G-FKW2ZLPYN4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase(app);



// Export the initialized Firebase services
export { db };
