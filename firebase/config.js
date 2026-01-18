// firebase/config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBOjcAHUpmPLjhAjJIbNGiX_u5lLuBYdVo",
  authDomain: "proyecto-grupal-3a826.firebaseapp.com",
  databaseURL: "https://proyecto-grupal-3a826-default-rtdb.firebaseio.com",
  projectId: "proyecto-grupal-3a826",
  storageBucket: "proyecto-grupal-3a826.firebasestorage.app",
  messagingSenderId: "1082669652963",
  appId: "1:1082669652963:web:e1e4d2d74a21397e709ed6",
  measurementId: "G-9X01H9WB90",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export default app;
