// config/FireBaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFxnxtdIJZiywDErQDF_SRjDM-vNEp5qU",
  authDomain: "app-graffiti.firebaseapp.com",
  projectId: "app-graffiti",
  storageBucket: "app-graffiti.firebasestorage.app",
  messagingSenderId: "52671159175",
  appId: "1:52671159175:web:abcabd24b23f997b255122",
  measurementId: "G-F3WH7YMM9R"
};

// Inicializa Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Usa la app existente
}

export const db = getFirestore(app);
export const auth = getAuth(app);
