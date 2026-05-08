import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * CONFIGURACIÓN CENTRAL DE FIREBASE
 * Este archivo centraliza la conexión con Google Firebase.
 */

const firebaseConfig = {
  // Credenciales del proyecto Colegio Italiano San Pedro
  apiKey: "AIzaSyAjKKEuC2NIeEZ67CU7fz873zBwKyXgIwg",
  authDomain: "colegioitalianosp-1add7.firebaseapp.com",
  projectId: "colegioitalianosp-1add7",
  storageBucket: "colegioitalianosp-1add7.firebasestorage.app",
  messagingSenderId: "864035382925",
  appId: "1:864035382925:web:d3f1813e63bf9cd58de4c4"
};

// Inicialización segura (evita duplicación)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Servicios Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ID del proyecto
export const appId = "colegio-italiano-san-pedro";

export default app;