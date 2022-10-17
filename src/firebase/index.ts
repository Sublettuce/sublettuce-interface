import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjp6JbG7UGeA_nHLzn4O5uV6DYqs5jdfc",
  authDomain: "sublet-381d9.firebaseapp.com",
  projectId: "sublet-381d9",
  storageBucket: "sublet-381d9.appspot.com",
  messagingSenderId: "768939960535",
  appId: "1:768939960535:web:7a9e68165c7c0c8da96892",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
