// 1. Traer el puntaje desde localStorage (guardado antes en main.js)
const score = localStorage.getItem('lastScore')

// 2. Mostrarlo en pantalla
document.getElementById('score').innerText = score || 0

// 3. Guardarlo junto a la fecha en el historial
const history = JSON.parse(localStorage.getItem('history')) || []

history.push({
  date: new Date().toLocaleDateString(),
  score: parseInt(score)
})

localStorage.setItem('history', JSON.stringify(history))

// 4. Volver al inicio
document.getElementById('go-home').addEventListener('click', () => {
  window.location.href = 'home.html'
})
