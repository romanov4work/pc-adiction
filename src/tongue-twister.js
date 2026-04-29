// Игра "Скороговорка" - Прокачай Речь
// Геймдизайн для детей 6-11 лет

// === КОНСТАНТЫ ===
const WHISPER_API = 'http://localhost:5000';
const TARGET_TEXT = 'от топота копыт пыль по полю летит';
const TARGET_TIME = 3.0; // секунды

// === СОСТОЯНИЕ ИГРЫ ===
let currentScreen = 'instruction';
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = 0;
let timerInterval = null;
let audioBlob = null;

// === ЭЛЕМЕНТЫ DOM ===
const screens = {
    instruction: document.getElementById('instruction-screen'),
    display: document.getElementById('display-screen'),
    record: document.getElementById('record-screen'),
    analyzing: document.getElementById('analyzing-screen'),
    results: document.getElementById('results-screen')
};

const buttons = {
    startGame: document.getElementById('start-game-btn'),
    playAudio: document.getElementById('play-audio-btn'),
    readyRecord: document.getElementById('ready-record-btn'),
    startRecord: document.getElementById('start-record-btn'),
    stopRecord: document.getElementById('stop-record-btn'),
    tryAgain: document.getElementById('try-again-btn'),
    nextLevel: document.getElementById('next-level-btn'),
    back: document.getElementById('back-btn')
};

const elements = {
    audioPlaying: document.getElementById('audio-playing'),
    recordStatus: document.getElementById('record-status'),
    recordTimer: document.getElementById('record-timer'),
    catRecordText: document.getElementById('cat-record-text'),
    catResultText: document.getElementById('cat-result-text'),
    resultsTitle: document.getElementById('results-title'),
    resultTime: document.getElementById('result-time'),
    resultTimeGoal: document.getElementById('result-time-goal'),
    resultClarity: document.getElementById('result-clarity'),
    resultStars: document.getElementById('result-stars'),
    resultAccuracy: document.getElementById('result-accuracy'),
    transcriptionText: document.getElementById('transcription-text')
};

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupEventListeners();
});

function initGame() {
    console.log('[GAME] Инициализация игры');
    showScreen('instruction');
}

function setupEventListeners() {
    // Кнопки навигации
    buttons.startGame.addEventListener('click', () => showScreen('display'));
    buttons.readyRecord.addEventListener('click', () => showScreen('record'));
    buttons.tryAgain.addEventListener('click', () => resetGame());
    buttons.nextLevel.addEventListener('click', () => alert('Следующий уровень скоро! 🚀'));
    buttons.back.addEventListener('click', () => window.location.href = 'index.html');

    // Аудио
    buttons.playAudio.addEventListener('click', playTongueTwisterAudio);

    // Запись
    buttons.startRecord.addEventListener('click', startRecording);
    buttons.stopRecord.addEventListener('click', stopRecording);
}

// === НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ ===
function showScreen(screenName) {
    console.log(`[SCREEN] Переход на: ${screenName}`);

    // Скрываем все экраны
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });

    // Показываем нужный
    screens[screenName].classList.add('active');
    currentScreen = screenName;

    // Специальные действия для экранов
    if (screenName === 'record') {
        updateCatMessage('Говори четко и быстро!');
    }
}

// === АУДИО ВОСПРОИЗВЕДЕНИЕ ===
async function playTongueTwisterAudio() {
    console.log('[AUDIO] Воспроизведение скороговорки');

    buttons.playAudio.disabled = true;
    elements.audioPlaying.classList.remove('hidden');

    // Используем Web Speech API для озвучки
    const utterance = new SpeechSynthesisUtterance(TARGET_TEXT);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9; // Немного медленнее для детей
    utterance.pitch = 1.2; // Выше тон (детский голос)

    utterance.onend = () => {
        buttons.playAudio.disabled = false;
        elements.audioPlaying.classList.add('hidden');
        console.log('[AUDIO] Воспроизведение завершено');
    };

    utterance.onerror = (error) => {
        console.error('[AUDIO] Ошибка:', error);
        buttons.playAudio.disabled = false;
        elements.audioPlaying.classList.add('hidden');
        alert('Не удалось воспроизвести аудио 😔');
    };

    window.speechSynthesis.speak(utterance);
}

// === ЗАПИСЬ ГОЛОСА ===
async function startRecording() {
    console.log('[RECORD] Начало записи');

    try {
        // Запрашиваем доступ к микрофону
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Создаем MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            console.log('[RECORD] Запись остановлена');

            // Создаем blob из записанных данных
            audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

            // Останавливаем поток
            stream.getTracks().forEach(track => track.stop());

            // Переходим к анализу
            await analyzeRecording();
        };

        // Начинаем запись
        mediaRecorder.start();
        recordingStartTime = Date.now();

        // Обновляем UI
        buttons.startRecord.classList.add('hidden');
        buttons.stopRecord.classList.remove('hidden');
        elements.recordStatus.textContent = 'Говори сейчас! 🎤';
        elements.recordStatus.style.color = '#f5576c';
        elements.recordTimer.classList.remove('hidden');

        // Запускаем таймер
        timerInterval = setInterval(updateRecordTimer, 100);

        updateCatMessage('Отлично! Продолжай!');

    } catch (error) {
        console.error('[RECORD] Ошибка доступа к микрофону:', error);
        alert('Не удалось получить доступ к микрофону 😔\nПроверь разрешения!');
    }
}

function stopRecording() {
    console.log('[RECORD] Остановка записи');

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        clearInterval(timerInterval);
    }
}

function updateRecordTimer() {
    const elapsed = (Date.now() - recordingStartTime) / 1000;
    elements.recordTimer.textContent = `${elapsed.toFixed(1)}с`;
}

// === АНАЛИЗ ЗАПИСИ ===
async function analyzeRecording() {
    console.log('[ANALYZE] Отправка на анализ');

    showScreen('analyzing');

    try {
        // Создаем FormData для отправки
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('target_text', TARGET_TEXT);
        formData.append('target_time', TARGET_TIME);

        // Отправляем на Whisper API
        const response = await fetch(`${WHISPER_API}/analyze`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('[ANALYZE] Результат:', result);

        if (result.success) {
            displayResults(result);
        } else {
            throw new Error(result.error || 'Ошибка анализа');
        }

    } catch (error) {
        console.error('[ANALYZE] Ошибка:', error);
        alert('Не удалось проанализировать запись 😔\nПроверь, что Whisper сервер запущен!');
        showScreen('record');
        resetRecordUI();
    }
}

// === ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ===
function displayResults(result) {
    console.log('[RESULTS] Отображение результатов');

    // Определяем качество выполнения
    const isExcellent = result.accuracy >= 90 && result.clarity >= 85 && result.speed_goal_met;
    const isGood = result.accuracy >= 70 && result.clarity >= 70;

    // Заголовок
    if (isExcellent) {
        elements.resultsTitle.textContent = 'Отлично! Ты супер! 🎉';
        elements.resultsTitle.style.color = '#28a745';
        updateCatMessage('Вау! Ты молодец! 🌟');
    } else if (isGood) {
        elements.resultsTitle.textContent = 'Хорошо! Ты почти справился! 👍';
        elements.resultsTitle.style.color = '#ffc107';
        updateCatMessage('Неплохо! Попробуй еще раз!');
    } else {
        elements.resultsTitle.textContent = 'Попробуй еще раз! 💪';
        elements.resultsTitle.style.color = '#17a2b8';
        updateCatMessage('Не переживай, получится!');
    }

    // Время
    elements.resultTime.textContent = `${result.duration}с`;
    if (result.speed_goal_met) {
        elements.resultTimeGoal.textContent = `Цель: ${result.target_time}с ✅`;
        elements.resultTimeGoal.style.color = '#28a745';
    } else {
        elements.resultTimeGoal.textContent = `Цель: ${result.target_time}с ⏱️`;
        elements.resultTimeGoal.style.color = '#ffc107';
    }

    // Четкость
    elements.resultClarity.textContent = `${result.clarity}%`;

    // Звездочки
    const stars = getStars(result.clarity);
    elements.resultStars.textContent = stars;

    // Точность
    elements.resultAccuracy.textContent = `${result.accuracy}%`;

    // Транскрипция
    elements.transcriptionText.textContent = `"${result.text}"`;

    // Показываем экран результатов
    showScreen('results');

    // Анимация конфетти (если отлично)
    if (isExcellent) {
        celebrateSuccess();
    }
}

function getStars(clarity) {
    if (clarity >= 90) return '⭐⭐⭐';
    if (clarity >= 70) return '⭐⭐';
    return '⭐';
}

function celebrateSuccess() {
    // Простая анимация успеха
    console.log('[CELEBRATE] 🎉 Празднуем успех!');
    // Здесь можно добавить библиотеку конфетти, например canvas-confetti
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
function updateCatMessage(message) {
    if (elements.catRecordText) {
        elements.catRecordText.textContent = message;
    }
    if (elements.catResultText) {
        elements.catResultText.textContent = message;
    }
}

function resetRecordUI() {
    buttons.startRecord.classList.remove('hidden');
    buttons.stopRecord.classList.add('hidden');
    elements.recordStatus.textContent = 'Нажми кнопку';
    elements.recordStatus.style.color = '#555';
    elements.recordTimer.classList.add('hidden');
    elements.recordTimer.textContent = '0.0с';
}

function resetGame() {
    console.log('[GAME] Сброс игры');
    resetRecordUI();
    audioChunks = [];
    audioBlob = null;
    showScreen('display');
}

// === ОБРАБОТКА ОШИБОК ===
window.addEventListener('error', (event) => {
    console.error('[ERROR]', event.error);
});

console.log('[GAME] Скрипт загружен успешно! 🎮');
