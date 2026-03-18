import { db } from "./firebase-config.js";
import { collection, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

let isInitialLoad = true;

// Solo escucha a los documentos más recientes para no iterar sobre todos la primera vez.
const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"), limit(5));

onSnapshot(q, (snapshot) => {
    if (isInitialLoad) {
        // Ignora los cambios en la primera lectura inicial para no spamear console
        isInitialLoad = false;
        return;
    }

    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            const plan = data.plan || 'Plan desconocido';
            const nombre = data.nombre || 'Estudiante anónimo';
            
            // Simulación de sistema de alertas vía Console.
            console.log(
                `%c🔔 NUEVA INSCRIPCIÓN DETECTADA`, 
                `color: #059669; font-weight: bold; font-size: 14px; border: 2px solid #059669; padding: 4px; border-radius: 6px; background: #ecfdf5; text-shadow: 0px 0px 1px rgba(0,0,0,0.1);`
            );
            console.log(`📡 Simulación de envío de notificación / WhatsApp al administrador (henry.taborda866@pascualbravo.edu.co)...`);
            console.log(`🧑‍🎓 Nombre   : ${nombre}`);
            console.log(`📘 Curso    : ${plan}`);
            console.log(`📧 Correo   : ${data.email || 'N/A'}`);
            console.log(`===============================================`);
        }
    });
}, (error) => {
    // Si da permiso denegado por reglas de seguridad anonimas para lecturas globales,
    // se captura silenciosamente en consola.
    if (error.code !== 'permission-denied') {
        console.warn("Notification system error:", error);
    }
});