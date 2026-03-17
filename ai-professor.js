// ai-professor.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const closeBtn = document.getElementById('ai-close-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatMessages = document.getElementById('ai-chat-messages');
    const subjectPillsContainer = document.getElementById('ai-subject-pills');

    const subjects = [
        { id: 'biologia', name: 'Biología', icon: '🔬', color: 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' },
        { id: 'quimica', name: 'Química', icon: '⚗️', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200' },
        { id: 'logica', name: 'Lógica', icon: '🧠', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200' },
        { id: 'fisica', name: 'Física', icon: '🧲', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200' },
        { id: 'matematicas', name: 'Matemáticas', icon: '📐', color: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
        { id: 'lenguaje', name: 'Lenguaje', icon: '📚', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200' }
    ];

    const responses = {
        biologia: [
            "Para el componente de Biología en Veterinaria UdeA, enfócate en **biología celular (mitosis, meiosis)** y los **sistemas del cuerpo animal**.",
            "¡Excelente elección! ¿Sabías que las preguntas de **genética mendeliana** son muy frecuentes en el examen de la UdeA?"
        ],
        quimica: [
            "En Química, asegúrate de dominar la **estequiometría** y concentraciones de **soluciones**. Son temas obligados.",
            "La **química orgánica básica** (nomenclatura de alcanos, alquenos y grupos funcionales) suele aparecer con 1 o 2 preguntas clave."
        ],
        logica: [
            "Razonamiento lógico exige **interpretar gráficas** e inferir patrones. ¡Practica mucho con simulacros bajo presión de tiempo!",
            "Tip ninja en Lógica: a veces **descartar opciones** (estrategia de eliminación) es más rápido que encontrar la respuesta matemáticamente."
        ],
        fisica: [
            "Para Física, repasa **cinemática (MRU, MRUA)** y dinámica (Leyes de Newton). Las preguntas suelen ser conceptuales más que de cálculos complejos.",
            "Ten muy claras las fórmulas de **trabajo y conservación de la energía**. A menudo las evalúan combinadas."
        ],
        matematicas: [
            "No dejes de lado la **geometría analítica** básica y trigonometría. ¡Suelen salir siempre problemas de áreas y proporciones!",
            "Domina el manejo ágil de **fracciones y regla de tres compuesta**. Te van a salvar en preguntas de todas las áreas."
        ],
        lenguaje: [
            "En la prueba de Competencia Lectora, un gran truco es **leer primero las preguntas** antes de leer el texto. Te ahorrará valioso tiempo.",
            "Identifica rápidamente la **intención del autor** y la tesis central del texto en los dos primeros párrafos."
        ]
    };

    // Toggle Chat visibility
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
        toggleBtn.classList.add('hidden');
        // Remove notification pulse if exists
        const pulse = toggleBtn.querySelector('.animate-pulse');
        if(pulse) pulse.remove();
        scrollToBottom();
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        toggleBtn.classList.remove('hidden');
    });

    // Render Subject Pills dynamically
    subjects.forEach(sub => {
        const pill = document.createElement('button');
        pill.className = `px-3 py-1.5 rounded-[12px] text-[12px] font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 hover:scale-105 active:scale-95 ${sub.color}`;
        pill.innerHTML = `${sub.icon} ${sub.name}`;
        pill.addEventListener('click', () => handleSubjectSelect(sub.id, sub.name));
        subjectPillsContainer.appendChild(pill);
    });

    // Initialize Default Welcome Message
    chatMessages.innerHTML = `
        <div class="self-start max-w-[85%] bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200 text-sm text-gray-700 slide-up leading-relaxed relative">
            ¡Hola futuro veterinario! <i class="fa-solid fa-paw text-emerald-500"></i><br>Soy tu <b>Profe IA</b>. Estoy aquí para resolver tus dudas sobre el examen de la UdeA. <br><br>¿Qué área quieres repasar hoy?
        </div>
    `;

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm slide-up leading-relaxed relative ${
            sender === 'user' 
            ? 'self-end bg-emerald-600 text-white rounded-tr-sm border border-emerald-700' 
            : 'self-start bg-white text-gray-700 rounded-tl-sm border border-gray-200'
        }`;
        div.innerHTML = text;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'self-start bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200 flex items-center gap-1.5 slide-up w-16';
        div.innerHTML = `
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-duration: 1s; animation-delay: 0ms;"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-duration: 1s; animation-delay: 200ms;"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-duration: 1s; animation-delay: 400ms;"></div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function handleSubjectSelect(subjectId, subjectName) {
        // User Message
        appendMessage('user', `Quiero repasar <b>${subjectName}</b>`);

        // Bot Typing
        appendTypingIndicator();

        // Simulate network delay for AI response
        setTimeout(() => {
            removeTypingIndicator();
            const subjectResponses = responses[subjectId];
            const randomResponse = subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
            
            // Format response with some rich styling
            const formattedResponse = `
                <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                    <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">TIPS DE ${subjectName}</span>
                </div>
                ${randomResponse.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-800">$1</strong>')}
            `;
            
            appendMessage('bot', formattedResponse);
        }, 1000 + Math.random() * 1000); // 1s to 2s delay
    }
});