document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
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
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
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
        if (question) {
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
        }
    });

    // Course details modal
    window.showCourseDetails = function(courseType) {
        const modal = document.getElementById('courseModal');
        const modalBody = document.getElementById('modalBody');
        if (!modal || !modalBody) return;

        const courseInfo = {
            completo: {
                title: 'Curso Completo',
                description: 'El programa más completo para tu preparación. Incluye todas las áreas del examen de admisión.',
                features: [
                    '120 horas de clases',
                    'Material de estudio completo',
                    'Simulacros de examen',
                    'Tutorías personalizadas',
                    'Acceso por 6 meses'
                ],
                price: '$450.000',
                finalPrice: '$360.000'
            },
            intensivo: {
                title: 'Curso Intensivo',
                description: 'Programa acelerado para resultados rápidos en poco tiempo.',
                features: [
                    '80 horas de clases',
                    'Material exclusivo',
                    '5 simulacros completos',
                    'Acceso por 4 meses'
                ],
                price: '$320.000',
                finalPrice: '$272.000'
            },
            virtual: {
                title: 'Curso Virtual',
                description: 'Estudia desde cualquier lugar con nuestro programa 100% online.',
                features: [
                    'Clases en vivo diarias',
                    'Plataforma 24/7',
                    'Grabaciones disponibles',
                    'Acceso por 6 meses'
                ],
                price: '$280.000'
            }
        };

        const course = courseInfo[courseType];
        if (!course) return;
        
        let featuresList = course.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
        
        modalBody.innerHTML = `
            <h2>${course.title}</h2>
            <p>${course.description}</p>
            <h3>Incluye:</h3>
            <ul>${featuresList}</ul>
            <button class="btn btn-primary" onclick="location.href='#contacto'; document.getElementById('courseModal').classList.remove('active');">Inscribirse Ahora</button>
        `;
        
        modal.classList.add('active');
    };

    // Staggered animation on scroll (Intersection Observer)
    const observerOptions = { threshold: 0.1 };
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

    // Admin login modal triggering
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    document.addEventListener('click', function(e) {
        if (e.target.closest('.admin-panel-btn, .admin-panel-btn-mobile, .btn-admin-access')) {
            e.preventDefault();
            if (localStorage.getItem('adminLoggedIn') === 'true') {
                if (typeof showAdminPanel === 'function') showAdminPanel();
            } else {
                if (adminLoginModal) adminLoginModal.classList.add('active');
            }
        }
    });

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const submitBtn = this.querySelector('.btn-primary');
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;
            try {
                if (typeof adminLogin === 'function') {
                    const result = await adminLogin(email, password);
                    if (result.success) {
                        adminLoginMessage.textContent = '¡Inicio de sesión exitoso!';
                        adminLoginMessage.style.color = 'var(--primary)';
                        setTimeout(() => {
                            adminLoginModal.classList.remove('active');
                            adminLoginForm.reset();
                            adminLoginMessage.textContent = '';
                            submitBtn.textContent = 'Iniciar Sesión';
                            submitBtn.disabled = false;
                        }, 1500);
                    } else {
                        adminLoginMessage.textContent = 'Error: ' + result.error;
                        adminLoginMessage.style.color = 'red';
                        submitBtn.textContent = 'Iniciar Sesión';
                        submitBtn.disabled = false;
                    }
                }
            } catch (error) {
                console.error('Admin login error:', error);
                submitBtn.textContent = 'Iniciar Sesión';
                submitBtn.disabled = false;
            }
        });
    }

    // Modal Close logic
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Registration form submission logic (Firestore)
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const course = document.getElementById('course').value;
            const message = document.getElementById('message').value.trim();
            const submitBtn = this.querySelector('.btn-primary');
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;
            try {
                if (typeof db !== 'undefined') {
                    await db.collection('registrations').add({
                        name: name,
                        email: email,
                        phone: phone,
                        course: course,
                        message: message,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'pending'
                    });
                    alert(`¡Gracias ${name}! Tu inscripción ha sido enviada con éxito.`);
                    registrationForm.reset();
                }
            } catch (error) {
                console.error("Error submitting registration:", error);
                alert('Hubo un error al procesar tu inscripción.');
            } finally {
                submitBtn.textContent = 'Enviar Inscripción';
                submitBtn.disabled = false;
            }
        });
    }
});