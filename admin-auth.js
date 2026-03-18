import { db } from "./firebase-config.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const adminTriggerBtn = document.getElementById('admin-trigger-btn');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminError = document.getElementById('admin-error');
    
    const adminDashboard = document.getElementById('admin-dashboard');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const tableBody = document.getElementById('registrations-tbody');
    
    // Stats Elements
    const statTotal = document.getElementById('stat-total');
    const statCompleto = document.getElementById('stat-completo');
    const statIntensivo = document.getElementById('stat-intensivo');

    const VALID_PASSWORDS = ['VetPrep2026!SecureAdmin', 'Espartano300$'];
    let unsubscribeSnapshot = null;

    // Toggle Admin Login Modal
    if(adminTriggerBtn) {
        adminTriggerBtn.addEventListener('click', () => {
            adminModal.classList.remove('hidden');
            adminPasswordInput.value = '';
            adminError.classList.add('hidden');
            setTimeout(() => adminPasswordInput.focus(), 100);
        });
    }

    if(closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.add('hidden');
        });
    }

    // Handle Login Submit
    if(adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pwd = adminPasswordInput.value;
            
            if (VALID_PASSWORDS.includes(pwd)) {
                // Success
                adminModal.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // prevent app background scroll
                loadDashboardData();
            } else {
                // Error
                adminError.classList.remove('hidden');
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        });
    }

    // Handle Logout
    if(adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            adminDashboard.classList.add('hidden');
            document.body.style.overflow = ''; // restore scrolling
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }
        });
    }

    // Load Data from Firestore (Real-time listener)
    function loadDashboardData() {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                    <i class="fa-solid fa-spinner fa-spin text-3xl mb-3 text-emerald-400"></i>
                    <p class="font-medium">Cargando registros desde Firestore...</p>
                </td>
            </tr>
        `;

        const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
        
        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            let total = 0;
            let completoCount = 0;
            let intensivoCount = 0;
            
            if (snapshot.empty) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-400 font-medium">
                            <div class="mb-3 text-gray-300 text-4xl"><i class="fa-solid fa-folder-open"></i></div>
                            Aún no hay inscripciones registradas.
                        </td>
                    </tr>
                `;
                statTotal.textContent = "0";
                statCompleto.textContent = "0";
                statIntensivo.textContent = "0";
                return;
            }

            tableBody.innerHTML = ''; // Clear loading/empty state
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                total++;
                
                // Parse date safely
                let dateStr = 'Fecha desconocida';
                if (data.createdAt) {
                    const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    if(!isNaN(dateObj)) {
                        dateStr = new Intl.DateTimeFormat('es-CO', { 
                            year: 'numeric', month: 'short', day: 'numeric', 
                            hour: '2-digit', minute: '2-digit' 
                        }).format(dateObj);
                    }
                }

                // Count stats by plan name
                const planLower = (data.plan || '').toLowerCase();
                let planBadge = '';
                
                if (planLower.includes('completo')) {
                    completoCount++;
                    planBadge = '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100/80 text-blue-800 border border-blue-200">Completo</span>';
                } else if (planLower.includes('intensivo')) {
                    intensivoCount++;
                    planBadge = '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100/80 text-orange-800 border border-orange-200">Intensivo</span>';
                } else {
                    planBadge = `<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">${data.plan || 'No especificado'}</span>`;
                }

                // Format currency
                const montoStr = data.monto 
                    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(data.monto) 
                    : '<span class="text-gray-400">N/A</span>';

                const tr = document.createElement('tr');
                tr.className = "hover:bg-gray-50 transition-colors";
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-gray-500 font-medium font-mono text-xs">
                        ${dateStr}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-bold text-gray-900">${data.nombre || 'Desconocido'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                        ${data.email || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${planBadge}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-800">
                        ${montoStr}
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            // Update stats
            statTotal.textContent = total;
            statCompleto.textContent = completoCount;
            statIntensivo.textContent = intensivoCount;
            
            // Pulse animation on connection badge
            const statusPulse = document.querySelector('#connection-status span');
            if(statusPulse) {
                statusPulse.classList.remove('bg-green-500');
                void statusPulse.offsetWidth; // Reflow
                statusPulse.classList.add('bg-green-500');
            }
        }, (error) => {
            console.error("Firestore onSnapshot error:", error);
            if (error.code === 'permission-denied') {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-red-500 font-medium bg-red-50/50">
                            <i class="fa-solid fa-triangle-exclamation text-3xl mb-3"></i>
                            <p>Acceso denegado a Firestore. <br>Por favor verifica las reglas de seguridad de la base de datos.</p>
                        </td>
                    </tr>
                `;
            }
        });
    }
});