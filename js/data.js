export function getQuestionsLocal() {
    return [
      {
        question: '¿Cuál es el océano más grande del mundo?',
        answers: [
          { text: 'Atlántico', correct: false },
          { text: 'Pacífico', correct: true },
          { text: 'Índico', correct: false },
          { text: 'Ártico', correct: false }
        ]
      },
      {
        question: '¿Qué país tiene forma de bota?',
        answers: [
          { text: 'Italia', correct: true },
          { text: 'España', correct: false },
          { text: 'México', correct: false },
          { text: 'Francia', correct: false }
        ]
      },
      {
        question: '¿Cuánto es 9 + 10?',
        answers: [
          { text: '21', correct: false },
          { text: '19', correct: true },
          { text: '20', correct: false },
          { text: '18', correct: false }
        ]
      }
    ]
  }
  