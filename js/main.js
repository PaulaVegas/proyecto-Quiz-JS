//Enganchamos la función getQuestionsFromAPI en el main.js
import { getQuestionsFromAPI, getQuestionsLocal } from './data.js';

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
    const colorines = [];
    for (let i = 0; i < puntuaciones.length; i++) {
        var color;
        if (puntuaciones[i] >= 8) {
            color = ' #C1E1C1';
        } else if (puntuaciones[i] >= 5) {
            color = ' #fdfd96';
        } else {
            color = ' #FAA0A0';
        }
        colorines.push(color);
    }
    const colorinesHover = [];
    for (let i = 0; i < puntuaciones.length; i++) {
        var colorHover;
        if (puntuaciones[i] >= 8) {
            colorHover = '#03c03c';
        } else if (puntuaciones[i] >= 5) {
            colorHover = '#C4BB7D';
        } else {
            colorHover = ' #c23b22';
        }
        colorinesHover.push(colorHover);
    }
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
                        backgroundColor: colorines,
                        hoverBackgroundColor: colorinesHover,
                        borderWidth: 1,
                        borderColor: 'darkblue',
                        borderRadius: 5,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Historial de puntuaciones',
                    },
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Puntaje',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha',
                        },
                    },
                },
            },
        });
    }
}

const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');

//Para elegir la dificultad
if (difficultySelect && startBtn) {
    difficultySelect.addEventListener('change', () => {
        const selectedDifficulty = difficultySelect.value;
        localStorage.setItem('difficulty', selectedDifficulty);
    });

    startBtn.addEventListener('click', () => {
        const selectedDifficulty = difficultySelect.value;
        localStorage.setItem('difficulty', selectedDifficulty);
        window.location.href = 'question.html';
    });
}

// Botones para elegir fuente de preguntas
const btnLocal = document.getElementById('btn-local');
const btnMixed = document.getElementById('btn-mixed');

if (startBtn) {
    startBtn.addEventListener('click', () => {
        localStorage.setItem('questionSource', 'api');
        window.location.href = 'question.html';
    });
}

if (btnLocal) {
    btnLocal.addEventListener('click', () => {
        localStorage.setItem('questionSource', 'local');
        window.location.href = 'question.html';
    });
}
if (btnMixed) {
    btnMixed.addEventListener('click', () => {
        localStorage.setItem('questionSource', 'mixed');
        window.location.href = 'question.html';
    });
}

// Si estamos en question.html, inicializar el quiz
if (currentPage.includes('question.html')) {
    const homeView = document.getElementById('home');
    const quizView = document.getElementById('quiz');
    const resultsView = document.getElementById('results');

    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const goHomeBtn = document.getElementById('go-home');
    const questionEl = document.getElementById('question');
    const answerButtonsEl = document.getElementById('answer-buttons');
    const scoreSpan = document.getElementById('score');
    const currentQuestionSpan = document.getElementById('current-question');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    function showView(view) {
        homeView?.classList.add('hide');
        quizView?.classList.add('hide');
        resultsView?.classList.add('hide');
        view?.classList.remove('hide');
    }

    async function initializeQuiz() {
        showView(quizView);
        currentQuestionIndex = 0;
        score = 0;

        const source = localStorage.getItem('questionSource');
        console.log('Fuente de preguntas', source);

        if (source === 'local') {
            const { getQuestionsLocal } = await import('./data.js');
            questions = getQuestionsLocal();
        } else if (source === 'mixed') {
            const { getMixedQuestions } = await import('./data.js');
            questions = await getMixedQuestions();
        } else {
            const { getQuestionsFromAPI } = await import('./data.js');
            questions = await getQuestionsFromAPI();
        }

        if (questions.length === 0) {
            alert('No se pudieron cargar preguntas.');
            showView(homeView);
            return;
        }

        prepareNextQuestion();
    }

    function prepareNextQuestion() {
        resetState();
        if (currentQuestionSpan) {
            currentQuestionSpan.innerText = currentQuestionIndex + 1;
        }
        displayQuestion(questions[currentQuestionIndex]);
    }

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

    function resetState() {
        nextBtn.classList.add('hide');
        while (answerButtonsEl.firstChild) {
            answerButtonsEl.removeChild(answerButtonsEl.firstChild);
        }
    }

    function selectAnswer(e) {
        const selected = e.target;
        const correct = selected.dataset.correct === 'true';
        if (correct) score++;

        Array.from(answerButtonsEl.children).forEach(btn => {
            btn.disabled = true;
            btn.classList.add(
                btn.dataset.correct === 'true' ? 'correct' : 'wrong'
            );
        });

        if (questions.length > currentQuestionIndex + 1) {
            nextBtn.classList.remove('hide');
        } else {
            localStorage.setItem('lastScore', score);
            const history = JSON.parse(localStorage.getItem('history')) || [];
            history.push({ date: new Date().toLocaleDateString(), score });
            localStorage.setItem('history', JSON.stringify(history));
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 1000);
        }
    }

    nextBtn?.addEventListener('click', () => {
        currentQuestionIndex++;
        prepareNextQuestion();
    });

    goHomeBtn?.addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    initializeQuiz();
}

if (currentPage.includes('results.html')) {
    const scoreSpan = document.getElementById('score');
    const score = localStorage.getItem('lastScore') || 0;
    if (scoreSpan) {
        scoreSpan.innerText = score;
    }

    const goHomeBtn = document.getElementById('go-home');
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}
