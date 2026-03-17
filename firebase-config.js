import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBOLlMtZB9vfdbWo3PlABfTru19A2Id2I4",
    projectId: "prepudea-platform",
    appId: "1:30596061507:web:7dd5dbbad3ededc5f6f7f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authenticate anonymously (catch admin restricted operation silently)
const initAnonAuth = async () => {
    try {
        await signInAnonymously(auth);
    } catch (error) {
        if (error.code === 'auth/admin-restricted-operation') {
            console.warn("Autenticación anónima restringida por el administrador (esto es esperado en desarrollo o según configuración de Firebase).");
        } else {
            console.error("Error en autenticación:", error);
        }
    }
};

initAnonAuth();

export { app, db, auth };