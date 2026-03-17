// Student Authentication System
const STUDENT_CREDENTIALS = [
    { email: 'becario1@vetprepudea.com', password: 'BECA2024-001', name: 'Estudiante Beca 1', code: 'BECA100-001' },
    { email: 'becario2@vetprepudea.com', password: 'BECA2024-002', name: 'Estudiante Beca 2', code: 'BECA100-002' },
    { email: 'becario3@vetprepudea.com', password: 'BECA2024-003', name: 'Estudiante Beca 3', code: 'BECA100-003' },
    { email: 'becario4@vetprepudea.com', password: 'BECA2024-004', name: 'Estudiante Beca 4', code: 'BECA100-004' },
    { email: 'becario5@vetprepudea.com', password: 'BECA2024-005', name: 'Estudiante Beca 5', code: 'BECA100-005' }
];

const PROMO_CODES = {
    'BECA100-001': { discount: 100, type: 'beca', studentName: 'Becario 1' },
    'BECA100-002': { discount: 100, type: 'beca', studentName: 'Becario 2' },
    'BECA100-003': { discount: 100, type: 'beca', studentName: 'Becario 3' },
    'BECA100-004': { discount: 100, type: 'beca', studentName: 'Becario 4' },
    'BECA100-005': { discount: 100, type: 'beca', studentName: 'Becario 5' }
};

let currentStudent = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let quizAnswers = {};

function showStudentLoginModal() {
    document.getElementById('studentLoginModal').classList.add('active');
    switchStudentAuth('login');
}

function closeStudentLoginModal() {
    document.getElementById('studentLoginModal').classList.remove('active');
    document.getElementById('studentAuthMessage').textContent = '';
}

function switchStudentAuth(tab) {
    const loginForm = document.getElementById('studentLoginForm');
    const registerForm = document.getElementById('studentRegisterForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

function studentLogin() {
    const email = document.getElementById('studentEmail').value.trim();
    const password = document.getElementById('studentPassword').value;
    const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
    const messageDiv = document.getElementById('studentAuthMessage');
    
    if (!email || !password) {
        messageDiv.textContent = 'Por favor completa todos los campos';
        messageDiv.className = 'error';
        return;
    }
    
    const student = STUDENT_CREDENTIALS.find(s => s.email === email && s.password === password);
    
    if (student) {
        currentStudent = {
            name: student.name,
            email: student.email,
            promoCode: student.code,
            isBecado: true,
            progress: loadProgress(student.email)
        };
        
        localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
        closeStudentLoginModal();
        openStudentDashboard();
    } else {
        messageDiv.textContent = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        messageDiv.className = 'error';
    }
}

async function studentRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const promoCode = document.getElementById('regPromoCode').value.trim().toUpperCase();
    const messageDiv = document.getElementById('studentAuthMessage');
    
    if (!name || !email || !password) {
        messageDiv.textContent = 'Por favor completa todos los campos obligatorios';
        messageDiv.className = 'error';
        return;
    }
    
    let isBecado = false;
    let studentName = name;
    
    if (promoCode && PROMO_CODES[promoCode]) {
        const promo = PROMO_CODES[promoCode];
        if (promo.discount === 100) {
            isBecado = true;
            studentName = promo.studentName || name;
        }
    }
    
    currentStudent = {
        name: studentName,
        email: email,
        promoCode: isBecado ? promoCode : null,
        isBecado: isBecado,
        progress: {},
        registrationDate: new Date().toISOString()
    };

    try {
        // Save to Firestore
        await db.collection('students').doc(email).set(currentStudent);
        console.log("Student saved to Firestore");
    } catch (error) {
        console.error("Error saving student to Firestore:", error);
    }
    
    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    closeStudentLoginModal();
    openStudentDashboard();
}

function playVideo(url) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    if (modal && player) {
        player.src = url;
        modal.classList.add('active');
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    if (modal && player) {
        player.src = '';
        modal.classList.remove('active');
    }
}

function studentLogout() {
    currentStudent = null;
    localStorage.removeItem('currentStudent');
    document.getElementById('studentDashboard').classList.remove('active');
}

function openStudentDashboard() {
    const dashboard = document.getElementById('studentDashboard');
    document.getElementById('studentName').textContent = currentStudent.name;
    
    const badge = document.getElementById('studentBadge');
    if (currentStudent.isBecado) {
        badge.textContent = '🎓 BECA 100% ACTIVA';
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
    
    updateProgress();
    dashboard.classList.add('active');
}

function checkExistingSession() {
    const saved = localStorage.getItem('currentStudent');
    if (saved) {
        currentStudent = JSON.parse(saved);
        currentStudent.progress = loadProgress(currentStudent.email);
        openStudentDashboard();
    }
}

function loadProgress(email) {
    const saved = localStorage.getItem('progress_' + email);
    return saved ? JSON.parse(saved) : {};
}

function saveProgress(email, progress) {
    localStorage.setItem('progress_' + email, JSON.stringify(progress));
}

function updateProgress() {
    const progress = currentStudent.progress || {};
    const totalModules = 5;
    let completedModules = 0;
    
    Object.keys(progress).forEach(key => {
        if (progress[key] && progress[key].completed) {
            completedModules++;
        }
    });
    
    const percentage = Math.round((completedModules / totalModules) * 100);
    document.getElementById('generalProgress').textContent = percentage + '%';
    document.getElementById('progressFill').style.width = percentage + '%';
}

function showDashboardTab(tabId) {
    const panes = document.querySelectorAll('.dash-pane');
    const tabs = document.querySelectorAll('.dash-tab');
    
    panes.forEach(p => p.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function showModuleContent(moduleId) {
    const moduleTabs = {
        'biologia': 'videos',
        'quimica': 'videos',
        'fisica': 'videos',
        'matematicas': 'videos',
        'razonamiento': 'videos'
    };
    
    const tab = moduleTabs[moduleId];
    if (tab) {
        document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.dash-pane').forEach(p => p.classList.remove('active'));
        
        document.getElementById(tab).classList.add('active');
        document.querySelector(`[onclick="showDashboardTab('${tab}')"]`).classList.add('active');
    }
}

// ============================================
// QUIZ DATA - Preguntas tipo examen UdeA
// ============================================

const QUIZ_DATA = {
    biologia: [
        { question: '¿Cuál es la unidad básica de la vida?', options: ['El átomo', 'La célula', 'El tejido', 'El órgano'], correct: 1 },
        { question: '¿Qué organelo es responsable de la fotosíntesis?', options: ['Mitocondria', 'Cloroplasto', 'Ribosoma', 'Núcleo'], correct: 1 },
        { question: '¿Cuántas cadenas tiene el ADN?', options: ['1', '2', '3', '4'], correct: 1 },
        { question: '¿Qué tipo de célula tiene núcleo definido?', options: ['Procariota', 'Eucariota', 'Bacteria', 'Virus'], correct: 1 },
        { question: 'La mitosis produce:', options: ['2 células haploides', '2 células diploides', '4 células haploides', '4 células diploides'], correct: 1 },
        { question: '¿Qué son los lisosomas?', options: ['Contienen ADN', 'Contienen enzimas digestivas', 'Producen energía', 'Sintetizan proteínas'], correct: 1 },
        { question: 'El ciclo de Krebs ocurre en:', options: ['Núcleo', 'Citoplasma', 'Mitocondria', 'Ribosoma'], correct: 2 },
        { question: '¿Qué tipo de reproducción produce offspring idénticos?', options: ['Sexual', 'Asexual', 'Meiosis', 'Gametos'], correct: 1 },
        { question: 'Los glóbulos rojos se producen en:', options: ['Médula ósea', 'Hígado', 'Riñón', 'Bazo'], correct: 0 },
        { question: '¿Qué es la homeostasis?', options: ['Reproducción', 'Equilibrio interno', 'Crecimiento', 'Metabolismo'], correct: 1 }
    ],
    quimica: [
        { question: '¿Cuál es el símbolo del carbono?', options: ['Ca', 'C', 'Co', 'Cr'], correct: 1 },
        { question: '¿Cuántos electrones tiene el oxígeno en su capa de valencia?', options: ['4', '6', '2', '8'], correct: 1 },
        { question: '¿Qué tipo de enlace une a los átomos en una molécula de agua?', options: ['Iónico', 'Covalente', 'Metálico', 'Hidrógeno'], correct: 1 },
        { question: 'El pH neutro es:', options: ['0', '7', '14', '10'], correct: 1 },
        { question: '¿Qué organelo contiene enzimas digestivas?', options: ['Lisosoma', 'Ribosoma', 'Mitocondria', 'Cloroplasto'], correct: 0 },
        { question: 'Un ácido tiene pH:', options: ['Mayor a 7', 'Igual a 7', 'Menor a 7', 'Variable'], correct: 2 },
        { question: '¿Qué elemento tiene número atómico 6?', options: ['Nitrógeno', 'Carbono', 'Oxígeno', 'Boro'], correct: 1 },
        { question: 'Los isótopos difieren en:', options: ['Protones', 'Electrones', 'Neutrones', 'Valencia'], correct: 2 },
        { question: '¿Qué gas produce la fotosíntesis?', options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'], correct: 0 },
        { question: 'Una base tiene pH:', options: ['Menor a 7', 'Igual a 7', 'Mayor a 7', 'Cero'], correct: 2 }
    ],
    fisica: [
        { question: '¿Cuál es la primera ley de Newton?', options: ['F = ma', 'Todo cuerpo mantiene su estado', 'Acción y reacción', 'E = mc²'], correct: 1 },
        { question: '¿Qué es la velocidad?', options: ['Distancia/tiempo', 'Fuerza/masa', 'Trabajo/tiempo', 'Masa/volumen'], correct: 0 },
        { question: 'La energía cinética depende de:', options: ['Masa y velocidad', 'Solo masa', 'Solo velocidad', 'Temperatura'], correct: 0 },
        { question: '¿Qué mide el voltaje?', options: ['Corriente', 'Resistencia', 'Diferencia de potencial', 'Potencia'], correct: 2 },
        { question: 'Unidades de fuerza en el SI:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correct: 2 },
        { question: 'La aceleración se mide en:', options: ['m/s', 'm/s²', 'N', 'J'], correct: 1 },
        { question: '¿Qué es la gravedad?', options: ['Una fuerza', 'Una energía', 'Una masa', 'Un tiempo'], correct: 0 },
        { question: 'El trabajo se calcula como:', options: ['F × d', 'm × a', 'P × t', 'V × I'], correct: 0 },
        { question: '¿Qué es un vector?', options: ['Número solo', 'Magnitud y dirección', 'Solo dirección', 'Sin unidades'], correct: 1 },
        { question: 'La presión se define como:', options: ['Fuerza/Área', 'Mass/Volumen', 'Trabajo/Tiempo', 'Potencia/Voltaje'], correct: 0 }
    ],
    matematicas: [
        { question: '¿Cuánto es 15% de 200?', options: ['25', '30', '35', '40'], correct: 1 },
        { question: 'Si x + 5 = 12, ¿cuánto vale x?', options: ['5', '7', '12', '17'], correct: 1 },
        { question: '¿Cuál es el área de un círculo de radio 3?', options: ['6π', '9π', '12π', '3π'], correct: 1 },
        { question: '√144 = ?', options: ['10', '11', '12', '13'], correct: 2 },
        { question: '¿Cuánto es 2³?', options: ['6', '8', '9', '12'], correct: 1 },
        { question: 'El 20% de 150 es:', options: ['25', '30', '35', '40'], correct: 1 },
        { question: 'Si 3x = 21, entonces x = ?', options: ['5', '6', '7', '8'], correct: 2 },
        { question: '¿Cuánto es 1/2 + 1/4?', options: ['1/4', '1/2', '3/4', '1'], correct: 2 },
        { question: 'El perímetro de un cuadrado de lado 4 es:', options: ['8', '12', '16', '20'], correct: 2 },
        { question: '¿Qué porcentaje es 25 de 200?', options: ['10%', '12.5%', '15%', '20%'], correct: 1 }
    ],
    razonamiento: [
        { question: 'Complete: soles es a día como luna es a...', options: ['noche', 'estrellas', 'cielo', 'astro'], correct: 0 },
        { question: '¿Qué número sigue: 2, 4, 8, 16, ...?', options: ['24', '32', '30', '28'], correct: 1 },
        { question: 'Si todos los A son B, y todos los B son C, entonces:', options: ['Algunos A son C', 'Todos los A son C', 'Ningún A es C', 'Falta información'], correct: 1 },
        { question: '¿Cuál es el sinónimo de ABUNDAR?', options: ['Faltar', 'Sobrar', 'Escasear', 'Necesitar'], correct: 1 },
        { question: 'Determine: mano es a escribir como ojo es a...', options: ['ver', 'parpadear', 'lagrimear', 'cerrar'], correct: 0 },
        { question: 'Si el ayer de mañana es jueves, ¿qué día es hoy?', options: ['Martes', 'Miércoles', 'Jueves', 'Viernes'], correct: 1 },
        { question: '¿Qué palabra no pertenece: perro/gato/ave/mesa?', options: ['perro', 'gato', 'ave', 'mesa'], correct: 3 },
        { question: 'Complete: 1, 1, 2, 3, 5, 8, ...', options: ['10', '11', '12', '13'], correct: 3 },
        { question: 'Determine el antonimo de SÓLIDO:', options: ['Firme', 'Duro', 'Líquido', 'Resistente'], correct: 2 },
        { question: 'Si A = 1, B = 2, ..., ¿cuánto vale CABALLO?', options: ['20', '21', '22', '23'], correct: 2 }
    ],
    simulacro: [
        { question: 'La célula es la unidad básica de:', options: ['La materia', 'La vida', 'El átomo', 'La energía'], correct: 1 },
        { question: 'El agua está formada por:', options: ['Hidrógeno y oxígeno', 'Oxígeno y nitrógeno', 'Carbono e hidrógeno', 'Sodio y cloro'], correct: 0 },
        { question: '¿Cuál es la capital de Colombia?', options: ['Cali', 'Medellín', 'Bogotá', 'Barranquilla'], correct: 2 },
        { question: 'La raíz cuadrada de 81 es:', options: ['7', '8', '9', '10'], correct: 2 },
        { question: '¿Qué gas respiramos?', options: ['Nitrógeno', 'Oxígeno', 'Dióxido de carbono', 'Hidrógeno'], correct: 1 },
        { question: '¿Cuánto es 10% de 500?', options: ['40', '50', '60', '70'], correct: 1 },
        { question: 'El órgano más grande del cuerpo humano es:', options: ['Hígado', 'Piel', 'Intestino', 'Pulmón'], correct: 1 },
        { question: '¿Qué planeta es el más cercano al sol?', options: ['Venus', 'Marte', 'Mercurio', 'Júpiter'], correct: 2 },
        { question: 'El resultado de 5 × 12 es:', options: ['55', '60', '65', '70'], correct: 1 },
        { question: '¿Qué tipo de animal es el delfín?', options: ['Pez', 'Reptil', 'Mamífero', 'Anfibio'], correct: 2 },
        { question: '¿Cuál es el metal más abundante en la Tierra?', options: ['Hierro', 'Aluminio', 'Cobre', 'Oro'], correct: 1 },
        { question: 'La segunda ley de Newton se expresa como:', options: ['F = mv', 'F = m/a', 'F = ma', 'F = m + a'], correct: 2 },
        { question: '¿Cuántos días tiene un año bisiesto?', options: ['364', '365', '366', '367'], correct: 2 },
        { question: 'El cerebro pertenece al sistema:', options: ['Respiratorio', 'Digestivo', 'Nervioso', 'Circulatorio'], correct: 2 },
        { question: '¿Qué significa "HTTP"?', options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transit Process', 'High Text Transfer Protocol'], correct: 0 },
        { question: 'La mitosis produce células:', options: ['Haploides', 'Diploides', 'Triploides', 'Anormales'], correct: 1 },
        { question: '¿Cuál es el continente más grande?', options: ['África', 'América', 'Asia', 'Europa'], correct: 2 },
        { question: 'El sonido se propaga en:', options: ['Vacío', 'Sólidos solo', 'Sólidos, líquidos y gases', 'Líquidos solo'], correct: 2 },
        { question: '¿Qué vitamina produce el sol en la piel?', options: ['A', 'B', 'C', 'D'], correct: 3 },
        { question: 'El resultado de 100 ÷ 4 es:', options: ['20', '25', '30', '35'], correct: 1 }
    ]
};

// ============================================
// WORKSHOP DATA - Talleres Prácticos
// ============================================

const WORKSHOP_DATA = {
    biologia_celular: {
        title: 'Taller de Biología Celular',
        description: 'Ejercicios prácticos sobre célula, organelos y procesos biológicos',
        exercises: [
            {
                question: 'Dibuja una célula animal y etiqueta sus partes principales: membrana celular, núcleo, citoplasma, mitocondria.',
                type: 'drawing'
            },
            {
                question: 'Completa la tabla comparativa entre células procariotas y eucariotas:',
                type: 'table',
                template: `
                    <table class="workshop-table">
                        <tr><th>Característica</th><th>Procariota</th><th>Eucariota</th></tr>
                        <tr><td>Núcleo</td><td>__________</td><td>__________</td></tr>
                        <tr><td>Tamaño</td><td>__________</td><td>__________</td></tr>
                        <tr><td>Organelos</td><td>__________</td><td>__________</td></tr>
                        <tr><td>Ejemplos</td><td>__________</td><td>__________</td></tr>
                    </table>
                `
            },
            {
                question: 'Explica con tus propias palabras qué es la mitosis y cuáles son sus fases.',
                type: 'text'
            }
        ]
    },
    genetica: {
        title: 'Taller de Genética',
        description: 'Problemas de herencia genética y árboles genealógicos',
        exercises: [
            {
                question: 'Problema 1: En cierta especie, el color de ojos marrón (M) es dominante sobre el azul (m). Si un progenitor heterocigoto se cruza con uno de ojos azules, ¿cuál es la probabilidad de un hijo de ojos azules?',
                type: 'problem',
                answer: '50% (1/2)'
            },
            {
                question: 'Problema 2: El grupo sanguíneo ABO está determinado por tres alelos: IA, IB, i. IA e IB son codominantes, y i es recesivo. Un padre con grupo A (IAi) se cruza con una madre con grupo B (IBi). ¿Qué grupos sanguíneos pueden tener los hijos?',
                type: 'problem',
                answer: 'A, B, AB u O (todos son posibles)'
            },
            {
                question: 'Dibuja el árbol genealógico de una familia donde el padre tiene una enfermedad recesiva y la madre es portadora sana. Indica los genotipos de cada miembro.',
                type: 'drawing'
            },
            {
                question: 'Explica la diferencia entre genotipo y fenotipo con un ejemplo.',
                type: 'text'
            }
        ]
    },
    quimica: {
        title: 'Taller de Reacciones Químicas',
        description: 'Balanceo de ecuaciones y reacciones orgánicas',
        exercises: [
            {
                question: 'Balancea la siguiente ecuación: H₂ + O₂ → H₂O',
                type: 'problem',
                answer: '2H₂ + O₂ → 2H₂O'
            },
            {
                question: 'Balancea: Fe + O₂ → Fe₂O₃',
                type: 'problem',
                answer: '4Fe + 3O₂ → 2Fe₂O₃'
            },
            {
                question: 'Balancea: C₃H₈ + O₂ → CO₂ + H₂O',
                type: 'problem',
                answer: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O'
            },
            {
                question: 'Identifica los tipos de reacción: a) Combustión, b) Síntesis, c) Descomposición, d) Sustitución simple',
                type: 'match',
                pairs: ['A + B → AB', 'AB → A + B', 'A + BC → AC + B', 'CxHy + O₂ → CO₂ + H₂O']
            }
        ]
    },
    matematicas: {
        title: 'Taller de Razonamiento Matemático',
        description: 'Problemas de proporcionalidad, porcentajes y probabilidades',
        exercises: [
            {
                question: 'Si 5 trabajadores construyen una pared en 8 días, ¿cuántos días tardarán 10 trabajadores en construir la misma pared?',
                type: 'problem',
                answer: '4 días (es inversamente proporcional)'
            },
            {
                question: 'Un artículo que cuesta $100.000 tiene un descuento del 25% y luego un aumento del 20%. ¿Cuál es el precio final?',
                type: 'problem',
                answer: '$90.000 ($100.000 - 25% = $75.000, luego +20% = $90.000)'
            },
            {
                question: 'En una urna hay 3 bolas rojas y 7 bolas azules. ¿Cuál es la probabilidad de extraer una bola roja?',
                type: 'problem',
                answer: '3/10 = 30%'
            },
            {
                question: 'Resolver: 2(x + 3) - 4 = 10',
                type: 'problem',
                answer: 'x = 4'
            },
            {
                question: 'Calcular el área de un triángulo con base 8 cm y altura 5 cm.',
                type: 'problem',
                answer: '20 cm² (A = (b×h)/2 = (8×5)/2 = 20)'
            }
        ]
    },
    fisica: {
        title: 'Taller de Física Aplicada',
        description: 'Problemas de mecánica y termodinámica',
        exercises: [
            {
                question: 'Un carro acelera de 0 a 20 m/s en 10 segundos. ¿Cuál es la aceleración?',
                type: 'problem',
                answer: 'a = Δv/Δt = 20/10 = 2 m/s²'
            },
            {
                question: 'Calcular la energía cinética de una pelota de 2 kg que se mueve a 10 m/s.',
                type: 'problem',
                answer: 'EC = ½mv² = ½ × 2 × 100 = 100 J'
            },
            {
                question: 'Un objeto de 5 kg cae desde 20 m de altura. ¿Cuál es su energía potencial en el punto más alto?',
                type: 'problem',
                answer: 'EP = mgh = 5 × 10 × 20 = 1000 J'
            },
            {
                question: 'Convertir 90°F a grados Celsius:',
                type: 'problem',
                answer: '°C = (°F - 32) × 5/9 = (90 - 32) × 5/9 = 32.2°C'
            }
        ]
    }
};

// ============================================
// VIDEO RESOURCES - Videos Educativos
// ============================================

const VIDEO_RESOURCES = {
    biologia: [
        { title: 'Introducción a la Célula', duration: '45 min', url: 'https://www.youtube.com/watch?v=URiXo-gD6M8' },
        { title: 'Estructura y Función del ADN', duration: '50 min', url: 'https://www.youtube.com/watch?v=8k_2yGf7aF0' },
        { title: 'Mitosis y Meiosis', duration: '55 min', url: 'https://www.youtube.com/watch?v=4jT1vT0QwY8' },
        { title: 'Genética Básica', duration: '60 min', url: 'https://www.youtube.com/watch?v=8y1S6K6x4w0' },
        { title: 'Sistema Nervioso', duration: '45 min', url: 'https://www.youtube.com/watch?v=2Y7T0X8q3m0' }
    ],
    quimica: [
        { title: 'Tabla Periódica', duration: '50 min', url: 'https://www.youtube.com/watch?v=9tRkCdT6qXw' },
        { title: 'Enlace Químico', duration: '55 min', url: 'https://www.youtube.com/watch?v=5y1S7K8x4m0' },
        { title: 'Química Orgánica', duration: '60 min', url: 'https://www.youtube.com/watch?v=4t2Y8q6x7w0' },
        { title: 'Reacciones Químicas', duration: '45 min', url: 'https://www.youtube.com/watch?v=7t3Y9q8x5m0' }
    ],
    fisica: [
        { title: 'Leyes de Newton', duration: '65 min', url: 'https://www.youtube.com/watch?v=8y2T1X0q4w0' },
        { title: 'Trabajo y Energía', duration: '55 min', url: 'https://www.youtube.com/watch?v=5t3Y8q7x4m0' },
        { title: 'Termodinámica', duration: '60 min', url: 'https://www.youtube.com/watch?v=6t4Y9r8x5w0' },
        { title: 'Electromagnetismo', duration: '70 min', url: 'https://www.youtube.com/watch?v=7t5Y9q8x6m0' }
    ],
    matematicas: [
        { title: 'Álgebra Básica', duration: '60 min', url: 'https://www.youtube.com/watch?v=8t6Y1X0q5w0' },
        { title: 'Ecuaciones Lineales', duration: '45 min', url: 'https://www.youtube.com/watch?v=9t7Y2q1r6m0' },
        { title: 'Porcentajes y Proporciones', duration: '50 min', url: 'https://www.youtube.com/watch?v=1t8Y3q2s7m0' },
        { title: 'Geometría Básica', duration: '55 min', url: 'https://www.youtube.com/watch?v=2t9Y4r3s8m0' }
    ],
    razonamiento: [
        { title: 'Razonamiento Lógico', duration: '60 min', url: 'https://www.youtube.com/watch?v=3t1Y5r4t9m0' },
        { title: 'Razonamiento Verbal', duration: '55 min', url: 'https://www.youtube.com/watch?v=4t2Y6r5u0m0' },
        { title: 'Sucesiones Numéricas', duration: '45 min', url: 'https://www.youtube.com/watch?v=5t3Y7r6v1m0' }
    ]
};

// ============================================
// DOCUMENT RESOURCES - Documentos/PDFs
// ============================================

const DOCUMENT_RESOURCES = [
    { title: 'Manual de Biología UdeA', description: 'Guía completa de biología para el examen', pages: 120 },
    { title: 'Compendio de Química', description: 'Todo lo que necesitas saber de química', pages: 95 },
    { title: 'Formulario de Física', description: 'Fórmulas y conceptos clave', pages: 45 },
    { title: 'Guía de Razonamiento Lógico', description: 'Estrategias y ejercicios resueltos', pages: 80 },
    { title: 'Simulacro UdeA 2024', description: 'Práctica completa con respuestas', pages: 25 },
    { title: 'Temario Oficial UdeA', description: 'Todos los temas del examen', pages: 60 }
];

// ============================================
// QUIZ FUNCTIONS
// ============================================

function startQuiz(subject) {
    currentQuiz = QUIZ_DATA[subject] || [];
    currentQuestionIndex = 0;
    quizAnswers = {};
    
    const subjectNames = {
        biologia: 'Biología',
        quimica: 'Química',
        fisica: 'Física',
        matematicas: 'Matemáticas',
        razonamiento: 'Razonamiento Lógico',
        simulacro: 'Simulacro Completo'
    };
    
    document.getElementById('quizTitle').textContent = 'Quiz de ' + subjectNames[subject];
    document.getElementById('quizModal').classList.add('active');
    renderQuestion();
}

function renderQuestion() {
    const quiz = currentQuiz;
    const idx = currentQuestionIndex;
    const q = quiz[idx];
    
    document.getElementById('quizProgress').textContent = 'Pregunta ' + (idx + 1) + ' de ' + quiz.length;
    
    let optionsHtml = '';
    q.options.forEach((opt, i) => {
        const selected = quizAnswers[idx] === i ? 'selected' : '';
        optionsHtml += `<div class="quiz-option ${selected}" onclick="selectAnswer(${i})">${String.fromCharCode(65 + i)}) ${opt}</div>`;
    });
    
    document.getElementById('quizContent').innerHTML = `
        <div class="quiz-question">
            <h4>${idx + 1}. ${q.question}</h4>
            <div class="quiz-options">${optionsHtml}</div>
        </div>
    `;
    
    document.getElementById('prevBtn').style.display = idx === 0 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').textContent = idx === quiz.length - 1 ? 'Finalizar' : 'Siguiente';
}

function selectAnswer(optionIndex) {
    quizAnswers[currentQuestionIndex] = optionIndex;
    renderQuestion();
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    let correct = 0;
    currentQuiz.forEach((q, i) => {
        if (quizAnswers[i] === q.correct) {
            correct++;
        }
    });
    
    const score = Math.round((correct / currentQuiz.length) * 100);
    const subject = document.getElementById('quizTitle').textContent.replace('Quiz de ', '');
    
    alert('¡Quiz completado!\n\nPuntaje: ' + score + '%\nRespuestas correctas: ' + correct + '/' + currentQuiz.length + '\n\n' + getScoreMessage(score));
    
    if (currentStudent) {
        currentStudent.progress = currentStudent.progress || {};
        currentStudent.progress[subject.toLowerCase()] = {
            completed: true,
            score: score,
            date: new Date().toISOString()
        };
        saveProgress(currentStudent.email, currentStudent.progress);
        updateProgress();
    }
    
    closeQuiz();
}

function getScoreMessage(score) {
    if (score >= 90) return '¡Excelente! Has demostrado un dominio outstanding del tema.';
    if (score >= 70) return '¡Muy bien! Tienes un buen conocimiento del tema.';
    if (score >= 50) return 'Regular. Te recomiendo estudiar un poco más.';
    return 'Necesitas mejorar. Repasa el material y vuelve a intentarlo.';
}

function closeQuiz() {
    document.getElementById('quizModal').classList.remove('active');
    currentQuiz = [];
    currentQuestionIndex = 0;
    quizAnswers = {};
}

// ============================================
// WORKSHOP FUNCTIONS
// ============================================

function startWorkshop(workshopId) {
    const workshop = WORKSHOP_DATA[workshopId];
    if (!workshop) {
        alert('Taller no disponible');
        return;
    }
    
    let workshopContent = `<div class="workshop-container">
        <h2>${workshop.title}</h2>
        <p>${workshop.description}</p>
        <div class="exercises-list">`;
    
    workshop.exercises.forEach((ex, i) => {
        workshopContent += `
            <div class="exercise-item">
                <h4>Ejercicio ${i + 1}</h4>
                <p>${ex.question}</p>
                ${ex.type === 'problem' ? `<div class="exercise-answer"><strong>Respuesta:</strong> <span class="answer-reveal" onclick="this.textContent='${ex.answer}'; this.style.color='var(--primary)'">Click para ver respuesta</span></div>` : ''}
                ${ex.type === 'drawing' ? `<div class="exercise-drawing"><p>📝 En tu cuaderno</p></div>` : ''}
                ${ex.type === 'text' ? `<textarea placeholder="Escribe tu respuesta aquí..." rows="3"></textarea>` : ''}
                ${ex.template || ''}
            </div>
        `;
    });
    
    workshopContent += `</div></div>`;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'workshopModal';
    modal.innerHTML = `
        <div class="modal-content workshop-modal">
            <span class="modal-close" onclick="closeWorkshopModal()">&times;</span>
            ${workshopContent}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeWorkshopModal() {
    const modal = document.getElementById('workshopModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize on page load
window.onload = function() {
    checkExistingSession();
};
