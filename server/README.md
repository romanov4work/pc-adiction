# Whisper API Server

Сервер для распознавания речи детей в игре "Прокачай Речь".

## Установка

```bash
pip install openai-whisper flask flask-cors
```

## Запуск

```bash
cd server
python whisper_server.py
```

Сервер запустится на `http://localhost:5000`

## API Endpoints

### GET /health
Проверка работоспособности сервера

**Ответ:**
```json
{
  "status": "ok",
  "message": "Whisper API работает!",
  "model": "base"
}
```

### POST /transcribe
Распознавание речи из аудио

**Параметры:**
- `audio` (file) - аудио файл (mp3, wav, webm)
- `language` (string, optional) - язык (по умолчанию 'ru')

**Ответ:**
```json
{
  "success": true,
  "text": "от топота копыт пыль по полю летит",
  "duration": 2.5,
  "confidence": 0.95,
  "processing_time": 1.2,
  "language": "ru"
}
```

### POST /analyze
Анализ скороговорки с оценкой

**Параметры:**
- `audio` (file) - аудио файл
- `target_text` (string) - эталонный текст скороговорки
- `target_time` (float) - целевое время в секундах

**Ответ:**
```json
{
  "success": true,
  "text": "от топота копыт пыль по полю летит",
  "duration": 2.8,
  "accuracy": 100.0,
  "clarity": 92.5,
  "speed_goal_met": true,
  "target_time": 3.0
}
```

## Модели Whisper

Используется модель `base` (баланс скорости и качества).

Доступные модели:
- `tiny` - самая быстрая, низкое качество
- `base` - быстрая, хорошее качество ✅ (используется)
- `small` - медленнее, лучше качество
- `medium` - медленная, отличное качество
- `large` - очень медленная, максимальное качество

Для смены модели измените в коде:
```python
model = whisper.load_model("base")  # замените на нужную
```
