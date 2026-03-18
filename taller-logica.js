// taller-logica.js
import { saveWorkshopResults } from "./workshop-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const studentModal = document.getElementById('student-modal');
    const startForm = document.getElementById('start-exam-form');
    const nameInput = document.getElementById('student-name');
    const emailInput = document.getElementById('student-email');
    
    const container = document.getElementById('questions-container');
    const submitPanel = document.getElementById('submit-panel');
    const finishBtn = document.getElementById('finish-exam-btn');
    const timerDisplay = document.getElementById('countdown-timer');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-bar-container');
    
    const unansweredWarning = document.getElementById('unanswered-warning');
    const unansweredCount = document.getElementById('unanswered-count');

    let examTimer;
    let secondsLeft = 90 * 60; // 90 minutes
    let userAnswers = new Array(40).fill(null);

    // Banco de Preguntas (40) - Estilo UdeA Avanzado
    const questions = [
        {
            q: "Si todos los tigres tienen rayas y algunos gatos tienen rayas, ¿qué se puede concluir válidamente?",
            options: [
                "A) Algunos gatos son tigres.",
                "B) Todos los gatos con rayas son tigres.",
                "C) Algunos animales con rayas no son tigres.",
                "D) No se puede concluir ninguna de las anteriores."
            ], correct: 3
        },
        {
            q: "Una bacteria se duplica cada minuto. Si a las 12:00 m. se coloca una bacteria en un frasco vacío y el frasco se llena a las 1:00 p.m., ¿a qué hora el frasco estaba a la mitad de su capacidad?",
            options: ["A) 12:30 p.m.", "B) 12:45 p.m.", "C) 12:59 p.m.", "D) 12:15 p.m."], correct: 2
        },
        {
            q: "Juan es mayor que Pedro, Luis es menor que Juan, y Pedro es mayor que Luis. ¿Quién es el menor de todos?",
            options: ["A) Juan", "B) Pedro", "C) Luis", "D) No se puede determinar"], correct: 2
        },
        {
            q: "En una familia hay 3 hermanos. La suma de sus edades es 30. Hace 5 años, la suma de las edades de los dos mayores era 15. ¿Cuál es la edad actual del menor?",
            options: ["A) 5 años", "B) 10 años", "C) 15 años", "D) 20 años"], correct: 0
        },
        {
            q: "Un tren de 100 metros de largo viaja a 100 m/s. ¿Cuánto tiempo tardará en cruzar completamente un túnel de 100 metros de largo?",
            options: ["A) 1 segundo", "B) 1.5 segundos", "C) 2 segundos", "D) 0.5 segundos"], correct: 2
        },
        // Fill the rest with placeholders to reach 40 for brevity and simulation purposes
        ...Array.from({length: 35}, (_, i) => ({
            q: `Pregunta de Lógica Avanzada #${i+6}: [Simulación UdeA] Un acertijo complejo sobre distribuciones, probabilidades o inferencia lógica espacial.`,
            options: [
                `A) Opción distractora A.`,
                `B) Opción distractora B.`,
                `C) Opción correcta (simulada).`,
                `D) Opción distractora D.`
            ], correct: 2
        }))
    ];

    const correctAnswersArray = questions.map(q => q.correct);

    // Initialization
    function init() {
        // Auto-fill if returning user
        if (localStorage.getItem('vetprep_student_name')) {
            nameInput.value = localStorage.getItem('vetprep_student_name');
            emailInput.value = localStorage.getItem('vetprep_student_email');
        }
    }

    startForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Save user state
        localStorage.setItem('vetprep_student_name', nameInput.value.trim());
        localStorage.setItem('vetprep_student_email', emailInput.value.trim());
        
        // Hide modal, show UI
        studentModal.classList.add('hidden');
        container.classList.remove('hidden');
        submitPanel.classList.remove('hidden');
        progressContainer.classList.remove('hidden');

        renderQuestions();
        startTimer();
    });

    function startTimer() {
        examTimer = setInterval(() => {
            secondsLeft--;
            if(secondsLeft <= 0) {
                clearInterval(examTimer);
                autoSubmitExam();
            }
            updateTimerDisplay();
        }, 1000);
    }

    function updateTimerDisplay() {
        const h = Math.floor(secondsLeft / 3600);
        const m = Math.floor((secondsLeft % 3600) / 60);
        const s = secondsLeft % 60;
        timerDisplay.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        if (secondsLeft < 300) {
            timerDisplay.classList.add('text-red-500', 'animate-pulse');
        }
    }

    function updateProgress() {
        const answeredCount = userAnswers.filter(a => a !== null).length;
        const progressPercent = (answeredCount / 40) * 100;
        progressBar.style.width = `${progressPercent}%`;

        const missing = 40 - answeredCount;
        if (missing > 0) {
            unansweredWarning.classList.remove('hidden');
            unansweredCount.textContent = missing;
        } else {
            unansweredWarning.classList.add('hidden');
        }
    }

    function renderQuestions() {
        questions.forEach((qObj, index) => {
            const num = index + 1;
            const qDiv = document.createElement('div');
            qDiv.className = 'bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200';
            
            let optionsHTML = '';
            qObj.options.forEach((opt, optIndex) => {
                optionsHTML += `
                    <label class="relative flex items-start p-4 cursor-pointer rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                        <input type="radio" name="q${index}" value="${optIndex}" class="peer sr-only option-radio">
                        <div class="w-full flex items-center gap-4 transition-all pb-1">
                            <div class="indicator w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center font-bold text-xs text-transparent transition-all">✓</div>
                            <span class="text-gray-700 font-medium group-hover:text-gray-900">${opt}</span>
                        </div>
                    </label>
                `;
            });

            qDiv.innerHTML = `
                <div class="flex items-start gap-4 mb-6">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 text-sm border-2 border-emerald-200">
                        ${num}
                    </div>
                    <h3 class="text-lg md:text-xl font-bold text-gray-900 leading-relaxed mt-1">${qObj.q}</h3>
                </div>
                <div class="space-y-3 pl-0 md:pl-14">
                    ${optionsHTML}
                </div>
            `;

            // Attach listeners to radiogroups
            const radios = qDiv.querySelectorAll('input[type="radio"]');
            radios.forEach(r => {
                r.addEventListener('change', (e) => {
                    userAnswers[index] = parseInt(e.target.value);
                    updateProgress();
                });
            });

            container.appendChild(qDiv);
        });
        
        // Final update for missing count init
        updateProgress();
    }

    async function submitExam() {
        clearInterval(examTimer);
        finishBtn.disabled = true;
        finishBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Guardando...';

        const result = await saveWorkshopResults('Logica Matemática', userAnswers, correctAnswersArray);

        if (result && result.success) {
            submitPanel.innerHTML = `
                <div class="text-emerald-500 text-6xl mb-4"><i class="fa-solid fa-clipboard-check"></i></div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Examen Enviado!</h3>
                <p class="text-gray-600 mb-6">Tu nota aproximada bajo estándar UdeA es:</p>
                <div class="inline-block bg-gray-50 rounded-2xl border-2 border-gray-200 px-8 py-6 mb-8">
                    <div class="text-5xl font-extrabold text-emerald-700">${result.score}/100</div>
                    <div class="text-sm font-bold text-gray-400 mt-2">Aciertos: ${result.raw}/40</div>
                </div>
                <div class="space-y-4">
                    <a href="index.html" class="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">Volver al Inicio</a>
                </div>
            `;
        } else {
            submitPanel.innerHTML = `<div class="text-red-500 font-bold">Ocurrió un error guardando el resultado. Por favor toma captura de pantalla de esta alerta para soporte. Nota: ${result ? result.score : 'N/A'}/100.</div>`;
        }
        
        // Disable all radios
        document.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
    }

    function autoSubmitExam() {
        alert("¡Tiempo Agotado! Se enviarán las respuestas actuales.");
        submitExam();
    }

    finishBtn.addEventListener('click', () => {
        const missing = userAnswers.filter(a => a === null).length;
        if (missing > 0) {
            const confirmSubmit = confirm(`Aún tienes ${missing} preguntas sin responder. ¿Seguro que quieres entregar?`);
            if (!confirmSubmit) return;
        }
        submitExam();
    });

    init();
});
