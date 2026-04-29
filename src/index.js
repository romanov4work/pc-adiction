// Главный файл приложения "Прокачай Речь"

// Запрос разрешения на микрофон при загрузке
window.addEventListener('DOMContentLoaded', () => {
    requestMicrophonePermission();
    initApp();
});

// Запрос доступа к микрофону
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Доступ к микрофону получен');
        stream.getTracks().forEach(track => track.stop());
    } catch (error) {
        console.error('❌ Ошибка доступа к микрофону:', error);
        alert('Пожалуйста, разрешите доступ к микрофону для игры! 🎤');
    }
}

// Инициализация приложения
function initApp() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('🎮 Игра начинается!');
            alert('Скоро здесь будет игра! 🚀');
        });
    }
}
