import { getQuestionsFromAPI } from './data.js';
console.log('main.js enganchado, menos mal');

const currentPage = window.location.pathname;

if (
    currentPage.includes('home.html') ||
    currentPage === '/' ||
    currentPage.endsWith('index.html')
) {
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

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            window.location.href = 'question.html';
        });
    }
}
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
        questions = await getQuestionsFromAPI();

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

    // Iniciar automáticamente el quiz al cargar la página
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
