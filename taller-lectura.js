// taller-lectura.js
import { saveWorkshopResults } from "./workshop-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const studentModal = document.getElementById('student-modal');
    const startForm = document.getElementById('start-exam-form');
    const nameInput = document.getElementById('student-name');
    const emailInput = document.getElementById('student-email');
    
    const uiMain = document.getElementById('main-ui');
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

    // Banco de Preguntas (40) - Estilo UdeA Avanzado Competencia Lectora
    const questions = [
        {
            q: "Según el primer párrafo de TEXTO 1, la característica anatómica que distingue principalmente a los pulpos de los vertebrados es:",
            options: [
                "A) Su número total de neuronas.",
                "B) La distribución periférica de sus neuronas.",
                "C) El tamaño relativo de su cerebro central.",
                "D) La carencia de un sistema nervioso central."
            ], correct: 1
        },
        {
            q: "En el TEXTO 1, la expresión 'parche urgente' en el último párrafo sugiere que la inteligencia del pulpo:",
            options: [
                "A) Fue una adaptación deficiente a largo plazo.",
                "B) Surgió como una medida compensatoria rápida para evadir depredadores.",
                "C) Remedia las lesiones causadas por la pérdida de extremidades.",
                "D) Es un fenómeno transitorio y reversible biológicamente."
            ], correct: 1
        },
        {
            q: "Del TEXTO 2 se infiere que para los habitantes de Orán, la llegada de la primavera:",
            options: [
                "A) Representa el inicio de las festividades cívicas.",
                "B) Se manifiesta en un reverdecer visible de los jardines.",
                "C) Es un fenómeno comercial más que natural.",
                "D) Se asocia a las fuertes lluvias y al diluvio de barro."
            ], correct: 2
        },
        {
            q: "En el TEXTO 2, cuando el narrador dice que 'se necesita cierto tiempo para observar lo que la hace diferente', está enfatizando:",
            options: [
                "A) La monotonía inicial y aparente neutralidad de la ciudad.",
                "B) La profunda belleza que esconde la arquitectura comercial.",
                "C) La lentitud con la que ocurren los acontecimientos de la peste.",
                "D) El exotismo del clima en la prefectura francesa."
            ], correct: 0
        },
        // Mocks for brevity
        ...Array.from({length: 36}, (_, i) => ({
            q: `Pregunta de Comprensión Textual #${i+5}: [Simulación UdeA] El autor en la línea X sugiere la presencia de una ironía relacionada con...`,
            options: [
                `A) Opción válida, pero no responde a la ironía.`,
                `B) Opción distractora que parafrasea textualmente sin inferir.`,
                `C) Opción correcta que captura la intención del autor.`,
                `D) Opción opuesta a la tesis central.`
            ], correct: 2
        }))
    ];

    const correctAnswersArray = questions.map(q => q.correct);

    // Initialization
    function init() {
        if (localStorage.getItem('vetprep_student_name')) {
            nameInput.value = localStorage.getItem('vetprep_student_name');
            emailInput.value = localStorage.getItem('vetprep_student_email');
        }
    }

    startForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        localStorage.setItem('vetprep_student_name', nameInput.value.trim());
        localStorage.setItem('vetprep_student_email', emailInput.value.trim());
        
        studentModal.classList.add('hidden');
        uiMain.classList.remove('hidden');
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
            timerDisplay.classList.add('text-red-300', 'animate-pulse');
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
            qDiv.className = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-200';
            
            let optionsHTML = '';
            qObj.options.forEach((opt, optIndex) => {
                optionsHTML += `
                    <label class="relative flex items-start p-4 cursor-pointer rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                        <input type="radio" name="q${index}" value="${optIndex}" class="peer sr-only option-radio">
                        <div class="w-full flex items-center gap-4 transition-all pb-1">
                            <div class="indicator w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center font-bold text-xs text-transparent transition-all">✓</div>
                            <span class="text-gray-700 font-medium group-hover:text-gray-900 text-sm">${opt}</span>
                        </div>
                    </label>
                `;
            });

            qDiv.innerHTML = `
                <div class="flex items-start gap-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold flex-shrink-0 text-sm border-2 border-sky-200 mt-0.5">
                        ${num}
                    </div>
                    <h3 class="text-[15px] font-bold text-gray-900 leading-relaxed mt-1">${qObj.q}</h3>
                </div>
                <div class="space-y-2 pl-0 md:pl-11">
                    ${optionsHTML}
                </div>
            `;

            const radios = qDiv.querySelectorAll('input[type="radio"]');
            radios.forEach(r => {
                r.addEventListener('change', (e) => {
                    userAnswers[index] = parseInt(e.target.value);
                    updateProgress();
                });
            });

            container.appendChild(qDiv);
        });
        
        updateProgress();
    }

    async function submitExam() {
        clearInterval(examTimer);
        finishBtn.disabled = true;
        finishBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Guardando...';

        const result = await saveWorkshopResults('Competencia Lectora', userAnswers, correctAnswersArray);

        if (result && result.success) {
            submitPanel.innerHTML = `
                <div class="text-sky-500 text-6xl mb-4"><i class="fa-solid fa-clipboard-check"></i></div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Examen Enviado!</h3>
                <p class="text-gray-600 mb-6">Tu puntaje guardado en Firebase es:</p>
                <div class="inline-block bg-gray-50 rounded-2xl border-2 border-gray-200 px-8 py-6 mb-8">
                    <div class="text-5xl font-extrabold text-sky-700">${result.score}/100</div>
                    <div class="text-sm font-bold text-gray-400 mt-2">Aciertos: ${result.raw}/40</div>
                </div>
                <div class="space-y-4">
                    <a href="index.html" class="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">Volver al Menú Principal</a>
                </div>
            `;
        } else {
            submitPanel.innerHTML = `<div class="text-red-500 font-bold">Error guardando resultado. Toma captura. Nota obtenida: ${result ? result.score : 'N/A'}/100.</div>`;
        }
        
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
