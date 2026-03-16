document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Modal functionality
    const modal = document.getElementById('courseModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.getElementById('modalBody');

    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Course details modal
    window.showCourseDetails = function(courseType) {
        const courseInfo = {
            completo: {
                title: 'Curso Completo',
                description: 'El programa más completo para tu preparación. Incluye todas las áreas del examen de admisión.',
                features: [
                    '120 horas de clases presenciales',
                    'Material de estudio físico y digital',
                    '10 simulacros de examen completos',
                    '4 tutorías personalizadas',
                    'Acceso a plataforma por 6 meses',
                    'Grupo de WhatsApp de apoyo',
                    'Sesiones de reforzamiento gratuito'
                ],
                price: '$450.000',
                discount: '20%',
                finalPrice: '$360.000',
                duration: '3 meses (120 horas)',
                schedule: 'Lunes a viernes: 6pm - 9pm'
            },
            intensivo: {
                title: 'Curso Intensivo',
                description: 'Programa acelerado para resultados rápidos en poco tiempo.',
                features: [
                    '80 horas de clases intensivas',
                    'Material de estudio exclusivo',
                    '5 simulacros de examen',
                    '2 tutorías personalizadas',
                    'Acceso a plataforma por 4 meses',
                    'Grupo de estudio activo',
                    'Clases grabadas disponibles'
                ],
                price: '$320.000',
                discount: '15%',
                finalPrice: '$272.000',
                duration: '6 semanas (80 horas)',
                schedule: 'Lunes a sábado: 8am - 1pm'
            },
            virtual: {
                title: 'Curso Virtual',
                description: 'Estudia desde cualquier lugar con nuestro programa 100% online.',
                features: [
                    'Clases en vivo diarias',
                    'Plataforma disponible 24/7',
                    'Grabaciones de todas las clases',
                    'Tutorías online ilimitadas',
                    'Acceso por 6 meses',
                    'Simulacros online',
                    'Soporte técnico permanente'
                ],
                price: '$280.000',
                duration: '6 meses de acceso',
                schedule: 'Clases en vivo: 7pm - 9pm'
            }
        };

        const course = courseInfo[courseType];
        
        let featuresList = course.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
        
        let priceHtml = course.finalPrice 
            ? `<div class="modal-price">
                    <span class="original-price">${course.price}</span>
                    <span class="discount-badge">${course.discount} dto.</span>
                    <span class="final-price">${course.finalPrice}</span>
               </div>`
            : `<div class="modal-price">
                    <span class="final-price">${course.price}</span>
               </div>`;

        modalBody.innerHTML = `
            <h2>${course.title}</h2>
            <p class="modal-description">${course.description}</p>
            
            <div class="modal-details">
                <h3><i class="fas fa-clock"></i> Duración</h3>
                <p>${course.duration}</p>
                
                <h3><i class="fas fa-calendar"></i> Horarios</h3>
                <p>${course.schedule}</p>
            </div>
            
            <h3><i class="fas fa-list"></i> Incluye:</h3>
            <ul class="modal-features">
                ${featuresList}
            </ul>
            
            ${priceHtml}
            
            <button class="btn btn-primary" onclick="location.href='#contacto'">Inscribirse Ahora</button>
        `;
        
        modal.classList.add('active');
    };

    // Form submission
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const course = document.getElementById('course').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !phone || !course) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;
            
            // Add to Firestore
            await db.collection('registrations').add({
                name: name,
                email: email,
                phone: phone,
                course: course,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });
            
            // Show success message
            alert(`¡Gracias ${name}! Tu inscripción al ${course} ha sido enviada. Nos contactaremos pronto a ${email}.`);
            
            // Reset form
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert('Hubo un error al procesar tu inscripción. Por favor intenta nuevamente.');
        } finally {
            // Reset button state
            const submitBtn = form.querySelector('.btn-primary');
            submitBtn.textContent = 'Enviar Inscripción';
            submitBtn.disabled = false;
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Staggered animation on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.course-card, .benefit-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Demo mode for testing
    const DEMO_MODE = true; // Set to false for production

    if (DEMO_MODE && typeof db !== 'undefined') {
        document.addEventListener('DOMContentLoaded', async function() {
            // Wait a bit for other initializations
            setTimeout(async function() {
                console.log('[DEMO MODE] Adding test data to Firestore...');
                
                try {
                    // Test student registration 1
                    await db.collection('registrations').add({
                        name: 'Carlos Rodríguez',
                        email: 'carlos.rodriguez@estudiante.com',
                        phone: '3105551234',
                        course: 'completo',
                        message: 'Interesado en conocer detalles del temario y horarios',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'pending'
                    });
                    
                    console.log('[DEMO MODE] Added test registration for Carlos Rodríguez');
                    
                    // Test student registration 2
                    await db.collection('registrations').add({
                        name: 'Ana Martínez',
                        email: 'ana.martinez@estudiante.com',
                        phone: '3105555678',
                        course: 'virtual',
                        message: 'Necesito flexibilidad por mi trabajo de medio tiempo',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'completed'
                    });
                    
                    console.log('[DEMO MODE] Added test registration for Ana Martínez');
                    
                    // Show notification to user
                    alert('MODO DEMOSTRACIÓN: Se han agregado registros de prueba de estudiantes.\n\nDiríjase al Panel de Administrador para verlos.');
                    
                } catch (error) {
                    console.error('[DEMO MODE] Error adding test data:', error);
                    // Don't alert for errors in demo mode to avoid annoying users
                }
            }, 2000); // Delay to let other initializations complete
        });
    }

    // Admin login modal functionality
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginClose = document.querySelector('#adminLoginModal .modal-close');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    // Open admin login modal when clicking admin panel button
    document.addEventListener('click', function(e) {
        if (e.target.matches('.admin-panel-btn, .admin-panel-btn-mobile')) {
            e.preventDefault();
            adminLoginModal.classList.add('active');
        }
    });

    // Close admin login modal
    if (adminLoginClose) {
        adminLoginClose.addEventListener('click', function() {
            adminLoginModal.classList.remove('active');
            adminLoginForm.reset();
            adminLoginMessage.textContent = '';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === adminLoginModal) {
            adminLoginModal.classList.remove('active');
            adminLoginForm.reset();
            adminLoginMessage.textContent = '';
        }
    });

    // Handle admin login form submission
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;
            
            try {
                // Attempt admin login
                const result = await adminLogin(email, password);
                
                if (result.success) {
                    adminLoginMessage.textContent = '¡Inicio de sesión exitoso!';
                    adminLoginMessage.style.color = 'var(--primary)';
                    
                    // Close modal after short delay
                    setTimeout(() => {
                        adminLoginModal.classList.remove('active');
                        adminLoginForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                } else {
                    adminLoginMessage.textContent = 'Error: ' + result.error;
                    adminLoginMessage.style.color = 'var(--accent)';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Admin login error:', error);
                adminLoginMessage.textContent = 'Error al iniciar sesión. Por favor intenta nuevamente.';
                adminLoginMessage.style.color = 'var(--accent)';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
    }, observerOptions);

    document.querySelectorAll('.course-card, .benefit-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Admin login modal functionality
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginClose = document.querySelector('#adminLoginModal .modal-close');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    // Open admin login modal when clicking admin panel button
    document.addEventListener('click', function(e) {
        if (e.target.matches('.admin-panel-btn, .admin-panel-btn-mobile')) {
            e.preventDefault();
            adminLoginModal.classList.add('active');
        }
    });

    // Close admin login modal
    if (adminLoginClose) {
        adminLoginClose.addEventListener('click', function() {
            adminLoginModal.classList.remove('active');
            adminLoginForm.reset();
            adminLoginMessage.textContent = '';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === adminLoginModal) {
            adminLoginModal.classList.remove('active');
            adminLoginForm.reset();
            adminLoginMessage.textContent = '';
        }
    });

    // Handle admin login form submission
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;
            
            try {
                // Attempt admin login
                const result = await adminLogin(email, password);
                
                if (result.success) {
                    adminLoginMessage.textContent = '¡Inicio de sesión exitoso!';
                    adminLoginMessage.style.color = 'var(--primary)';
                    
                    // Close modal after short delay
                    setTimeout(() => {
                        adminLoginModal.classList.remove('active');
                        adminLoginForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                } else {
                    adminLoginMessage.textContent = 'Error: ' + result.error;
                    adminLoginMessage.style.color = 'var(--accent)';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Admin login error:', error);
                adminLoginMessage.textContent = 'Error al iniciar sesión. Por favor intenta nuevamente.';
                adminLoginMessage.style.color = 'var(--accent)';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});