import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjp6JbG7UGeA_nHLzn4O5uV6DYqs5jdfc",
  authDomain: "sublet-381d9.firebaseapp.com",
  projectId: "sublet-381d9",
  storageBucket: "sublet-381d9.appspot.com",
  messagingSenderId: "768939960535",
  appId: "1:768939960535:web:7a9e68165c7c0c8da96892",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
