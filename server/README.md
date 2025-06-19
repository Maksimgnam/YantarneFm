# YantarneFM Server

Серверна частина додатку YantarneFM з підтримкою авторизації через Telegram бота та інтеграцією з MongoDB.

## 🚀 Функціональність

- **Авторизація через Telegram бота** з 6-значними кодами
- **MongoDB** для зберігання користувачів та кодів
- **RESTful API** для роботи з музикою та авторизацією
- **Google Drive інтеграція** для зберігання музичних файлів
- **Структурована архітектура** з контролерами, сервісами та маршрутами

## 📁 Структура проекту

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # Конфігурація MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Контролер авторизації
│   │   └── musicController.js   # Контролер музики
│   ├── models/
│   │   ├── User.js             # Модель користувача
│   │   └── AuthCode.js         # Модель коду авторизації
│   ├── routes/
│   │   ├── authRoutes.js       # Маршрути авторизації
│   │   ├── musicRoutes.js      # Маршрути музики
│   │   └── route.js            # Головні маршрути
│   └── services/
│       ├── authService.js      # Сервіс авторизації
│       └── telegramService.js  # Сервіс Telegram бота
├── temp/                       # Тимчасові файли
├── main.js                     # Головний файл сервера
├── package.json
└── .env.example
```

## 🛠 Налаштування

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Налаштування змінних середовища

Скопіюйте `.env.example` в `.env` та заповніть необхідні значення:

```bash
cp .env.example .env
```

```env
PORT=2000
MONGODB_URI=mongodb://localhost:27017/yantarne_fm
TOKEN_TG=your_telegram_bot_token
NODE_ENV=development
```

### 3. Налаштування MongoDB

Переконайтеся, що MongoDB запущено локально або вкажіть URL віддаленої бази даних в `MONGODB_URI`.

### 4. Налаштування Telegram бота

1. Створіть бота через [@BotFather](https://t.me/botfather)
2. Отримайте токен бота
3. Додайте токен в `.env` файл

### 5. Налаштування Google Drive API (опціонально)

1. Створіть проект в Google Cloud Console
2. Увімкніть Google Drive API
3. Створіть Service Account та завантажте `cred.json`
4. Розмістіть `cred.json` в корені серверної папки

## 🚀 Запуск

### Режим розробки
```bash
npm run dev
```

### Продакшн режим
```bash
npm start
```

## 📡 API Endpoints

### Авторизація

- `POST /api/auth/register` - Реєстрація/вхід користувача
- `POST /api/auth/verify` - Підтвердження коду
- `GET /api/auth/user/:telegramId` - Інформація про користувача

### Музика

- `GET /api/music/songs` - Список пісень
- `GET /api/music/download/:songId` - Завантаження пісні
- `GET /api/music/stream/:songId` - Стрімінг пісні

### Приклади запитів

#### Реєстрація користувача
```bash
curl -X POST http://localhost:2000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "telegramId": "123456789",
    "username": "user123",
    "firstName": "Іван",
    "lastName": "Петренко"
  }'
```

#### Підтвердження коду
```bash
curl -X POST http://localhost:2000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "telegramId": "123456789",
    "code": "123456"
  }'
```

## 🤖 Команди Telegram бота

- `/start` - Початок роботи
- `/register` - Отримати код для входу на сайт
- `/getsong` - Отримати випадкову пісню
- `/getsongs` - Показати список всіх пісень
- `/help` - Допомога

## 🔒 Безпека

- Коди авторизації діють лише 1 хвилину
- Автоматичне видалення застарілих кодів з бази даних
- Валідація всіх вхідних даних
- Обробка помилок та логування

## 🗄 База даних

### Колекція Users
```javascript
{
  telegramId: String,    // Унікальний ID з Telegram
  username: String,      // Ім'я користувача
  firstName: String,     // Ім'я
  lastName: String,      // Прізвище
  isActive: Boolean,     // Статус активності
  registeredAt: Date,    // Дата реєстрації
  lastLogin: Date        // Остання активність
}
```

### Колекція AuthCodes
```javascript
{
  telegramId: String,    // ID користувача
  code: String,          // 6-значний код
  expiresAt: Date,       // Час закінчення дії
  isUsed: Boolean,       // Чи використаний код
  createdAt: Date        // Час створення
}
```

## 🐛 Відлагодження

### Логи
Сервер виводить детальні логи для:
- Підключення до MongoDB
- Ініціалізації Telegram бота
- API запитів та помилок
- Операцій з базою даних

### Типові проблеми

1. **Помилка підключення до MongoDB**
   - Перевірте чи запущено MongoDB
   - Перевірте правильність `MONGODB_URI`

2. **Telegram бот не відповідає**
   - Перевірте правильність `TOKEN_TG`
   - Перевірте інтернет-з'єднання

3. **Помилки Google Drive API**
   - Перевірте наявність `cred.json`
   - Перевірте права доступу до папки

## 📝 Ліцензія

ISC