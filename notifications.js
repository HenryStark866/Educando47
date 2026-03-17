// Notification System for VetPrep UdeA
// Handles notifications for new registrations, course inquiries, and system alerts

// Notification configuration
const NOTIFICATION_CONFIG = {
    // In a real implementation, these would come from environment variables or a secure config service
    adminEmail: "henry.taborda866@pascualbravo.edu.co", // Your email
    adminWhatsApp: "3245769748", // Your WhatsApp number
    paypalEmail: "henry.taborda866@pascualbravo.edu.co", // PayPal for payments
    // These would be replaced with actual service integrations in production
    emailServiceEnabled: false, // Set to true when email service is configured
    whatsappServiceEnabled: false, // Set to true when WhatsApp service is configured
};

// Initialize notification system
function initNotificationSystem() {
    console.log("Notification system initialized");
    
    // Set up real-time listener for new registrations
    setupRegistrationListener();
    
    // Set up listener for course inquiries (if we had a separate collection)
    // setupCourseInquiryListener();
    
    // Set up periodic checks for pending actions
    setupPeriodicChecks();
}

// Listen for new registrations in Firestore
function setupRegistrationListener() {
    if (typeof db === 'undefined') {
        console.warn("Firestore not initialized, skipping registration listener");
        return;
    }
    
    // Listen for new documents in the registrations collection
    db.collection('registrations')
        .where('status', '==', 'pending')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const registration = change.doc.data();
                    handleNewRegistration(registration, change.doc.id);
                }
                // Handle status changes (e.g., when payment is confirmed)
                if (change.type === 'modified') {
                    const registration = change.doc.data();
                    handleRegistrationUpdate(registration, change.doc.id);
                }
            });
        });
}

// Handle new registration notification
async function handleNewRegistration(registration, docId) {
    try {
        console.log(`New registration received: ${registration.name} for ${registration.course}`);
        
        // Prepare notification content
        const notificationContent = {
            type: 'new_registration',
            title: 'Nueva Inscripción Recibida',
            message: `Has recibido una nueva inscripción:\n\n` +
                    `Nombre: ${registration.name}\n` +
                    `Email: ${registration.email}\n` +
                    `Teléfono: ${registration.phone}\n` +
                    `Curso: ${registration.course}\n` +
                    `Mensaje: ${registration.message || 'Ninguno'}\n` +
                    `Fecha: ${new Date().toLocaleString()}\n\n` +
                    `ID de registro: ${docId}`,
            priority: 'high',
            timestamp: new Date()
        };
        
        // Send notifications
        await sendAdminNotification(notificationContent);
        
        // Also send a confirmation to the student (if email/WhatsApp is configured)
        await sendStudentConfirmation(registration);
        
    } catch (error) {
        console.error('Error handling new registration:', error);
    }
}

// Handle registration updates (e.g., payment confirmation)
async function handleRegistrationUpdate(registration, docId) {
    try {
        console.log(`Registration updated: ${registration.name} - Status: ${registration.status}`);
        
        // Notify admin of status changes
        if (registration.status === 'completed') {
            const notificationContent = {
                type: 'registration_completed',
                title: 'Inscripción Completada',
                message: `La inscripción de ${registration.name} ha sido completada:\n\n` +
                        `Curso: ${registration.course}\n` +
                        `Email: ${registration.email}\n` +
                        `Fecha de completion: ${new Date().toLocaleString()}\n\n` +
                        `ID de registro: ${docId}`,
                priority: 'medium',
                timestamp: new Date()
            };
            
            await sendAdminNotification(notificationContent);
        }
    } catch (error) {
        console.error('Error handling registration update:', error);
    }
}

// Send notification to admin (email/WhatsApp)
async function sendAdminNotification(notification) {
    try {
        // In a real implementation, you would use:
        // - Email service (SendGrid, Mailgun, SES, etc.)
        // - WhatsApp Business API
        // - SMS service (Twilio, etc.)
        // - Push notifications
        
        // For now, we'll simulate and log
        console.log('[NOTIFICATION] Sending to admin:');
        console.log(`  Title: ${notification.title}`);
        console.log(`  Message: ${notification.message}`);
        
        // Simulate sending via email (if configured)
        if (NOTIFICATION_CONFIG.emailServiceEnabled) {
            await sendEmailNotification(
                NOTIFICATION_CONFIG.adminEmail,
                notification.title,
                notification.message
            );
        }
        
        // Simulate sending via WhatsApp (if configured)
        if (NOTIFICATION_CONFIG.whatsappServiceEnabled) {
            await sendWhatsAppNotification(
                NOTIFICATION_CONFIG.adminWhatsApp,
                notification.message
            );
        }
        
        // Also show in-browser notification if user is on admin panel
        showBrowserNotification(notification);
        
        return { success: true };
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return { success: false, error: error.message };
    }
}

// Send confirmation to student
async function sendStudentConfirmation(registration) {
    try {
        const confirmationContent = {
            type: 'registration_confirmation',
            title: 'Confirmación de Inscripción - VetPrep UdeA',
            message: `Hola ${registration.name},\n\n` +
                    `Gracias por inscribirte en nuestro curso de ${registration.course}.\n\n` +
                    `Detalles de tu inscripción:\n` +
                    `Curso: ${registration.course}\n` +
                    `Precio: Consultar según promociones vigentes\n` +
                    `Próximos pasos: Nuestro equipo de admisión se pondrá en contacto contigo vía WhatsApp o email para completar el proceso de pago y matrícula.\n\n` +
                    `Mientras tanto, puedes:\n` +
                    `1. Acceder a nuestro material introductorio en el área de estudiantes\n` +
                    `2. Unirte a nuestro grupo de WhatsApp de aspirantes\n` +
                    `3. Consultar nuestras preguntas frecuentes\n\n` +
                    `¡Estamos emocionados de ayudarte a alcanzar tu objetivo de ingresar a Medicina Veterinaria en la UdeA!\n\n` +
                    `Saludos cordiales,\n` +
                    `El Equipo VetPrep UdeA`,
            priority: 'medium',
            timestamp: new Date()
        };
        
        console.log('[NOTIFICATION] Sending confirmation to student:');
        console.log(`  To: ${registration.email}`);
        console.log(`  Message: ${confirmationContent.message.substring(0, 100)}...`);
        
        // In production, this would use actual email/WhatsApp service
        // For now, we'll just log it
        
        return { success: true };
    } catch (error) {
        console.error('Error sending student confirmation:', error);
        return { success: false, error: error.message };
    }
}

// Simulate email sending (would be replaced with actual service)
async function sendEmailNotification(to, subject, body) {
    // In production, you would use:
    // return await fetch('/api/send-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ to, subject, body })
    // });
    
    // For now, simulate delay and success
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[EMAIL SIMULATION] Sent to ${to}: ${subject}`);
    return { success: true };
}

// Simulate WhatsApp sending (would be replaced with actual service)
async function sendWhatsAppNotification(to, message) {
    // In production, you would use WhatsApp Business API
    // For now, simulate delay and success
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[WHATSAPP SIMULATION] Sent to ${to}: ${message.substring(0, 50)}...`);
    return { success: true };
}

// Show browser notification (for when admin is logged in)
function showBrowserNotification(notification) {
    // Check if notifications are supported and permitted
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return;
    }
    
    // Check if permission is already granted
    if (Notification.permission === 'granted') {
        // Show notification
        new Notification(notification.title, {
            body: notification.message.substring(0, 100) + '...',
            icon: '/icon.png' // You would need to add an icon
        });
    }
    // Otherwise, we need to ask for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message.substring(0, 100) + '...',
                    icon: '/icon.png'
                });
            }
        });
    }
}

// Setup periodic checks for system health and pending actions
function setupPeriodicChecks() {
    // Check for pending payments every 5 minutes
    setInterval(checkPendingPayments, 5 * 60 * 1000);
    
    // Check for unread inquiries every 10 minutes
    setInterval(checkUnreadInquiries, 10 * 60 * 1000);
    
    // Daily summary at 8 AM
    setInterval(checkForDailySummary, 60 * 60 * 1000); // Check every hour
}

// Check for pending payments that need attention
async function checkPendingPayments() {
    try {
        if (typeof db === 'undefined') return;
        
        const pendingPayments = await db.collection('registrations')
            .where('status', '==', 'pending')
            .get();
        
        if (pendingPayments.size > 0) {
            console.log(`[PERIODIC CHECK] ${pendingPayments.size} pending payments found`);
            
            // In a real implementation, you might send a summary notification
            // if the count exceeds a threshold
        }
    } catch (error) {
        console.error('Error checking pending payments:', error);
    }
}

// Check for unread inquiries
async function checkUnreadInquiries() {
    try {
        // This would check a separate collection for inquiries/messages
        // For now, we'll just log that the check ran
        console.log('[PERIODIC CHECK] Checking for unread inquiries...');
    } catch (error) {
        console.error('Error checking unread inquiries:', error);
    }
}

// Check if it's time to send daily summary
async function checkForDailySummary() {
    try {
        const now = new Date();
        // Send summary at 8:00 AM every day
        if (now.getHours() === 8 && now.getMinutes() < 10) {
            await sendDailySummary();
        }
    } catch (error) {
        console.error('Error checking for daily summary:', error);
    }
}

// Send daily summary of activity
async function sendDailySummary() {
    try {
        if (typeof db === 'undefined') return;
        
        // Get yesterday's stats
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const registrationsSnapshot = await db.collection('registrations')
            .where('timestamp', '>=', yesterday)
            .where('timestamp', '<', today)
            .get();
        
        const total = registrationsSnapshot.size;
        let completados = 0;
        let pendientes = 0;
        
        registrationsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'completed') completados++;
            if (data.status === 'pending') pendientes++;
        });
        
        const summaryContent = {
            type: 'daily_summary',
            title: 'Resumen Diario - VetPrep UdeA',
            message: `Resumen de actividades del ${yesterday.toLocaleDateString()}:\n\n` +
                    `Total de nuevas inscripciones: ${total}\n` +
                    `Inscripciones completadas: ${completados}\n` +
                    `Inscripciones pendientes: ${pendientes}\n` +
                    `Tasa de conversión: ${total > 0 ? ((completados / total) * 100).toFixed(1) : 0}%\n\n` +
                    `Próximos pasos:\n` +
                    `1. Revisar inscripciones pendientes en el panel de admin\n` +
                    `2. Seguir up con estudiantes que no han completado pago\n` +
                    `3. Preparar material para el día siguiente\n\n` +
                    `¡Que tengas un excelente día!`,
            priority: 'low',
            timestamp: new Date()
        };
        
        await sendAdminNotification(summaryContent);
        console.log('[DAILY SUMMARY] Sent daily summary notification');
    } catch (error) {
        console.error('Error sending daily summary:', error);
    }
}

// Export functions for global use
window.initNotificationSystem = initNotificationSystem;
window.sendAdminNotification = sendAdminNotification;
window.sendStudentConfirmation = sendStudentConfirmation;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNotificationSystem();
});