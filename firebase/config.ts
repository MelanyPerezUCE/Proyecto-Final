import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apikey: "AIzaSyBOjcAHUpmPLjhAjJIbNGiX_u5lLuBYdVo",
    authDomain: "proyecto-grupal-3a826.firebaseapp.com",
    databaseURL: "https://proyecto-grupal-3a826-default-rtdb.firebaseio.com",
    projectId: "proyecto-grupal-3a826",
    storageBucket: "proyecto-grupal-3a826.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export default app;