"""
Whisper API сервер для распознавания речи детей
Используется для игры "Прокачай Речь"
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

# Загружаем модель Whisper (base - баланс скорости и качества)
print("[*] Загрузка модели Whisper...")
model = whisper.load_model("base")
print("[OK] Модель Whisper загружена!")

# Папка для временных аудио файлов
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/health', methods=['GET'])
def health():
    """Проверка работоспособности сервера"""
    return jsonify({
        'status': 'ok',
        'message': 'Whisper API работает!',
        'model': 'base'
    })

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Распознавание речи из аудио файла

    Ожидает:
    - audio: файл (mp3, wav, webm и т.д.)
    - language: язык (по умолчанию 'ru')

    Возвращает:
    - text: распознанный текст
    - duration: длительность речи (секунды)
    - confidence: уверенность (0-1)
    """

    if 'audio' not in request.files:
        return jsonify({'error': 'Нет аудио файла'}), 400

    audio_file = request.files['audio']
    language = request.form.get('language', 'ru')

    # Сохраняем временный файл
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{audio_file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(filepath)

    try:
        # Распознаем речь
        print(f"[*] Распознаю речь из {filename}...")
        start_time = time.time()

        result = model.transcribe(
            filepath,
            language=language,
            task='transcribe',
            fp16=False  # Для совместимости с CPU
        )

        processing_time = time.time() - start_time

        # Извлекаем данные
        text = result['text'].strip()
        segments = result.get('segments', [])

        # Вычисляем длительность речи (без пауз)
        speech_duration = 0
        if segments:
            for segment in segments:
                speech_duration += segment['end'] - segment['start']

        # Средняя уверенность
        avg_confidence = 0
        if segments:
            confidences = [seg.get('no_speech_prob', 0) for seg in segments]
            avg_confidence = 1 - (sum(confidences) / len(confidences))

        print(f"[OK] Распознано: '{text}' ({speech_duration:.2f}s)")

        # Удаляем временный файл
        os.remove(filepath)

        return jsonify({
            'success': True,
            'text': text,
            'duration': round(speech_duration, 2),
            'confidence': round(avg_confidence, 2),
            'processing_time': round(processing_time, 2),
            'language': language
        })

    except Exception as e:
        # Удаляем файл в случае ошибки
        if os.path.exists(filepath):
            os.remove(filepath)

        print(f"[ERROR] Ошибка: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_speech():
    """
    Анализ скороговорки: сравнение с эталоном

    Ожидает:
    - audio: файл
    - target_text: эталонный текст скороговорки
    - target_time: целевое время (секунды)

    Возвращает:
    - text: что сказал ребенок
    - duration: время произношения
    - accuracy: точность произношения (%)
    - speed_goal: достигнута ли цель по времени
    - clarity: четкость речи (%)
    """

    if 'audio' not in request.files:
        return jsonify({'error': 'Нет аудио файла'}), 400

    audio_file = request.files['audio']
    target_text = request.form.get('target_text', '')
    target_time = float(request.form.get('target_time', 3.0))

    # Сохраняем файл
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{audio_file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(filepath)

    try:
        # Распознаем
        result = model.transcribe(filepath, language='ru', fp16=False)

        text = result['text'].strip()
        segments = result.get('segments', [])

        # Длительность речи
        speech_duration = sum(seg['end'] - seg['start'] for seg in segments) if segments else 0

        # Четкость (на основе уверенности модели)
        clarity = 0
        if segments:
            confidences = [1 - seg.get('no_speech_prob', 0) for seg in segments]
            clarity = sum(confidences) / len(confidences)

        # Точность произношения (простое сравнение слов)
        target_words = set(target_text.lower().split())
        spoken_words = set(text.lower().split())

        if target_words:
            accuracy = len(target_words & spoken_words) / len(target_words)
        else:
            accuracy = 0

        # Цель по времени
        speed_goal_met = speech_duration <= target_time

        print(f"[ANALYZE] '{text}' | {speech_duration:.2f}s | {accuracy*100:.0f}% точность")

        os.remove(filepath)

        return jsonify({
            'success': True,
            'text': text,
            'duration': round(speech_duration, 2),
            'accuracy': round(accuracy * 100, 1),
            'clarity': round(clarity * 100, 1),
            'speed_goal_met': speed_goal_met,
            'target_time': target_time
        })

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)

        print(f"[ERROR] Ошибка анализа: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("Whisper API Server")
    print("=" * 50)
    print("Server: http://localhost:5000")
    print("Endpoints:")
    print("  GET  /health - проверка работы")
    print("  POST /transcribe - распознавание речи")
    print("  POST /analyze - анализ скороговорки")
    print("=" * 50)

    app.run(host='0.0.0.0', port=5000, debug=True)
