import type { App } from "../types";
import styles from "./AppCard.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  productivity: "Продуктивность",
  development: "Разработка",
  design: "Дизайн",
  games: "Игры",
  music: "Музыка",
  health: "Здоровье",
};

export default function AppCard({ app }: { app: App }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={app.image} alt={app.title} className={styles.image} />
        <span className={styles.priceTag}>
          {app.free ? "Бесплатно" : `${app.price} $`}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>
            {CATEGORY_LABELS[app.category] ?? app.category}
          </span>
          <span className={styles.rating}>★ {app.rating}</span>
        </div>

        <h3 className={styles.title}>{app.title}</h3>
        <p className={styles.description}>{app.description}</p>

        <div className={styles.footer}>
          <span className={styles.downloads}>↓ {app.downloads}</span>
        </div>
      </div>
    </article>
  );
}
