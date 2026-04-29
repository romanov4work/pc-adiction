# 🚀 Инструкция по деплою на Render

## Шаг 1: Создай GitHub репозиторий

### 1.1 Инициализируй Git (если еще не сделал):
```bash
cd "C:\Users\Admin\Desktop\audio-romanov\PC_aDiction"
git init
git add .
git commit -m "Initial commit: Прокачай Речь - прототип скороговорки"
```

### 1.2 Создай репозиторий на GitHub:
1. Зайди на https://github.com
2. Нажми "New repository"
3. Название: `pc-adiction` (или любое)
4. Сделай **Public** (для бесплатного Render)
5. НЕ добавляй README, .gitignore (у нас уже есть)
6. Нажми "Create repository"

### 1.3 Залей код на GitHub:
```bash
git remote add origin https://github.com/ВАШ_USERNAME/pc-adiction.git
git branch -M main
git push -u origin main
```

---

## Шаг 2: Деплой на Render

### 2.1 Зарегистрируйся на Render:
1. Зайди на https://render.com
2. Нажми "Get Started"
3. Войди через GitHub (проще всего)

### 2.2 Создай Blueprint:
1. На главной странице Render нажми **"New +"**
2. Выбери **"Blueprint"**
3. Подключи свой GitHub репозиторий `pc-adiction`
4. Render автоматически найдет `render.yaml`
5. Нажми **"Apply"**

### 2.3 Подожди деплоя:
- Render создаст 2 сервиса:
  - `pc-adiction-frontend` (фронтенд)
  - `pc-adiction-api` (Whisper бэкенд)
- Деплой займет ~5-10 минут (Whisper модель большая)

---

## Шаг 3: Обнови API URL в коде

### 3.1 Получи URL бэкенда:
- В Render Dashboard найди сервис `pc-adiction-api`
- Скопируй URL (например: `https://pc-adiction-api.onrender.com`)

### 3.2 Обнови код:
Открой `src/tongue-twister.js` и замени:

```javascript
// Было:
const WHISPER_API = 'http://localhost:5000';

// Стало:
const WHISPER_API = 'https://pc-adiction-api.onrender.com';
```

### 3.3 Закоммить и запушить:
```bash
git add src/tongue-twister.js
git commit -m "Update API URL for production"
git push
```

Render автоматически задеплоит обновление!

---

## Шаг 4: Тестируй на телефоне! 📱

### 4.1 Получи URL фронтенда:
- В Render Dashboard найди `pc-adiction-frontend`
- Скопируй URL (например: `https://pc-adiction-frontend.onrender.com`)

### 4.2 Открой на телефоне:
1. Открой браузер на телефоне
2. Перейди по URL
3. Открой `/tongue-twister.html`
4. Разреши доступ к микрофону
5. Тестируй! 🎤

---

## ⚠️ Важные моменты:

### Засыпание бэкенда:
- Бесплатный план Render усыпляет бэкенд через 15 мин неактивности
- Первый запрос после сна: ~30 секунд (загрузка Whisper модели)
- Это нормально для теста!

### Если бэкенд не отвечает:
1. Зайди в Render Dashboard
2. Открой `pc-adiction-api`
3. Посмотри логи (Logs)
4. Проверь, что сервис запущен (зеленый статус)

### Автодеплой:
- Каждый `git push` → автоматический деплой
- Следи за статусом в Render Dashboard

---

## 🎯 Быстрая проверка:

### Проверь бэкенд:
```bash
curl https://pc-adiction-api.onrender.com/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "message": "Whisper API работает!",
  "model": "base"
}
```

### Проверь фронтенд:
Открой в браузере:
```
https://pc-adiction-frontend.onrender.com/tongue-twister.html
```

---

## 🐛 Troubleshooting:

### Проблема: "Failed to fetch"
- Проверь, что API URL правильный в `tongue-twister.js`
- Проверь, что бэкенд запущен в Render Dashboard

### Проблема: Бэкенд не запускается
- Посмотри логи в Render Dashboard
- Проверь, что `requirements.txt` корректный
- Whisper модель большая (~500MB), деплой может занять 10 минут

### Проблема: Микрофон не работает
- Убедись, что сайт открыт через HTTPS (не HTTP!)
- Разреши доступ к микрофону в браузере

---

## 📊 Мониторинг:

### Render Dashboard:
- Логи в реальном времени
- Статус сервисов
- Использование ресурсов

### Бесплатный план:
- 750 часов/месяц (хватит на весь конкурс!)
- Безлимитные деплои
- HTTPS из коробки

---

## 🎉 Готово!

Теперь у тебя:
- ✅ Фронтенд на HTTPS
- ✅ Бэкенд с Whisper на HTTPS
- ✅ Автодеплой из GitHub
- ✅ Можно тестировать на телефоне

**Удачи на конкурсе! 🚀**
