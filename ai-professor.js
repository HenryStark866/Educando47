// AI Professor System for VetPrep UdeA
// This system provides 24/7 AI tutoring for each subject

// Define subjects and their corresponding AI professors
const subjects = {
    biologia: {
        name: "Biología",
        description: "Especialista en biología celular, genética, fisiología y anatomía",
        avatar: "🔬",
        welcomeMessage: "¡Hola! Soy tu profesor de Biología. ¿En qué puedo ayudarte hoy con temas de biología celular, genética o anatomía?"
    },
    quimica: {
        name: "Química",
        description: "Experto en química general, orgánica y bioquímica",
        avatar: "⚗️",
        welcomeMessage: "¡Hola! Soy tu profesor de Química. ¿Necesitas ayuda con reacciones químicas, estequiometría o conceptos de bioquímica?"
    },
    fisica: {
        name: "Física",
        description: "Especialista en física básica, mecánica y termodinámica",
        avatar: "🧲",
        welcomeMessage: "¡Hola! Soy tu profesor de Física. ¿En qué puedo ayudarte con problemas de mecánica, electricidad o termodinámica?"
    },
    matematicas: {
        name: "Matemáticas",
        description: "Experto en álgebra, geometría, trigonometría y cálculo básico",
        avatar: "📐",
        welcomeMessage: "¡Hola! Soy tu profesor de Matemáticas. ¿Necesitas ayuda con ecuaciones, funciones, trigonometría o problemas de álgebra?"
    },
    lenguaje: {
        name: "Lenguaje",
        description: "Especialista en comprensión lectora, gramática y redacción",
        avatar: "📚",
        welcomeMessage: "¡Hola! Soy tu profesor de Lenguaje. ¿En qué puedo ayudarte con comprensión de textos, gramática o técnicas de redacción?"
    }
};

// Store chat histories for each user (in a real app, this would be in Firestore)
const chatHistories = {};

// Simple AI response generator (in a real app, this would use a proper LLM API)
function generateAIResponse(subject, userMessage, chatHistory) {
    const subjectInfo = subjects[subject];
    if (!subjectInfo) {
        return "Lo siento, no tengo información sobre ese tema.";
    }
    
    // Simple keyword-based responses for demonstration
    const lowerMessage = userMessage.toLowerCase();
    
    // Biology responses
    if (subject === 'biologia') {
        if (lowerMessage.includes('celula') || lowerMessage.includes('célula')) {
            return "La célula es la unidad estructural y funcional de todos los seres vivos. Existen dos tipos principales: células procariotas (sin núcleo) y eucariotas (con núcleo definido). ¿Te gustaría que profundizara en algún orgánulo celular en particular?";
        } else if (lowerMessage.includes('adn') || lowerMessage.includes('genética')) {
            return "El ADN (ácido desoxirribonucleico) es la molécula que contiene las instrucciones genéticas para el desarrollo, funcionamiento y reproducción de todos los organismos conocidos. Tiene una estructura de doble hélice descubierta por Watson y Crick en 1953. ¿Quieres saber más sobre la replicación del ADN o la síntesis de proteínas?";
        } else if (lowerMessage.includes('anatomi')) {
            return "En anatomía veterinaria, estudiamos la estructura de los animales domésticos. Los sistemas principales incluyen: esquelético, muscular, nervioso, circulatorio, respiratorio, digestivo, urinario y reproductivo. ¿Hay algún sistema específico que quieras repasar?";
        }
    }
    
    // Chemistry responses
    else if (subject === 'quimica') {
        if (lowerMessage.includes('reaccion') || lowerMessage.includes('reacción')) {
            return "Una reacción química es un proceso en el que una o más sustancias (reactivos) se transforman en diferentes sustancias (productos). Se representa mediante una ecuación química balanceada. Por ejemplo: 2H₂ + O₂ → 2H₂O. ¿Necesitas ayuda para balancear alguna ecuación en particular?";
        } else if (lowerMessage.includes('estequiometria') || lowerMessage.includes('estequiometría')) {
            return "La estequiometría es el cálculo de las cantidades de reactivos y productos en una reacción química basada en la conservación de la masa y la ley de las proporciones definidas. Para resolver un problema de estequiometría: 1) Balancea la ecuación, 2) Convierte a moles, 3) Usa la relación estequiométrica, 4) Convierte a las unidades deseadas. ¿Quieres que resolvamos un ejemplo juntos?";
        } else if (lowerMessage.includes('ph') || lowerMessage.includes('ph')) {
            return "El pH es una escala que mide la acidez o basicidad de una solución acuosa. Va desde 0 (muy ácido) hasta 14 (muy básico), siendo 7 neutro. pH = -log[H⁺], donde [H⁺] es la concentración de iones hidrógeno. En biología, el pH sanguíneo normal está entre 7.35 y 7.45. ¿Te gustaría practicar algunos cálculos de pH?";
        }
    }
    
    // Physics responses
    else if (subject === 'fisica') {
        if (lowerMessage.includes('newton') || lowerMessage.includes('fuerza')) {
            return "Las leyes de Newton describen el relación entre las fuerzas que actúan sobre un cuerpo y su movimiento resultante. Primera ley (inercia): Un cuerpo permanece en reposo o en movimiento rectilíneo uniforme salvo que actúe sobre él una fuerza neta. Segunda ley (F=ma): La fuerza neta acting on a body equals its mass times its acceleration. Tercera ley (acción-reacción): A toda acción corresponde una reacción igual y opuesta. ¿En cuál de estas leyes necesitas más aclaración?";
        } else if (lowerMessage.includes('energia') || lowerMessage.includes('energía')) {
            return "La energía es la capacidad de realizar trabajo. Existen diferentes formas: energía cinética (Ec = ½mv²), potencial gravitatoria (U = mgh), potencial elástica (U = ½kx²), térmica, química, nuclear, etc. El principio de conservación de la energía establece que la energía total en un sistema aislado permanece constante. ¿Quieres que aplicemos este principio a algún problema específico?";
        } else if (lowerMessage.includes('onda') || lowerMessage.includes('ondas')) {
            return "Una onda es una perturbación que se propaga transportando energía sin transporte neto de materia. Características importantes: longitud de onda (λ), frecuencia (f), velocidad (v = λf), amplitud y fase. Las ondas pueden ser transversales o longitudinales. El sonido es un ejemplo de onda longitudinal mecánica que requiere un medio material para propagarse. ¿Te gustaría resolver algún problema relacionado con ondas?";
        }
    }
    
    // Math responses
    else if (subject === 'matematicas') {
        if (lowerMessage.includes('ecuacion') || lowerMessage.includes('ecuación')) {
            return "Una ecuación es una igualdad que se cumple solo para ciertos valores de las variables incógnitas. Para resolver una ecuación lineal de primer grado (ax + b = 0): 1) Despeje el término con x, 2) Divida ambos lados por el coeficiente de x. Ejemplo: 2x + 5 = 11 → 2x = 6 → x = 3. ¿Tienes alguna ecuación específica que necesites resolver?";
        } else if (lowerMessage.includes('funcion') || lowerMessage.includes('función')) {
            return "Una función es una relación entre dos conjuntos que asigna a cada elemento del primer conjunto exactamente un elemento del segundo conjunto. Se representa como f(x) = y. Las funciones pueden ser lineales (f(x) = mx + b), cuadráticas (f(x) = ax² + bx + c), exponenciales, logarítmicas, trigonométricas, etc. ¿Hay algún tipo de función en particular que quieras estudiar?";
        } else if (lowerMessage.includes('trigonometria') || lowerMessage.includes('trigonometría')) {
            return "La trigonometría estudia las relaciones entre los ángulos y los lados de los triángulos. Las razones trigonométricas fundamentales en un triángulo rectángulo son: seno (sen θ = cateto opuesto/hipotenusa), coseno (cos θ = cateto adyacente/hipotenusa) y tangente (tan θ = cateto opuesto/cateto adyacente). También existen sus reciprocos: cosecante, secante y cotangente. ¿Necesitas ayuda para resolver algún triángulo o aplicar identidades trigonométricas?";
        }
    }
    
    // Language responses
    else if (subject === 'lenguaje') {
        if (lowerMessage.includes('gramatica') || lowerMessage.includes('gramática')) {
            return "La gramática es el conjunto de reglas que rigen la estructura de las oraciones en un idioma. En español, los componentes básicos de una oración son: sujeto y predicado. El predicado puede ser verbal (contiene un verbo) o nominal (contiene un atributo). Otros elementos importantes: determinantes, adjetivos, adverbios, preposiciones y conjunciones. ¿Hay alguna regla gramatical específica que quieras repasar?";
        } else if (lowerMessage.includes('redaccion') || lowerMessage.includes('redacción')) {
            return "Una buena redacción requiere: 1) Claridad (expresar las ideas de manera understandable), 2) Coherencia (las ideas deben estar lógicamente conectadas), 3) Corrección (uso adecuado de la gramática y ortografía), 4) Apropiadez (adaptar el lenguaje al contexto y audiencia). El proceso de redacción incluye: planificación, rédaction, revisión y edición. ¿Te gustaría que revisemos un párrafo juntos o que te dé algunos consejos para mejorar tu redacción académica?";
        } else if (lowerMessage.includes('comprension') || lowerMessage.includes('comprensión')) {
            return "Para mejorar la comprensión lectora: 1) Haz una primera lectura rápida para obtener la idea general, 2) Subraya o anota las ideas principales, 3) Haz preguntas sobre el texto mientras lees, 4) Relaciona la información con lo que ya sabes, 5) Haz un resumen o mapa conceptual al final. Los tipos de preguntas que suelen hacerse son: explícitas (la respuesta está directamente en el texto), implícitas (se requiere hacer inferencias) y de aplicación (aplicar lo aprendido a nuevas situaciones). ¿Quieres practicar con un texto corto?";
        }
    }
    
    // Default response if no keyword matches
    return `¡Excelente pregunta sobre ${subjectInfo.name}! Como tu profesor de ${subjectInfo.name.toLowerCase()}, estoy aquí para ayudarte a comprender mejor este tema. Para darte la mejor explicación posible, ¿podrías ser más específico sobre qué aspecto te resulta difícil o qué exactamente te gustaría aprender? Por ejemplo, podrías mencionar un concepto particular, un tipo de problema o una aplicación específica que estés estudiando.`;
}

// Initialize AI Professor System
function initAIProfessorSystem() {
    // Add AI Professor button to each course card
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        // Only add if not already present
        if (!card.querySelector('.ai-professor-btn')) {
            const aiButton = document.createElement('button');
            aiButton.className = 'btn ai-professor-btn';
            aiButton.innerHTML = '<i class="fas fa-robot"></i> Professor IA';
            aiButton.style.marginTop = '10px';
            aiButton.style.width = '100%';
            aiButton.style.background = '#9C27B0';
            aiButton.style.border = 'none';
            
            aiButton.addEventListener('click', function() {
                // Determine which course this is
                const courseTitle = card.querySelector('h3').textContent.toLowerCase();
                let subject = '';
                
                if (courseTitle.includes('completo') || courseTitle.includes('intensivo') || courseTitle.includes('virtual')) {
                    // For general courses, let user choose subject
                    showSubjectSelection(card);
                } else {
                    // Map course titles to subjects (simplified)
                    if (courseTitle.includes('biologia')) subject = 'biologia';
                    else if (courseTitle.includes('quimica')) subject = 'quimica';
                    else if (courseTitle.includes('fisica')) subject = 'fisica';
                    else if (courseTitle.includes('matematicas')) subject = 'matematicas';
                    else if (courseTitle.includes('lenguaje')) subject = 'lenguaje';
                    
                    if (subject) {
                        openAIProfessorChat(subject);
                    } else {
                        showSubjectSelection(card);
                    }
                }
            });
            
            card.appendChild(aiButton);
        }
    });
    
    // Add global AI Professor access button in header
    const header = document.querySelector('.logo');
    if (header && !document.querySelector('.global-ai-btn')) {
        const globalAIButton = document.createElement('button');
        globalAIButton.className = 'global-ai-btn';
        globalAIButton.innerHTML = '<i class="fas fa-robot"></i> Ayuda IA 24/7';
        globalAIButton.style.position = 'fixed';
        globalAIButton.style.bottom = '20px';
        globalAIButton.style.right = '20px';
        globalAIButton.style.background = '#9C27B0';
        globalAIButton.style.color = 'white';
        globalAIButton.style.border = 'none';
        globalAIButton.style.padding = '15px 20px';
        globalAIButton.style.borderRadius = '50px';
        globalAIButton.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        globalAIButton.style.zIndex = '1000';
        globalAIButton.style.cursor = 'pointer';
        
        globalAIButton.addEventListener('click', showSubjectSelection);
        
        document.body.appendChild(globalAIButton);
    }
}

// Show subject selection modal
function showSubjectSelection() {
    // Create modal if not exists
    let subjectModal = document.getElementById('subjectModal');
    if (!subjectModal) {
        subjectModal = document.createElement('div');
        subjectModal.id = 'subjectModal';
        subjectModal.className = 'modal';
        subjectModal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>Selecciona una Asignatura</h2>
                <p>Elige el área en la que necesitas ayuda de nuestro Professor IA</p>
                <div class="subjects-grid" id="subjectsGrid"></div>
            </div>
        `;
        document.body.appendChild(subjectModal);
        
        // Add close functionality
        const closeBtn = subjectModal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            subjectModal.classList.remove('active');
        });
        
        subjectModal.addEventListener('click', (e) => {
            if (e.target === subjectModal) {
                subjectModal.classList.remove('active');
            }
        });
        
        // Populate subjects
        const subjectsGrid = document.getElementById('subjectsGrid');
        subjectsGrid.innerHTML = '';
        
        for (const [key, subject] of Object.entries(subjects)) {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <div class="subject-icon">${subject.avatar}</div>
                <h3>${subject.name}</h3>
                <p>${subject.description}</p>
            `;
            subjectCard.addEventListener('click', () => {
                subjectModal.classList.remove('active');
                openAIProfessorChat(key);
            });
            subjectsGrid.appendChild(subjectCard);
        }
    }
    
    subjectModal.classList.add('active');
}

// Open AI Professor chat for a specific subject
function openAIProfessorChat(subject) {
    // Create chat modal if not exists
    let chatModal = document.getElementById('aiProfessorModal');
    if (!chatModal) {
        chatModal = document.createElement('div');
        chatModal.id = 'aiProfessorModal';
        chatModal.className = 'modal';
        chatModal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="ai-professor-header">
                    <div class="ai-avatar">🤖</div>
                    <div>
                        <h3 id="aiProfessorTitle">Professor IA</h3>
                        <p id="aiProfessorSubtitle">Tu tutor personal 24/7</p>
                    </div>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages"></div>
                <div class="ai-chat-input">
                    <input type="text" id="aiChatInput" placeholder="Escribe tu pregunta aquí...">
                    <button id="aiSendBtn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(chatModal);
        
        // Add close functionality
        const closeBtn = chatModal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            chatModal.classList.remove('active');
        });
        
        chatModal.addEventListener('click', (e) => {
            if (e.target === chatModal) {
                chatModal.classList.remove('active');
            }
        });
        
        // Add send functionality
        const sendBtn = chatModal.querySelector('#aiSendBtn');
        const chatInput = chatModal.querySelector('#aiChatInput');
        
        sendBtn.addEventListener('click', () => {
            sendAIMessage(subject);
        });
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendAIMessage(subject);
            }
        });
    }
    
    // Set up chat for this subject
    const subjectInfo = subjects[subject];
    document.getElementById('aiProfessorTitle').textContent = `${subjectInfo.avatar} Professor de ${subjectInfo.name}`;
    document.getElementById('aiProfessorSubtitle').textContent = subjectInfo.description;
    
    // Initialize chat history for this user-subject combination if not exists
    const userId = 'default_user'; // In real app, this would be the actual user ID
    const chatKey = `${userId}-${subject}`;
    if (!chatHistories[chatKey]) {
        chatHistories[chatKey] = [];
        // Add welcome message
        const welcomeMessage = {
            type: 'ai',
            content: subjectInfo.welcomeMessage,
            timestamp: new Date()
        };
        chatHistories[chatKey].push(welcomeMessage);
        renderAIChatMessages(subject);
    }
    
    chatModal.classList.add('active');
    // Focus input
    setTimeout(() => {
        document.getElementById('aiChatInput').focus();
    }, 300);
}

// Send message to AI Professor
function sendAIMessage(subject) {
    const chatModal = document.getElementById('aiProfessorModal');
    const chatInput = chatModal.querySelector('#aiChatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat history
    const userId = 'default_user';
    const chatKey = `${userId}-${subject}`;
    const userMessage = {
        type: 'user',
        content: message,
        timestamp: new Date()
    };
    
    if (!chatHistories[chatKey]) {
        chatHistories[chatKey] = [];
    }
    chatHistories[chatKey].push(userMessage);
    
    // Clear input and show loading
    chatInput.value = '';
    showAITypingIndicator(subject);
    
    // Simulate AI thinking time
    setTimeout(() => {
        hideAITypingIndicator(subject);
        
        // Generate AI response
        const aiResponse = generateAIResponse(subject, message, chatHistories[chatKey] || []);
        
        // Add AI message to chat history
        const aiMessage = {
            type: 'ai',
            content: aiResponse,
            timestamp: new Date()
        };
        chatHistories[chatKey].push(aiMessage);
        
        // Render updated chat
        renderAIChatMessages(subject);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Show typing indicator
function showAITypingIndicator(subject) {
    const chatModal = document.getElementById('aiProfessorModal');
    const messagesContainer = chatModal.querySelector('.ai-chat-messages');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-message ai-typing';
    typingIndicator.innerHTML = `
        <div class="ai-avatar">🤖</div>
        <div class="ai-message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    typingIndicator.id = 'aiTypingIndicator';
    messagesContainer.appendChild(typingIndicator);
    scrollToBottom(messagesContainer);
}

// Hide typing indicator
function hideAITypingIndicator(subject) {
    const typingIndicator = document.getElementById('aiTypingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Render chat messages
function renderAIChatMessages(subject) {
    const chatModal = document.getElementById('aiProfessorModal');
    const messagesContainer = chatModal.querySelector('.ai-chat-messages');
    const userId = 'default_user';
    const chatKey = `${userId}-${subject}`;
    
    // Clear messages
    messagesContainer.innerHTML = '';
    
    // Add all messages
    const messages = chatHistories[chatKey] || [];
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ${message.type}`;
        
        if (message.type === 'user') {
            messageElement.innerHTML = `
                <div class="ai-message-content">
                    ${message.content}
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-message-content">
                    ${message.content}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    scrollToBottom(messagesContainer);
}

// Scroll to bottom of element
function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

// Add some basic styling for AI Professor components
function addAIProfessorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* AI Professor Button */
        .ai-professor-btn {
            background: #9C27B0 !important;
        }
        
        .ai-professor-btn:hover {
            background: #7B1FA2 !important;
        }
        
        /* Subject Selection Modal */
        .subjects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .subject-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 2px solid #f0f0f0;
        }
        
        .subject-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8x 30px rgba(0,0,0,0.15);
            border-color: #9C27B0;
        }
        
        .subject-icon {
            font-size: 3rem;
            margin-bottom: 15px;
        }
        
        /* AI Professor Chat */
        .ai-professor-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .ai-avatar {
            font-size: 2.5rem;
            margin-right: 15px;
        }
        
        .ai-chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: #fafafa;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .ai-message {
            display: flex;
            margin-bottom: 15px;
            max-width: 80%;
        }
        
        .ai-message.user {
            margin-left: auto;
            flex-direction: row-reverse;
        }
        
        .ai-message.ai {
            margin-right: auto;
        }
        
        .ai-message-content {
            background: white;
            padding: 12px 16px;
            border-radius: 18px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .ai-message.user .ai-message-content {
            background: #E3F2FD;
            border-bottom-right-radius: 5px;
        }
        
        .ai-message.ai .ai-message-content {
            border-bottom-left-radius: 5px;
        }
        
        .ai-typing .ai-message-content {
            background: #f5f5f5;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: #9C27B0;
            border-radius: 50%;
            display: block;
            animation: typingPulse 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingPulse {
            0%, 60%, 100% { transform: scale(0.8); }
            30% { transform: scale(1); }
        }
        
        .ai-chat-input {
            display: flex;
            gap: 10px;
        }
        
        #aiChatInput {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }
        
        #aiChatInput:focus {
            border-color: #9C27B0;
        }
        
        #aiSendBtn {
            background: #9C27B0;
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
        }
        
        #aiSendBtn:hover {
            background: #7B1FA2;
            transform: scale(1.1);
        }
        
        /* Global AI Button */
        .global-ai-btn {
            transition: all 0.3s ease;
        }
        
        .global-ai-btn:hover {
            background: #7B1FA2;
            transform: scale(1.05);
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
            .ai-chat-messages {
                height: 300px;
            }
            
            .ai-message {
                max-width: 85%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the AI Professor System when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAIProfessorSystem();
    addAIProfessorStyles();
});

// Export functions for global access
window.initAIProfessorSystem = initAIProfessorSystem;
window.openAIProfessorChat = openAIProfessorChat;