# PC_aDiction - Прокачай Речь

Обучающая игра для развития дикции у детей 6-11 лет.

## 🚀 Деплой на Render

### Автоматический деплой:

1. **Создай GitHub репозиторий:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pc-adiction.git
   git push -u origin main
   ```

2. **Подключи Render:**
   - Зайди на https://render.com
   - Нажми "New" → "Blueprint"
   - Подключи свой GitHub репозиторий
   - Render автоматически найдет `render.yaml` и создаст 2 сервиса

3. **Получишь 2 URL:**
   - Frontend: `https://pc-adiction-frontend.onrender.com`
   - API: `https://pc-adiction-api.onrender.com`

4. **Обнови API URL в коде:**
   - Открой `src/tongue-twister.js`
   - Замени `const WHISPER_API = 'http://localhost:5000'`
   - На `const WHISPER_API = 'https://pc-adiction-api.onrender.com'`

### Важно:

- ⚠️ Бэкенд засыпает через 15 мин неактивности
- ⏱️ Первый запрос после сна: ~30 секунд
- 🔄 Автодеплой при каждом `git push`

## 📱 Локальный запуск

### Backend (Whisper):
```bash
cd server
python whisper_server.py
# Доступен на http://localhost:5000
```

### Frontend:
```bash
cd src
python -m http.server 8000
# Открой http://localhost:8000/tongue-twister.html
```

## 📁 Структура

```
PC_aDiction/
├── src/                    # Фронтенд (деплоится на Render Static)
│   ├── tongue-twister.html
│   ├── tongue-twister.js
│   └── styles/
├── server/                 # Бэкенд (деплоится на Render Web Service)
│   └── whisper_server.py
├── render.yaml            # Конфигурация Render
└── requirements.txt       # Python зависимости
```

## 🎯 Дедлайны

- 04.05 - Отправка проекта
- 06.05 - Результат конкурса
- 07.05 - Защита проекта
