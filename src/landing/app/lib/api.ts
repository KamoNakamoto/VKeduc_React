import type { App } from "../types";

// В реальном проекте лучше вынести в .env (NEXT_PUBLIC_API_URL / API_URL)
const API_BASE_URL = "http://localhost:4000/api";

/**
 * Получает список приложений с MiniStore API.
 * Вызывается прямо в server-компоненте, до отдачи HTML клиенту.
 *
 * cache: 'no-store' — отключаем кэш Next.js, чтобы Лэндинг
 * всегда показывал актуальные данные из админки.
 */
export async function getApps(): Promise<App[]> {
  const res = await fetch(`${API_BASE_URL}/apps`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`MiniStore API ответил с ошибкой: ${res.status}`);
  }

  return res.json();
}
