# MiniStore — App Marketplace

Учебный проект: витрина приложений на React + TypeScript с подключением к локальному API.

## Технологии

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Express (локальный бэкенд)

## Запуск проекта 

### 2. Установить зависимости фронтенда

npm install

### 3. Установить зависимости бэкенда

cd server
npm install
cd ..

### 4. Запустить бэкенд (Терминал 1)

cd server
npm start

Сервер запустится на http://localhost:4000

### 5. Запустить фронтенд (Терминал 2)

npm run dev

Открыть в браузере: http://localhost:5173

## API эндпоинты

- GET /api/apps — все приложения
- GET /api/apps?search=текст — поиск
- GET /api/apps?free=true — только бесплатные
- GET /api/apps?category=productivity — по категории
- GET /api/apps/:id — приложение по ID
