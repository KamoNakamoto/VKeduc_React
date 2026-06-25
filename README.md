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

## 2***. Витрина + Админка (Vite, порт 5173)

В новом терминале:

```powershell
cd VKeduc_React          # корень Vite-проекта
npm install               # один раз
npm run dev
```

- Витрина: `http://localhost:5173`
- Админка: `http://localhost:5173/admin`

---

### 3. Лэндинг (Next.js + SSR, порт 3000)

В третьем терминале:

powershellcd landing
npm install               # один раз
npm run dev

Открыть: http://localhost:3000



### 3***. Установить зависимости бэкенда

cd server
npm install
cd ..

### 4. Запустить бэкенд (Терминал 1)

cd server
npm start // or // node server.js

Сервер запустится на http://localhost:4000


## API эндпоинты

- GET /api/apps — все приложения
- GET /api/apps?search=текст — поиск
- GET /api/apps?free=true — только бесплатные
- GET /api/apps?category=productivity — по категории
- GET /api/apps/:id — приложение по ID




