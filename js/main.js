//Enganchamos la función getQuestionsFromAPI en el main.js
import { getQuestionsFromAPI, getQuestionsLocal } from './data.js';

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
    const ctx = document.getElementById('historyChart').getContext('2d');
    const data = JSON.parse(localStorage.getItem('history')) || [];
    const fechas = data.map(item => item.date);
    const puntuaciones = data.map(item => item.score);

    if (window.myChart) {
        window.myChart.destroy();
    }

    if (data.length > 0) {
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: fechas,
                datasets: [
                    {
                        label: 'Puntuación',
                        data: puntuaciones,
                        barPercentage: 0.5,
                        barThickness: 80,
                        maxBarThickness: 80,
                        minBarLength: 2,
                        backgroundColor: '#3498db',
                        hoverBackgroundColor: '#2980b9',
                        borderWidth: 1,
                        borderColor: 'darkblue',
                        borderRadius: 5,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                    },
                },
            },
        });
    }
}
// Botones para elegir fuente de preguntas
const btnAPI = document.getElementById('btn-api');
const btnLocal = document.getElementById('btn-local');
const btnMixed = document.getElementById('btn-mixed');

if (btnAPI) {
    btnAPI.addEventListener('click', () => {
        localStorage.setItem('questionSource', 'api'); // Guardamos el tipo de fuente
        window.location.href = 'question.html';
    });
}

if (btnLocal) {
    btnLocal.addEventListener('click', () => {
        localStorage.setItem('questionSource', 'local'); // Guardamos el tipo de fuente
        window.location.href = 'question.html';
    });
}
if (btnMixed) {
    btnMixed.addEventListener('click', () => {
        localStorage.setItem('questionSource', 'mixed'); // Guardamos el tipo de fuente
        window.location.href = 'question.html';
    });
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
        //questions = await getQuestionsFromAPI();

        const source = localStorage.getItem('questionSource');

        if (source === 'local') {
            const { getQuestionsLocal } = await import('./data.js');
            questions = getQuestionsLocal();
        } else if (source === 'mixed') {
            const { getMixedQuestions } = await import('./data.js');
            questions = await getMixedQuestions();
        } else {
            questions = await getQuestionsFromAPI();
        }

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
