//Enganchamos la función getQuestionsFromAPI en el main.js
import { getQuestionsFromAPI } from './data.js';

//Testing log
// console.log('main.js enganchado, menos mal');

// Saber en qué página estamos
const currentPage = window.location.pathname;

// Si estamos en home.html o en la raíz, dibujar el gráfico de historial
if (
    currentPage.includes('home.html') ||
    currentPage === '/' ||
    currentPage.endsWith('index.html')
) {
    //Dibujar el gráfico de historial
    const canvas = document.getElementById('historyChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const history = JSON.parse(localStorage.getItem('history')) || [];

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Parámetros del gráfico
        const padding = 30;
        const barWidth = 30;
        const maxScore = 10;
        const spacing = 10;
        const chartHeight = canvas.height - padding * 2;

        // Calcular escala
        const maxBars = history.length;
        const totalWidth = maxBars * (barWidth + spacing);
        const offsetX = (canvas.width - totalWidth) / 2;

        // Dibujar barras
        history.forEach((entry, index) => {
            const x = offsetX + index * (barWidth + spacing);
            const barHeight = (entry.score / maxScore) * chartHeight;
            const y = canvas.height - padding - barHeight;

            // Dibujar barra
            ctx.fillStyle = '#4a90e2';
            ctx.fillRect(x, y, barWidth, barHeight);

            // Etiqueta de fecha
            ctx.fillStyle = '#000';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(entry.date, x + barWidth / 2, canvas.height - 10);
        });

        // Eje Y
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
    }

    // Botón de inicio
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            window.location.href = 'question.html'; // Cambia a la página de preguntas
        });
    }
}
// Si estamos en question.html, inicializar el quiz
if (currentPage.includes('question.html')) {
    const homeView = document.getElementById('home');
    const quizView = document.getElementById('quiz');
    const resultsView = document.getElementById('results');

    const startBtn = document.getElementById('start-btn'); //?
    const nextBtn = document.getElementById('next-btn');
    const goHomeBtn = document.getElementById('go-home');
    const questionEl = document.getElementById('question');
    const answerButtonsEl = document.getElementById('answer-buttons');
    const scoreSpan = document.getElementById('score'); //?
    const currentQuestionSpan = document.getElementById('current-question');

    let questions = []; // Inicializamos el array de preguntas
    let currentQuestionIndex = 0; // Inicializamos el índice de la pregunta actual
    let score = 0; // Inicializamos el puntaje

    // Función para mostrar la vista correspondiente
    function showView(view) {
        homeView?.classList.add('hide');
        quizView?.classList.add('hide');
        resultsView?.classList.add('hide');
        view?.classList.remove('hide');
    }

    // Función para inicializar el quiz y cargar las preguntas
    async function initializeQuiz() {
        showView(quizView);
        currentQuestionIndex = 0;
        score = 0;
        questions = await getQuestionsFromAPI();

        if (questions.length === 0) {
            alert('No se pudieron cargar preguntas.');
            showView(homeView);
            return;
        }

        prepareNextQuestion();
    }

    // Función para preparar la siguiente pregunta
    function prepareNextQuestion() {
        resetState();
        if (currentQuestionSpan) {
            currentQuestionSpan.innerText = currentQuestionIndex + 1;
        }
        displayQuestion(questions[currentQuestionIndex]);
    }

    // Función para mostrar la pregunta y sus respuestas
    function displayQuestion(question) {
        questionEl.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) button.dataset.correct = true;
            button.addEventListener('click', selectAnswer);
            answerButtonsEl.appendChild(button);
        });
    }

    // Función para reiniciar el estado del quiz
    function resetState() {
        nextBtn.classList.add('hide');
        while (answerButtonsEl.firstChild) {
            answerButtonsEl.removeChild(answerButtonsEl.firstChild);
        }
    }

    // Función para manejar la selección de respuesta
    function selectAnswer(e) {
        const selected = e.target;
        const correct = selected.dataset.correct === 'true';
        if (correct) score++; // Incrementar el puntaje si la respuesta es correcta

        Array.from(answerButtonsEl.children).forEach(btn => {
            btn.disabled = true;
            btn.classList.add(
                btn.dataset.correct === 'true' ? 'correct' : 'wrong' // Agregar clase 'wrong' a las incorrectas
            );
        });

        if (questions.length > currentQuestionIndex + 1) {
            nextBtn.classList.remove('hide'); // Mostrar botón "Siguiente" si hay más preguntas
        } else {
            // Si no hay más preguntas, mostrar el puntaje final
            localStorage.setItem('lastScore', score);
            const history = JSON.parse(localStorage.getItem('history')) || [];
            history.push({ date: new Date().toLocaleDateString(), score });
            localStorage.setItem('history', JSON.stringify(history));
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 1000);
        }
    }
    // Agregar evento al botón "Iniciar"
    nextBtn?.addEventListener('click', () => {
        currentQuestionIndex++;
        prepareNextQuestion();
    });
    // Agregar evento al botón "volver al inicio"
    goHomeBtn?.addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    // Iniciar automáticamente el quiz al cargar la página
    initializeQuiz();
}

// Si estamos en results.html, mostrar el puntaje y permitir volver al inicio
if (currentPage.includes('results.html')) {
    const scoreSpan = document.getElementById('score'); // Traer el elemento del puntaje
    const score = localStorage.getItem('lastScore') || 0; // Traer el puntaje desde localStorage
    if (scoreSpan) {
        scoreSpan.innerText = score; // Mostrar el puntaje en pantalla
    }

    const goHomeBtn = document.getElementById('go-home');
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            // Agregar evento al botón "volver al inicio"
            window.location.href = 'home.html';
        });
    }
}
