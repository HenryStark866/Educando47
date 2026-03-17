// payment.js
document.addEventListener('DOMContentLoaded', () => {
    const paymentButtons = document.querySelectorAll('.payment-btn');
    
    paymentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const wompiLink = button.getAttribute('data-wompi-link');
            if (wompiLink) {
                // Intercept click and open in new tab
                window.open(wompiLink, '_blank');
            }
        });
    });
});