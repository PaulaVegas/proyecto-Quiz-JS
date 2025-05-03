// Funcion para obtener preguntas de la API
export async function getQuestionsFromAPI() {
    const url = 'https://the-trivia-api.com/api/questions?limit=10';
    try {
        const response = await fetch(url);
        const data = await response.json();

        return data.map(item => {
            const allAnswers = [...item.incorrectAnswers, item.correctAnswer];
            const shuffled = allAnswers.sort(() => Math.random() - 0.5);

            return {
                question: item.question,
                answers: shuffled.map(text => ({
                    text: text,
                    correct: text === item.correctAnswer,
                })),
            };
        });
    } catch (error) {
        console.error('Error al obtener preguntas de la API:', error);
        return [];
    }
}

// Funcion para obtener preguntas de forma local
export function getQuestionsLocal() {
    return [
        {
            question: '¿Cuál es el océano más grande del mundo?',
            answers: [
                { text: 'Atlántico', correct: false },
                { text: 'Pacífico', correct: true },
                { text: 'Índico', correct: false },
                { text: 'Ártico', correct: false },
            ],
        },
        {
            question: '¿Qué país tiene forma de bota?',
            answers: [
                { text: 'Italia', correct: true },
                { text: 'España', correct: false },
                { text: 'México', correct: false },
                { text: 'Francia', correct: false },
            ],
        },
        {
            question: '¿Cuánto es 9 + 10?',
            answers: [
                { text: '21', correct: false },
                { text: '19', correct: true },
                { text: '20', correct: false },
                { text: '18', correct: false },
            ],
        },
        {
            question: '¿Cuál es la capital de Japón?',
            answers: [
                { text: 'Tokio', correct: true },
                { text: 'Seúl', correct: false },
                { text: 'Pekín', correct: false },
                { text: 'Bangkok', correct: false },
            ],
        },
        {
            question: '¿Qué gas es esencial para la respiración humana?',
            answers: [
                { text: 'Oxígeno', correct: true },
                { text: 'Dióxido de carbono', correct: false },
                { text: 'Nitrógeno', correct: false },
                { text: 'Helio', correct: false },
            ],
        },
        {
            question: '¿Cuál es el continente más pequeño del mundo?',
            answers: [
                { text: 'Oceanía', correct: false },
                { text: 'Europa', correct: false },
                { text: 'Asia', correct: false },
                { text: 'Australia', correct: true },
            ],
        },
        {
            question: '¿Qué planeta es conocido como el planeta rojo?',
            answers: [
                { text: 'Marte', correct: true },
                { text: 'Júpiter', correct: false },
                { text: 'Saturno', correct: false },
                { text: 'Venus', correct: false },
            ],
        },
        {
            question: '¿Cuál es el animal terrestre más grande del mundo?',
            answers: [
                { text: 'Elefante africano', correct: true },
                { text: 'Rinoceronte', correct: false },
                { text: 'Hipopótamo', correct: false },
                { text: 'Oso polar', correct: false },
            ],
        },
        {
            question: '¿Qué instrumento musical tiene teclas blancas y negras?',
            answers: [
                { text: 'Guitarra', correct: false },
                { text: 'Piano', correct: true },
                { text: 'Batería', correct: false },
                { text: 'Saxofón', correct: false },
            ],
        },
        {
            question: '¿Cuál es el país más poblado del mundo?',
            answers: [
                { text: 'India', correct: false },
                { text: 'Estados Unidos', correct: false },
                { text: 'China', correct: true },
                { text: 'Indonesia', correct: false },
            ],
        },
    ];
}
