# Лэндинг (Next.js + SSR)

Подключает Лэндинг к MiniStore API (`server.js`, порт 4000).

## Как это работает

- `app/lib/api.ts` — функция `getApps()`, делает `fetch` к `GET /api/apps`.
  `cache: 'no-store'` — чтобы данные не кэшировались Next.js и Лэндинг
  всегда видел изменения из админки.
- `app/page.tsx` — server-компонент (`async function Page()`),
  вызывает `getApps()` ДО `return`. HTML уже приходит с готовыми данными,
  без `useEffect` и состояния `loading`.
- `app/components/AppCard.tsx` — чистый компонент отображения одной карточки.

## Запуск

1. Backend (в папке с `server.js`):

```bash
node server.js
# Сервер запущен на http://localhost:4000
```

2. Лэндинг (в этой папке):

```bash
npm install
npm run dev
# Next.js поднимется на http://localhost:3000
```

Открой http://localhost:3000 — список приложений должен совпасть с тем,
что отдаёт `http://localhost:4000/api/apps`. Добавь/удали приложение через
Витрину или напрямую через API — после обновления страницы Лэндинг покажет
актуальные данные, т.к. забирает их с сервера при каждом запросе.

## Если что-то не работает

- Убедись, что backend запущен на 4000 ДО того, как открываешь Лэндинг.
- В `server.js` уже есть `app.use(cors())`, так что CORS не должен мешать
  (хотя для server-to-server fetch в Next.js это не критично).
- URL API сейчас захардкожен в `app/lib/api.ts` (`http://localhost:4000/api`).
  В реальном проекте лучше вынести в `.env.local` как `API_URL`.
