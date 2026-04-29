import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * CONFIGURACIÓN CENTRAL DE FIREBASE
 * Este archivo centraliza la conexión con Google Firebase.
 * Al exportar 'auth' y 'db', permitimos que el resto de componentes
 * accedan a la base de datos de forma segura y organizada.
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

// Inicializamos la App de Firebase (verificando que no esté inicializada previamente)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportamos los servicios para que otros archivos los usen
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * ID del proyecto. 
 * Se utiliza para organizar las colecciones en Firestore siguiendo la estructura de rutas:
 * /artifacts/{appId}/public/data/{collectionName}
 */
export const appId = "colegio-italiano-san-pedro";

export default app;