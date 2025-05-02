const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const questionContainer = document.getElementById('questionContainer');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answerButtons');

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

let currentQuestionIndex;
let quizResults = [];
let questionList = [];

console.log('Quiz App Loaded!');

async function startGame() {
    startButton.classList.add('hide');
    currentQuestionIndex = 0;
    quizResults = [];
    questionList = await fetchAPIQuestions();
    questionContainer.classList.remove('hide');
    setNextQuestion();
}

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionList.length) {
        setNextQuestion();
    } else {
        endGame();
    }
});

function endGame() {
    console.log('Game Over!');
    startButton.classList.remove('hide');
    questionContainer.classList.add('hide');
    currentQuestionIndex = 0;
    quizResults = [];
    questionList = [];
}

async function fetchAPIQuestions() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.results.map(question => {
        const answers = [
            ...question.incorrect_answers.map(ans => ({
                text: decodeHTML(ans),
                correct: false,
            })),
            {
                text: decodeHTML(question.correct_answer),
                correct: true,
            },
        ];

        return {
            question: decodeHTML(question.question),
            answers: shuffleArray(answers),
            correctAnswer: decodeHTML(question.correct_answer),
        };
    });
}

function showQuestion(item) {
    questionElement.innerText = item.question;
    item.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn'); //para agregar la clase btn a los botones bootstrap
        if (answer.correct) {
            button.dataset.correct = true;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function setNextQuestion() {
    resetState();
    showQuestion(questionList[currentQuestionIndex]);
}

function setStatusClass(element) {
    if (element.dataset.correct === 'true') {
        element.classList.add('color-correct');
    } else {
        element.classList.add('color-wrong');
    }
}

function selectAnswer(element) {
    const selectedButton = element.target;
    const correct = selectedButton.dataset.correct === 'true';

    quizResults.push({
        question: questionList[currentQuestionIndex].question,
        selected: selectedButton.innerText,
        correct: correct,
    });

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button);
    });

    if (questionList.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
        console.log('Resultados:', quizResults);
    }
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
