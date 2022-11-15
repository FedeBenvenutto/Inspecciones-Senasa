import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA_yHXVtBVgvsIsF2wmSY2wOFMAbFu-2j0",
  authDomain: "inspecciones-senasa.firebaseapp.com",
  projectId: "inspecciones-senasa",
  storageBucket: "inspecciones-senasa.appspot.com",
  messagingSenderId: "331101345655",
  appId: "1:331101345655:web:760cf66ef180bbe304f372"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);