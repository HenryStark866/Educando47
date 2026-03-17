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

function studentRegister() {
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
        progress: {}
    };

    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    closeStudentLoginModal();
    openStudentDashboard();
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

function startWorkshop(workshopId) {
    alert('Taller de ' + workshopId + ' iniciando... En una versión completa, aquí verás ejercicios prácticos.');
}

const QUIZ_DATA = {
    biologia: [
        { question: '¿Cuál es la unidad básica de la vida?', options: ['El átomo', 'La célula', 'El tejido', 'El órgano'], correct: 1 },
        { question: '¿Qué organelo es responsable de la fotosíntesis?', options: ['Mitocondria', 'Cloroplasto', 'Ribosoma', 'Núcleo'], correct: 1 },
        { question: '¿Cuántas cadenas tiene el ADN?', options: ['1', '2', '3', '4'], correct: 1 },
        { question: '¿Qué tipo de célula tiene núcleo definido?', options: ['Procariota', 'Eucariota', 'Bacteria', 'Virus'], correct: 1 },
        { question: 'La mitosis produce:', options: ['2 células haploides', '2 células diploides', '4 células haploides', '4 células diploides'], correct: 1 }
    ],
    quimica: [
        { question: '¿Cuál es el símbolo del carbono?', options: ['Ca', 'C', 'Co', 'Cr'], correct: 1 },
        { question: '¿Cuántos electrones tiene el oxígeno en su capa de valencia?', options: ['4', '6', '2', '8'], correct: 1 },
        { question: '¿Qué tipo de enlace une a los átomos en una molécula de agua?', options: ['Iónico', 'Covalente', 'Metálico', 'Hidrógeno'], correct: 1 },
        { question: 'El pH neutro es:', options: ['0', '7', '14', '10'], correct: 1 },
        { question: '¿Qué organelo contiene enzimas digestivas?', options: ['Lisosoma', 'Ribosoma', 'Mitocondria', 'Cloroplasto'], correct: 0 }
    ],
    fisica: [
        { question: '¿Cuál es la primera ley de Newton?', options: ['F = ma', 'Todo cuerpo mantiene su estado', 'Acción y reacción', 'E = mc²'], correct: 1 },
        { question: '¿Qué es la velocidad?', options: ['Distancia/tiempo', 'Fuerza/masa', 'Trabajo/tiempo', 'Masa/volumen'], correct: 0 },
        { question: 'La energía cinética depende de:', options: ['Masa y velocidad', 'Solo masa', 'Solo velocidad', 'Temperatura'], correct: 0 },
        { question: '¿Qué mide el voltaje?', options: ['Corriente', 'Resistencia', 'Diferencia de potencial', 'Potencia'], correct: 2 },
        { question: 'Unidades de fuerza en el SI:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correct: 2 }
    ],
    matematicas: [
        { question: '¿Cuánto es 15% de 200?', options: ['25', '30', '35', '40'], correct: 1 },
        { question: 'Si x + 5 = 12, ¿cuánto vale x?', options: ['5', '7', '12', '17'], correct: 1 },
        { question: '¿Cuál es el área de un círculo de radio 3?', options: ['6π', '9π', '12π', '3π'], correct: 1 },
        { question: '√144 = ?', options: ['10', '11', '12', '13'], correct: 2 },
        { question: '¿Cuánto es 2³?', options: ['6', '8', '9', '12'], correct: 1 }
    ],
    simulacro: [
        { question: 'La célula es la unidad básica de:', options: ['La materia', 'La vida', 'El átomo', 'La energía'], correct: 1 },
        { question: 'El agua está formada por:', options: ['Hidrógeno y oxígeno', 'Oxígeno y nitrógeno', 'Carbono e hidrógeno', 'Sodio y cloro'], correct: 0 },
        { question: '¿Cuál es la capital de Colombia?', options: ['Cali', 'Medellín', 'Bogotá', 'Barranquilla'], correct: 2 },
        { question: 'La raíz cuadrada de 81 es:', options: ['7', '8', '9', '10'], correct: 2 },
        { question: '¿Qué gas respiramos?', options: ['Nitrógeno', 'Oxígeno', 'Dióxido de carbono', 'Hidrógeno'], correct: 1 }
    ]
};

function startQuiz(subject) {
    currentQuiz = QUIZ_DATA[subject] || [];
    currentQuestionIndex = 0;
    quizAnswers = {};

    document.getElementById('quizTitle').textContent = 'Quiz de ' + subject.charAt(0).toUpperCase() + subject.slice(1);
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
        optionsHtml += `<div class="quiz-option ${selected}" onclick="selectAnswer(${i})">${opt}</div>`;
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

    alert('¡Quiz completado!\n\nPuntaje: ' + score + '%\nRespuestas correctas: ' + correct + '/' + currentQuiz.length);

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

function closeQuiz() {
    document.getElementById('quizModal').classList.remove('active');
    currentQuiz = [];
    currentQuestionIndex = 0;
    quizAnswers = {};
}

window.onload = function () {
    checkExistingSession();
};
