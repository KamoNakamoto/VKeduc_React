import AppCard from "./components/AppCard";
import { getApps } from "./lib/api";
import styles from "./page.module.css";

// Next.js: компонент — server по умолчанию.
// async function Page() — страница дожидается данных ДО return,
// поэтому браузер сразу получает готовый HTML с контентом.
export default async function Page() {
  const apps = await getApps();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>MiniStore</span>
        <h1 className={styles.heading}>Каталог приложений</h1>
        <p className={styles.subheading}>
          Данные приходят прямо из MiniStore API — без хардкода, без
          useEffect. Страница рендерится на сервере и сразу содержит
          актуальный список приложений.
        </p>
      </section>

      <section className={styles.grid}>
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </section>

      {apps.length === 0 && (
        <p className={styles.empty}>Приложений пока нет</p>
      )}
    </main>
  );
}
