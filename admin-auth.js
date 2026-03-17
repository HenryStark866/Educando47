// Admin Authentication System
// Handles admin login, authentication, and authorization

// Admin credentials (in a real app, these would be stored securely in Firebase Auth or environment variables)
const ADMIN_CREDENTIALS = {
    email: "henry.taborda866@pascualbravo.edu.co",
    password: "VetPrep2026!SecureAdmin",
    // In a real implementation, you would hash the password and verify against a stored hash
    // This is simplified for demonstration
};

// Admin privileges and permissions
const ADMIN_PRIVILEGES = {
    canViewAllRegistrations: true,
    canEditCourses: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canModifyPayments: true,
    canManageAIProfessors: true,
    canAccessAdminPanel: true
};

// Initialize admin auth system
function initAdminAuth() {
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const adminData = localStorage.getItem('adminData');
    
    if (adminLoggedIn && adminData) {
        // Admin is already logged in, show admin UI if needed
        showAdminUI(JSON.parse(adminData));
    } else {
        // No admin logged in, check if we should show login form
        // For now, we'll just make sure the login function is available
        console.log("Admin auth system initialized");
    }
}

// Admin login function
async function adminLogin(email, password) {
    try {
        // Validate credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // In a real app, you would use Firebase Auth here:
            // const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // For this implementation, we'll simulate successful login
            const adminData = {
                email: ADMIN_CREDENTIALS.email,
                privileges: ADMIN_PRIVILEGES,
                loginTime: new Date().toISOString()
            };
            
            // Store admin session
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminData', JSON.stringify(adminData));
            
            // Show admin UI
            showAdminUI(adminData);
            
            return { success: true, admin: adminData };
        } else {
            throw new Error('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        return { success: false, error: error.message };
    }
}

// Admin logout function
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminData');
    hideAdminUI();
    alert('Has cerrado sesión como administrador');
}

// Show admin UI elements
function showAdminUI(adminData) {
    // Add admin panel button to navbar if not exists
    if (!document.querySelector('.admin-panel-btn')) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const adminBtn = document.createElement('li');
            adminBtn.innerHTML = `
                <a href="#admin-panel" class="admin-panel-btn">
                    <i class="fas fa-user-shield"></i> Panel Admin
                </a>
            `;
            navLinks.appendChild(adminBtn);
            
            // Add click handler
            adminBtn.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                showAdminPanel();
            });
        }
    }
    
    // Also add to mobile menu
    const mobileNavLinks = document.querySelector('.nav-links');
    if (mobileNavLinks && !mobileNavLinks.querySelector('.admin-panel-btn-mobile')) {
        const adminBtnMobile = document.createElement('li');
        adminBtnMobile.innerHTML = `
            <a href="#admin-panel" class="admin-panel-btn-mobile">
                <i class="fas fa-user-shield"></i> Admin
            </a>
        `;
        mobileNavLinks.appendChild(adminBtnMobile);
        
        adminBtnMobile.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            showAdminPanel();
            // Close mobile menu
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Hide admin UI elements
function hideAdminUI() {
    const adminBtns = document.querySelectorAll('.admin-panel-btn, .admin-panel-btn-mobile');
    adminBtns.forEach(btn => btn.remove());
    
    // Hide admin panel if visible
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
}

// Show admin panel
function showAdminPanel() {
    // Create admin panel if not exists
    let adminPanel = document.getElementById('adminPanel');
    if (!adminPanel) {
        adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-panel-header">
                    <h2>Panel de Administración</h2>
                    <button class="admin-logout-btn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
                </div>
                
                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="registrations">Registros</button>
                    <button class="admin-tab" data-tab="courses">Cursos</button>
                    <button class="admin-tab" data-tab="users">Usuarios</button>
                    <button class="admin-tab" data-tab="analytics">Analíticas</button>
                    <button class="admin-tab" data-tab="ai-professors">Profesores IA</button>
                </div>
                
                <div class="admin-tab-content">
                    <div id="tab-registrations" class="tab-pane active">
                        <h3>Registros de Estudiantes</h3>
                        <div class="admin-table-container" id="registrationsTable">
                            <p>Cargando registros...</p>
                        </div>
                    </div>
                    
                    <div id="tab-courses" class="tab-pane">
                        <h3>Gestión de Cursos</h3>
                        <div class="admin-table-container" id="coursesTable">
                            <p>Cargando cursos...</p>
                        </div>
                    </div>
                    
                    <div id="tab-users" class="tab-pane">
                        <h3>Gestión de Usuarios</h3>
                        <div class="admin-table-container" id="usersTable">
                            <p>Cargando usuarios...</p>
                        </div>
                    </div>
                    
                    <div id="tab-analytics" class="tab-pane">
                        <h3>Analíticas y Reportes</h3>
                        <div class="admin-table-container" id="analyticsTable">
                            <p>Cargando analíticas...</p>
                        </div>
                    </div>
                    
                    <div id="tab-ai-professors" class="tab-pane">
                        <h3>Gestión de Profesores IA</h3>
                        <div class="admin-table-container" id="aiProfessorsTable">
                            <p>Cargando profesores IA...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
        
        // Add event listeners
        adminPanel.querySelector('.admin-logout-btn').addEventListener('click', adminLogout);
        
        const tabButtons = adminPanel.querySelectorAll('.admin-tab');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding tab content
                const tabId = this.getAttribute('data-tab');
                const tabPanes = adminPanel.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === `tab-${tabId}`) {
                        pane.classList.add('active');
                    }
                });
                
                // Load tab content
                loadAdminTabContent(tabId);
            });
        });
    }
    
    // Show the panel
    adminPanel.style.display = 'block';
    
    // Load default tab content
    loadAdminTabContent('registrations');
}

// Load content for admin tabs
async function loadAdminTabContent(tabId) {
    let contentHtml = '';
    
    switch (tabId) {
        case 'registrations':
            contentHtml = await loadRegistrationsTable();
            break;
        case 'courses':
            contentHtml = await loadCoursesTable();
            break;
        case 'users':
            contentHtml = await loadUsersTable();
            break;
        case 'analytics':
            contentHtml = await loadAnalyticsTable();
            break;
        case 'ai-professors':
            contentHtml = await loadAIProfessorsTable();
            break;
        default:
            contentHtml = '<p>Contenido no disponible</p>';
    }
    
    const tabPane = document.getElementById(`tab-${tabId}`);
    if (tabPane) {
        tabPane.innerHTML = contentHtml;
    }
}

// Load registrations table
async function loadRegistrationsTable() {
    try {
        // Get registrations from Firestore
        const registrationsSnapshot = await db.collection('registrations').orderBy('timestamp', 'desc').get();
        
        if (registrationsSnapshot.empty) {
            return '<p>No hay registros disponibles</p>';
        }
        
        let rowsHtml = '';
        registrationsSnapshot.forEach(doc => {
            const data = doc.data();
            const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'N/A';
            
            rowsHtml += `
                <tr>
                    <td>${data.name || 'N/A'}</td>
                    <td>${data.email || 'N/A'}</td>
                    <td>${data.phone || 'N/A'}</td>
                    <td>${data.course || 'N/A'}</td>
                    <td>${timestamp}</td>
                    <td>
                        <span class="status-badge status-${data.status || 'pending'}">
                            ${data.status || 'pending'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-view" data-id="${doc.id}">Ver</button>
                        ${data.status !== 'completed' ? `
                        <button class="btn btn-sm btn-complete" data-id="${doc.id}">Completar</button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });
        
        return `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Curso</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error loading registrations:', error);
        return `<p class="error">Error cargando registros: ${error.message}</p>`;
    }
}

// Load courses table
async function loadCoursesTable() {
    try {
        // For now, we'll show static course data
        // In a real app, this would come from Firestore
        const courses = [
            { id: 'completo', name: 'Curso Completo', price: 360000, duration: '3 meses', students: 142 },
            { id: 'intensivo', name: 'Curso Intensivo', price: 272000, duration: '6 semanas', students: 89 },
            { id: 'virtual', name: 'Curso Virtual', price: 280000, duration: '6 meses', students: 203 }
        ];
        
        let rowsHtml = '';
        courses.forEach(course => {
            rowsHtml += `
                <tr>
                    <td>${course.name}</td>
                    <td>$${course.price.toLocaleString()}</td>
                    <td>${course.duration}</td>
                    <td>${course.students}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" data-id="${course.id}">Editar</button>
                        <button class="btn btn-sm btn-delete" data-id="${course.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        return `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Curso</th>
                            <th>Precio</th>
                            <th>Duración</th>
                            <th>Estudiantes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error loading courses:', error);
        return `<p class="error">Error cargando cursos: ${error.message}</p>`;
    }
}

// Load users table
async function loadUsersTable() {
    try {
        // For now, we'll show placeholder data
        // In a real app, this would come from Firebase Auth or Firestore users collection
        return `
            <div class="admin-table-wrapper">
                <p>Funcionalidad de gestión de usuarios en desarrollo.</p>
                <p>En una implementación completa, esta sección mostraría:</p>
                <ul>
                    <li>Lista de todos los usuarios registrados</li>
                    <li>Roles y permisos</li>
                    <li>Historial de actividad</li>
                    <li>Opciones para activar/desactivar cuentas</li>
                </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error loading users:', error);
        return `<p class="error">Error cargando usuarios: ${error.message}</p>`;
    }
}

// Load analytics table
async function loadAnalyticsTable() {
    try {
        // Get some basic analytics from Firestore
        const registrationsSnapshot = await db.collection('registrations').get();
        
        // Calculate stats
        const totalRegistrations = registrationsSnapshot.size;
        let completados = 0;
        let pendientes = 0;
        
        registrationsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'completed') completados++;
            if (data.status === 'pending') pendientes++;
        });
        
        // Course distribution
        const courseCounts = {};
        registrationsSnapshot.forEach(doc => {
            const course = doc.data().course || 'unknown';
            courseCounts[course] = (courseCounts[course] || 0) + 1;
        });
        
        let courseRowsHtml = '';
        for (const [course, count] of Object.entries(courseCounts)) {
            courseRowsHtml += `
                <tr>
                    <td>${course}</td>
                    <td>${count}</td>
                    <td>${((count / totalRegistrations) * 100).toFixed(1)}%</td>
                </tr>
            `;
        }
        
        return `
            <div class="admin-table-wrapper">
                <div class="admin-stats-cards">
                    <div class="stat-card">
                        <h3>Total Registros</h3>
                        <p class="stat-number">${totalRegistrations}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Completados</h3>
                        <p class="stat-number">${completados}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Pendientes</h3>
                        <p class="stat-number">${pendientes}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Tasa Conversión</h3>
                        <p class="stat-number">${totalRegistrations > 0 ? ((completados / totalRegistrations) * 100).toFixed(1) : 0}%</p>
                    </div>
                </div>
                
                <h3>Distribución por Curso</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Curso</th>
                            <th>Registros</th>
                            <th>Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${courseRowsHtml}
                    </tbody>
                </table>
                
                <div class.admin-note">
                    <p><small>Nota: Estas analíticas se actualizan en tiempo real desde Firestore.</small></p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading analytics:', error);
        return `<p class="error">Error cargando analíticas: ${error.message}</p>`;
    }
}

// Load AI professors table
async function loadAIProfessorsTable() {
    try {
        // Show AI professor status
        const professorsHtml = Object.entries(subjects).map(([key, subject]) => {
            return `
                <tr>
                    <td>${subject.avatar} ${subject.name}</td>
                    <td>${subject.description}</td>
                    <td>
                        <span class="status-badge status-active">Activo</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-view" data-id="${key}">Configurar</button>
                        <button class="btn btn-sm btn-test" data-id="${key}">Probar</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        return `
            <div class="admin-table-wrapper">
                <h3>Estado de Profesores IA</h3>
                <p>Los profesores IA están disponibles 24/7 para asistir a los estudiantes en todas las materias.</p>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Asignatura</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${professorsHtml}
                    </tbody>
                </table>
                
                <div class="admin-note">
                    <p><small>Los profesores IA utilizan procesamiento de lenguaje natural avanzado para proporcionar explicaciones detalladas y adaptadas al nivel de cada estudiante.</small></p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading AI professors:', error);
        return `<p class="error">Error cargando profesores IA: ${error.message}</p>`;
    }
}

// Initialize admin auth when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initAdminAuth();
});

// Export functions for global use
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.initAdminAuth = initAdminAuth;