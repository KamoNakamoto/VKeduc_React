import { useState, useMemo, useEffect, JSX } from 'react'
import type { App } from './types'
import { fetchApps } from './api'

// Локальные картинки из assets (как в оригинале)
import music from './assets/music.jpg'
import tasks from './assets/tasks.jpg'
import games from './assets/games.jpg'
import photo from './assets/photo.jpg'
import fitness from './assets/fitness.jpg'
import chat from './assets/chat.jpg'

// Маппинг id → локальная картинка (fallback если сервер не отдаёт нужный image)
const localImages: Record<number, string> = {
  1: tasks,
  2: chat,
  3: games,
  4: photo,
  5: chat,
  6: music,
  7: photo,
  8: tasks,
}

const ALL = 'Все'

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState<string>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

interface HighlightProps {
  text: string
  query: string
}

function Highlight({ text, query }: HighlightProps): JSX.Element {
  if (!query.trim()) return <span>{text}</span>
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${safeQuery})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: 'rgba(139,92,246,0.35)', color: '#c4b5fd', borderRadius: '3px', padding: '0 2px' }}>{part}</mark>
          : part
      )}
    </span>
  )
}

const categoryLabels: Record<string, string> = {
  productivity: 'Продуктивность',
  development: 'Разработка',
  design: 'Дизайн',
  games: 'Игры',
  music: 'Музыка',
  health: 'Здоровье',
}

export default function App(): JSX.Element {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>(ALL)
  const [favorites, setFavorites] = useState<number[]>([])

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    async function loadApps(): Promise<void> {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchApps()
        setApps(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }
    loadApps()
  }, [])

  const categories: string[] = [ALL, ...new Set(apps.map((a) => a.category))]

  const filtered = useMemo<App[]>(() => {
    return apps.filter((app) => {
      const matchCat = activeTab === ALL || app.category === activeTab
      const matchSearch =
        app.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        app.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      return matchCat && matchSearch
    })
  }, [apps, activeTab, debouncedSearch])

  const toggleFavorite = (id: number): void => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 40%, #0a0f1a 100%)',
      color: '#e2e8f0',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Фоновые декоративные пятна */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 600px 400px at 10% 20%, rgba(139,92,246,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 500px 350px at 90% 80%, rgba(59,130,246,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 400px 300px at 50% 50%, rgba(16,185,129,0.03) 0%, transparent 70%)
        `
      }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        background: 'rgba(10,10,15,0.75)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}>⬡</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: '#f1f5f9' }}>
                Mini<span style={{ color: '#8b5cf6' }}>Store</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.5px', marginTop: -1 }}>APP MARKETPLACE</div>
            </div>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#94a3b8',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '6px 14px', borderRadius: 20, letterSpacing: '0.3px',
          }}>
            {filtered.length} {filtered.length === 1 ? 'приложение' : filtered.length < 5 ? 'приложения' : 'приложений'}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 80px', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
            letterSpacing: '-1.5px', lineHeight: 1.1,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 12,
          }}>
            Лучшие приложения<br />в одном месте
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>
            Открывайте, устанавливайте и управляйте любимыми приложениями
          </p>
        </div>

        {/* Поиск */}
        <div style={{ position: 'relative', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
          <span style={{
            position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, color: '#475569', pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Поиск приложений..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px 20px 14px 46px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#f1f5f9', fontSize: 15,
              outline: 'none', transition: 'all 0.2s',
              backdropFilter: 'blur(12px)',
            }}
            onFocus={e => {
              e.target.style.border = '1px solid rgba(139,92,246,0.5)'
              e.target.style.background = 'rgba(139,92,246,0.05)'
              e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.08)'
            }}
            onBlur={e => {
              e.target.style.border = '1px solid rgba(255,255,255,0.09)'
              e.target.style.background = 'rgba(255,255,255,0.04)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Категории */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48, justifyContent: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: '8px 20px', borderRadius: 24, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                ...(activeTab === cat ? {
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
                  transform: 'translateY(-1px)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)',
                })
              }}
            >
              {cat === ALL ? 'Все' : (categoryLabels[cat] ?? cat)}
            </button>
          ))}
        </div>

        {/* Загрузка */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(139,92,246,0.2)',
              borderTop: '3px solid #8b5cf6',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#475569', fontSize: 14 }}>Загрузка приложений...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
            <div style={{ fontSize: 48 }}>⚠️</div>
            <p style={{ color: '#f87171', fontWeight: 600 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px', borderRadius: 12, border: 'none',
                background: 'rgba(248,113,113,0.1)', color: '#f87171',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                border: '1px solid rgba(248,113,113,0.2)',
              }}
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Сетка карточек */}
        {!loading && !error && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}>
              {filtered.map((app, index) => (
                <div
                  key={app.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    animation: `fadeUp 0.4s ease both`,
                    animationDelay: `${index * 60}ms`,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.transform = 'translateY(-6px)'
                    el.style.border = '1px solid rgba(139,92,246,0.3)'
                    el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)'
                    el.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.transform = 'translateY(0)'
                    el.style.border = '1px solid rgba(255,255,255,0.07)'
                    el.style.boxShadow = 'none'
                    el.style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  {/* Картинка */}
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img
                      src={localImages[app.id] ?? app.image}
                      alt={app.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {/* Градиент снизу */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.1) 50%, transparent 100%)',
                    }} />

                    {/* Кнопка избранного */}
                    <button
                      onClick={() => toggleFavorite(app.id)}
                      style={{
                        position: 'absolute', top: 14, right: 14,
                        width: 36, height: 36, borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(0,0,0,0.35)',
                        backdropFilter: 'blur(8px)',
                        cursor: 'pointer', fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        color: favorites.includes(app.id) ? '#f43f5e' : '#94a3b8',
                      }}
                    >
                      {favorites.includes(app.id) ? '♥' : '♡'}
                    </button>

                    {/* Бейдж цены */}
                    <div style={{ position: 'absolute', top: 14, left: 14 }}>
                      {app.free ? (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          background: 'rgba(16,185,129,0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#fff', padding: '4px 10px', borderRadius: 20,
                          letterSpacing: '0.3px',
                        }}>Бесплатно</span>
                      ) : (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          background: 'rgba(0,0,0,0.5)',
                          backdropFilter: 'blur(8px)',
                          color: '#e2e8f0', padding: '4px 10px', borderRadius: 20,
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}>{app.price} ₽</span>
                      )}
                    </div>

                    {/* Рейтинг поверх картинки внизу */}
                    <div style={{
                      position: 'absolute', bottom: 14, right: 14,
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                      padding: '4px 10px', borderRadius: 20,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                      <span style={{ color: '#fbbf24', fontSize: 12 }}>★</span>
                      <span style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 700 }}>{app.rating}</span>
                    </div>
                  </div>

                  {/* Контент карточки */}
                  <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        color: '#8b5cf6',
                        background: 'rgba(139,92,246,0.12)',
                        padding: '4px 10px', borderRadius: 8,
                      }}>
                        {categoryLabels[app.category] ?? app.category}
                      </span>
                      <span style={{ fontSize: 12, color: '#475569' }}>↓ {app.downloads}</span>
                    </div>

                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px', margin: 0 }}>
                      <Highlight text={app.title} query={debouncedSearch} />
                    </h3>

                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0, flex: 1 }}>
                      <Highlight text={app.description} query={debouncedSearch} />
                    </p>

                    <button
                      style={{
                        marginTop: 8, width: '100%', padding: '12px',
                        borderRadius: 14, border: 'none',
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
                        color: '#c4b5fd', fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.2s',
                        border: '1px solid rgba(139,92,246,0.2)',
                        letterSpacing: '0.2px',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.3)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.border = '1px solid transparent'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))'
                        e.currentTarget.style.color = '#c4b5fd'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.border = '1px solid rgba(139,92,246,0.2)'
                      }}
                    >
                      Установить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Пусто */}
            {filtered.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0', gap: 12 }}>
                <div style={{ fontSize: 56, opacity: 0.2 }}>◻</div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#475569' }}>Ничего не нашлось</p>
                <p style={{ fontSize: 14, color: '#334155' }}>Попробуйте другие ключевые слова</p>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #334155; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 3px; }
      `}</style>
    </div>
  )
}