import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCGS6lXrGDsVhZ38wk9GZCOuSU4haagaLA",
  authDomain: "fitflow-8a8ca.firebaseapp.com",
  projectId: "fitflow-8a8ca",
  storageBucket: "fitflow-8a8ca.firebasestorage.app",
  messagingSenderId: "222344511543",
  appId: "1:222344511543:web:8df9dc3e6e512b31b73fb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app) 