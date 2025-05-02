export async function getQuestionsFromAPI() {
    const url = 'https://the-trivia-api.com/api/questions?limit=10'
    try {
      const response = await fetch(url)
      const data = await response.json()
  
      return data.map((item) => {
        const allAnswers = [...item.incorrectAnswers, item.correctAnswer]
        const shuffled = allAnswers.sort(() => Math.random() - 0.5)
  
        return {
          question: item.question,
          answers: shuffled.map(text => ({
            text: text,
            correct: text === item.correctAnswer
          }))
        }
      })
    } catch (error) {
      console.error('Error al obtener preguntas de la API:', error)
      return []
    }
  }
  