// workshop-storage.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Guarda los resultados del taller en Firestore de forma automática.
 * @param {string} workshopType - 'Logica' o 'Lectura'
 * @param {Array} userAnswers - Array con las respuestas seleccionadas por el usuario.
 * @param {Array} correctAnswers - Array base con las respuestas correctas.
 */
export async function saveWorkshopResults(workshopType, userAnswers, correctAnswers) {
    if (!userAnswers || !correctAnswers || userAnswers.length !== correctAnswers.length) {
        console.error("Error: Arrays de respuestas no coinciden o están incompletos.");
        return null;
    }

    let rawScore = 0;
    const totalQuestions = correctAnswers.length;

    // Calculamos el puntaje (UdeA usa un sistema complejo, pero aproximaremos un peso igual por pregunta para simulación)
    for (let i = 0; i < totalQuestions; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
            rawScore++;
        }
    }

    // Puntaje simulado sobre 100
    const finalScore = ((rawScore / totalQuestions) * 100).toFixed(2);

    // Obtener datos del estudiante almacenados localmente (si existen) o usar Anónimo
    const studentName = localStorage.getItem('vetprep_student_name') || 'Anónimo';
    const studentEmail = localStorage.getItem('vetprep_student_email') || 'N/A';
    
    // Almacenamiento del documento
    const workshopData = {
        studentName: studentName,
        studentEmail: studentEmail,
        workshopType: workshopType,
        rawScore: rawScore,
        totalQuestions: totalQuestions,
        finalScore: parseFloat(finalScore),
        timestamp: serverTimestamp(),
        deviceUserAgent: navigator.userAgent
    };

    try {
        const docRef = await addDoc(collection(db, "talleres_resultados"), workshopData);
        console.log(`[Firebase] Resultado de ${workshopType} guardado con éxito. ID: ${docRef.id}`);
        return { success: true, score: finalScore, raw: rawScore };
    } catch (e) {
        console.error("Error guardando el resultado del taller: ", e);
        // Fallback a localStorage si falla Firebase por reglas/red
        localStorage.setItem(`backup_score_${workshopType}_${Date.now()}`, JSON.stringify(workshopData));
        return { success: false, score: finalScore, raw: rawScore, error: e };
    }
}
