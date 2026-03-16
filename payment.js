// Wompi Payment Processing
// Using Wompi payment links for course payments

// Course prices in COP (Colombian Pesos) - Updated with user-provided prices
const coursePrices = {
    completo: 760000, // $760.000 COP (precio final proporcionado por el usuario)
    intensivo: 450000, // $450.000 COP (precio final proporcionado por el usuario)
    virtual: 0        // Curso virtual temporalmente deshabilitado para pagos
};

// Wompi payment links for each course - ACTUALIZADO CON LOS ENLACES PROPORCIONADOS POR EL USUARIO
const wompiPaymentLinks = {
    completo: 'https://checkout.wompi.co/l/test_aXZQnb', // Enlace proporcionado para curso completo
    intensivo: 'https://checkout.wompi.co/l/test_eNzGqL', // Enlace proporcionado para curso intensivo
    virtual: '' // Enlace no proporcionado - curso virtual temporalmente deshabilitado
};

// Initialize payment system (no initialization needed for Wompi direct links)
function initWompiPayment() {
    console.log('Wompi payment system initialized');
    return true;
}

// Handle payment confirmation via Wompi
async function handlePayment(courseType) {
    try {
        const amount = coursePrices[courseType];
        if (amount === 0) {
            throw new Error('Este curso temporalmente no está disponible para pago. Por favor contacte al administrador.');
        }
        
        // Get the Wompi payment link for this course
        const paymentLink = wompiPaymentLinks[courseType];
        if (!paymentLink) {
            throw new Error('Enlace de pago no configurado para este curso');
        }
        
        // Show loading state
        const paymentButton = document.querySelector('.modal .btn-primary');
        const originalText = paymentButton.textContent;
        paymentButton.textContent = 'Redirigiendo a pago...';
        paymentButton.disabled = true;
        
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to Wompi payment page
        window.location.href = paymentLink;
        
        // Note: In a real implementation with Wompi, you would:
        // 1. Use Wompi SDK to create a token or payment request
        // 2. Handle webhooks for payment confirmation
        // 3. Redirect back to your site after payment
        // For this implementation, we're using direct links for simplicity
        
    } catch (error) {
        console.error('Payment error:', error);
        alert('Hubo un error al procesar el pago. Por favor intenta nuevamente o contacta soporte.');
    } finally {
        // Reset button state (only if not redirected)
        const paymentButton = document.querySelector('.modal .btn-primary');
        if (paymentButton && !document.hidden) { // Check if we're still on the page
            paymentButton.textContent = 'Inscribirse y Pagar';
            paymentButton.disabled = false;
        }
    }
}

// Update the showCourseDetails function to include payment option
function updateCourseDetailsWithPayment() {
    // This function will be called to modify the modal content to include payment
    // We'll override the original showCourseDetails function
    const originalShowCourseDetails = window.showCourseDetails;
    
    window.showCourseDetails = function(courseType) {
        // Call original function to get the modal content
        originalShowCourseDetails(courseType);
        
        // Modify the modal to include payment option
        setTimeout(() => {
            const modalContent = document.querySelector('.modal-content');
            const inspectButton = modalContent.querySelector('.btn-primary');
            
            if (inspectButton && inspectButton.textContent === 'Inscribirse Ahora') {
                // Change button text and functionality
                inspectButton.textContent = 'Inscribirse y Pagar';
                inspectButton.onclick = function() {
                    handlePayment(courseType);
                };
                
                // Add any Wompi specific scripts if needed (for basic redirect, not needed)
                // Wompi direct links don't require additional JS SDK for basic usage
            }
        }, 100);
    };
}

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCourseDetailsWithPayment();
    initWompiPayment();
});

// Export functions for use in other files
window.handlePayment = handlePayment;
window.initWompiPayment = initWompiPayment;