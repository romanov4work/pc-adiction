# 🚀 ДЕПЛОЙ НА RAILWAY - БЫСТРАЯ ИНСТРУКЦИЯ

## ШАГ 1: Регистрация на Railway (1 минута)

1. Открой: **https://railway.app**
2. Нажми **"Login"**
3. Войди через **GitHub** (используй аккаунт romanov4work)
4. Подтверди доступ

**Карта НЕ нужна!** Получишь $5 бесплатно сразу.

---

## ШАГ 2: Создай проект (2 минуты)

1. Нажми **"New Project"**
2. Выбери **"Deploy from GitHub repo"**
3. Найди репозиторий: **`pc-adiction`**
4. Railway автоматически определит:
   - Python для бэкенда
   - Static для фронтенда

---

## ШАГ 3: Настрой сервисы (3 минуты)

### Бэкенд (Whisper API):

1. Railway создаст сервис автоматически
2. Перейди в настройки сервиса
3. **Settings** → **Start Command**: 
   ```
   python server/whisper_server.py
   ```
4. **Settings** → **Root Directory**: оставь пустым
5. Нажми **"Deploy"**

### Фронтенд:

1. Нажми **"+ New"** → **"Empty Service"**
2. **Settings** → **Service Name**: `frontend`
3. **Settings** → **Root Directory**: `src`
4. **Settings** → **Build Command**: оставь пустым
5. **Settings** → **Start Command**: 
   ```
   python -m http.server 8080
   ```
6. Нажми **"Deploy"**

---

## ШАГ 4: Получи URL (1 минута)

### Бэкенд URL:
1. Открой сервис бэкенда
2. Вкладка **"Settings"** → **"Networking"**
3. Нажми **"Generate Domain"**
4. Скопируй URL (например: `https://pc-adiction-api.up.railway.app`)

### Фронтенд URL:
1. Открой сервис фронтенда
2. **"Settings"** → **"Networking"** → **"Generate Domain"**
3. Скопируй URL (например: `https://pc-adiction.up.railway.app`)

---

## ШАГ 5: Обнови API URL в коде (2 минуты)

1. Открой `src/tongue-twister.js`
2. Замени строку 4:

```javascript
// Было:
const WHISPER_API = 'http://localhost:5000';

// Стало:
const WHISPER_API = 'https://pc-adiction-api.up.railway.app';
```

3. Сохрани и запуши:
```bash
cd "C:\Users\Admin\Desktop\audio-romanov\PC_aDiction"
git add src/tongue-twister.js
git commit -m "Update API URL for Railway"
git push
```

Railway автоматически задеплоит обновление!

---

## ШАГ 6: Тестируй! 📱

Открой на телефоне:
```
https://pc-adiction.up.railway.app/tongue-twister.html
```

Разреши микрофон → играй! 🎤

---

## 📊 Мониторинг:

В Railway Dashboard:
- **Metrics** - использование ресурсов
- **Deployments** - история деплоев
- **Logs** - логи в реальном времени
- **Usage** - сколько потрачено из $5

---

## ⚠️ Важно:

- Деплой бэкенда займет ~5-10 минут (Whisper большой)
- Следи за логами, чтобы увидеть когда загрузится
- $5 хватит на весь конкурс!

---

## 🐛 Troubleshooting:

### Бэкенд не запускается:
- Проверь логи в Railway
- Убедись, что `requirements.txt` в корне проекта
- Whisper модель загружается ~2-3 минуты

### Фронтенд не открывается:
- Проверь, что Root Directory = `src`
- Проверь, что домен сгенерирован

### "Failed to fetch":
- Проверь API URL в `tongue-twister.js`
- Убедись, что бэкенд запущен (зеленый статус)

---

**НАЧИНАЙ С ШАГА 1! УДАЧИ! 🚀**
