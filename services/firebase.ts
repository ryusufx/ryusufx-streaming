
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, onSnapshot, serverTimestamp, writeBatch, doc, deleteDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEkDl6h4p5x5ed0r_QC31TVWI8HI6ay3k",
  authDomain: "ryusufx-stream.firebaseapp.com",
  projectId: "ryusufx-stream",
  storageBucket: "ryusufx-stream.firebasestorage.app",
  messagingSenderId: "288239168968",
  appId: "1:288239168968:web:7d56c6fa2299ae397f24fd",
  measurementId: "G-B4S3NK56XB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Re-export firestore functions
export { 
  collection, addDoc, query, orderBy, limit, getDocs, 
  onSnapshot, serverTimestamp, writeBatch, doc, 
  deleteDoc, getDoc, setDoc 
};
