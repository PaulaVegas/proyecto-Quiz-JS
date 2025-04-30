//      Posible reparto de tareas:
//      ELIDA:

// Estructurar el home.html (botones, contenedores, clases)

// Encargarse del style.css (bootstrap, estilos propios)

//Encargarse del mobile first y responsive

// Insertar preguntas manuales (questions.js)

// Creación del home.html

// Repartición de funciones.

//      PAULA:

// Lógica de la API (fetch, formateo de datos, etc.)

// Creación de question y results.html

// Organización en GITHUB

// AMBAS:

// Revisar el código y la lógica de cada una para que no haya errores.
// Revisar el CSS y HTML para que no haya conflictos entre ambas (clases, ids, etc.)
// Refactorizar el código si es necesario.
// Comentar el código para que sea entendible para ambas.
// Código limpio y ordenado.

//   !!!!PSEUDOCODIGO!!!!

// async function fetchAPIQuestions():
//   fetch from api
//   format API data to match local structure
//   return as array

// on startButton click:
//   call startGame()

// function startGame():
//   load local + API questions (call getAllQuestions)
//   shuffle questions
//   set currentQuestionIndex = 0
//   show next question

// function showQuestion():
//   render question and answers in DOM

// function handleAnswer():
//   check if correct
//   save result
//   show feedback
//   show Next button

// on nextButton click:
//   currentQuestionIndex++
//   if more questions → show next
//   else → show results

// function saveResultsToStorage(data):
//   localStorage.setItem("quizResults", JSON.stringify(data))

// function getResultsFromStorage():
//   return JSON.parse(localStorage.getItem("quizResults"))

//   function showResults():
//   show total score
//   optionally draw graph

// function drawChart(data):
//   render CHART
