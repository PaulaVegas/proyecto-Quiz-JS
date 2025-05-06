document.addEventListener('DOMContentLoaded', () => {
    // 1. Traer el puntaje desde localStorage (guardado antes en main.js)
    const score = localStorage.getItem('lastScore');

    // 2. Mostrarlo en pantalla
    document.getElementById('score').innerText = score || 0;

    // 3. Mensaje personalizado según el puntaje
    let message = '';
    if (score >= 8) {
        message = '¡Se nota que has estudiado!';
    } else if (score >= 5) {
        message = 'Bueno... Aceptable';
    } else if (score >= 3) {
        message = 'Muy triste... Quizás deberías hincar más los codos.';
    } else if (score >= 1) {
        message = 'Mejor deberías dedicarte a otra cosa...';
    } else {
        message = 'LOGRO DESBLOQUEADO: Cero Absoluto';
    }
    const resultMessageElement = document.getElementById('result-message');
    if (resultMessageElement) {
        resultMessageElement.innerText = message;
    }
    // 4. Jugar de nuevo
    document.getElementById('play-again').addEventListener('click', () => {
        window.location.href = 'question.html';
    });

    // 5. Volver al inicio
    document.getElementById('go-home').addEventListener('click', () => {
        window.location.href = 'home.html';
    });
});
