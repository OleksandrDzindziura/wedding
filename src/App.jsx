import { useState, useEffect } from 'react'
import './App.css'

// ── CONFIG — змініть ці дані на свої ──
const WEDDING = {
  bride: 'Валентин',
  groom: 'Надія',
  date: '2026-06-05', // YYYY-MM-DD
  dateDisplay: '5 червня 2026',
  churchTime: '11:30',
  church: 'Храм Успіння Пресвятої Богородиці',
  churchAddress: 'смт. Новий Яричів',
  banquetTime: '14:00',
  venue: 'FoREST Park',
  address: 'Урочище Ланок, 1, Пониковиця',
  mapsUrl: 'https://maps.google.com/?q=Урочище+Ланок+1+Пониковиця',
  rsvpDeadline: '5 травня',
  phone: '+380 XX XXX XX XX',
}

function useCountdown(targetDate) {
  const [time, setTime] = useState(getTime)

  function getTime() {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function Countdown({ date }) {
  const { days, hours, minutes, seconds } = useCountdown(date)
  return (
    <section className="countdown-section">
      <h2>До урочистого дня</h2>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-number">{String(days).padStart(2, '0')}</span>
          <span className="countdown-label">Днів</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-item">
          <span className="countdown-number">{String(hours).padStart(2, '0')}</span>
          <span className="countdown-label">Годин</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-item">
          <span className="countdown-number">{String(minutes).padStart(2, '0')}</span>
          <span className="countdown-label">Хвилин</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-item">
          <span className="countdown-number">{String(seconds).padStart(2, '0')}</span>
          <span className="countdown-label">Секунд</span>
        </div>
      </div>
    </section>
  )
}

function RsvpForm() {
  const [form, setForm] = useState({ name: '', guests: '1', dietary: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await fetch('https://script.google.com/macros/s/AKfycbzCB9XHlgOMZRurUI4qR28t7Htx8OVIFM7NIjKQnONAH-Xk5Rtl4-YjE_nGFRTA96IrtA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {}
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rsvp-success">
        Дякуємо! Ми з нетерпінням чекаємо Вас на нашому святі ✦
      </div>
    )
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Ваше ім'я та прізвище"
        value={form.name}
        onChange={handleChange}
        required
      />
      <select name="guests" value={form.guests} onChange={handleChange}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <option key={n} value={n}>{n} {n === 1 ? 'гість' : n < 5 ? 'гостя' : 'гостей'}</option>
        ))}
      </select>
      <input
        name="dietary"
        placeholder="Харчові обмеження (необов'язково)"
        value={form.dietary}
        onChange={handleChange}
      />
      <textarea
        name="message"
        placeholder="Побажання або коментар (необов'язково)"
        value={form.message}
        onChange={handleChange}
      />
      <button type="submit" className="btn-rsvp">Підтвердити присутність</button>
    </form>
  )
}

export default function App() {
  return (
    <div className="app">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-ornament">✦ ✦ ✦</div>
        <p className="hero-subtitle">Запрошують Вас на своє весілля</p>
        <h1>
          {WEDDING.bride}
          <span>&amp;</span>
          {WEDDING.groom}
        </h1>
        <div className="hero-divider">✦</div>
        <p className="hero-date">{WEDDING.dateDisplay}</p>
        <p className="hero-location">{WEDDING.churchAddress} · {WEDDING.churchTime} &nbsp;|&nbsp; {WEDDING.venue} · {WEDDING.banquetTime}</p>
        <div className="scroll-hint">
          <span>Гортайте</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ── Countdown ── */}
      <Countdown date={WEDDING.date} />

      {/* ── Our Day ── */}
      <div className="section">
        <p className="section-label">Наш день</p>
        <h2>5 червня 2026</h2>
        <div className="rings-icon">
          <svg width="80" height="44" viewBox="0 0 80 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="22" r="18" stroke="#c9a96e" strokeWidth="3" fill="none"/>
            <circle cx="52" cy="22" r="18" stroke="#c9a96e" strokeWidth="3" fill="none"
              style={{clipPath: 'none'}}/>
            {/* overlap mask — права частина лівого кільця перекриває ліву частину правого */}
            <path d="M40 6.2 A18 18 0 0 1 40 37.8" stroke="#faf7f2" strokeWidth="4" fill="none"/>
          </svg>
        </div>
        <div className="gold-divider" />
        <p>
          Щиро запрошуємо Вас розділити з нами найважливіший день у нашому житті.
          Ваша присутність прикрасить наше свято і залишить незабутні спогади на все життя.
          З повагою та любов'ю — Валентин та Надія.
        </p>
      </div>

      {/* ── Program ── */}
      <div className="section">
        <p className="section-label">Програма свята</p>
        <h2>День нашого весілля</h2>
        <div className="gold-divider" />

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-content">
              <p className="timeline-time">11:30</p>
              <p className="timeline-title">Вінчання</p>
              <p className="timeline-desc">{WEDDING.church}<br />{WEDDING.churchAddress}</p>
            </div>
            <div className="timeline-dot" />
            <div className="timeline-content" />
          </div>
          <div className="timeline-item">
            <div className="timeline-content" />
            <div className="timeline-dot" />
            <div className="timeline-content">
              <p className="timeline-time">14:00</p>
              <p className="timeline-title">Весільний банкет</p>
              <p className="timeline-desc">{WEDDING.venue}<br />{WEDDING.address}</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <p className="timeline-time">Вечір</p>
              <p className="timeline-title">Танці та свято</p>
              <p className="timeline-desc">Музика, тости та незабутні моменти</p>
            </div>
            <div className="timeline-dot" />
            <div className="timeline-content" />
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="details-grid">
        <div className="detail-card">
          <div className="detail-icon">⛪</div>
          <h3>Вінчання</h3>
          <p>{WEDDING.church}<br />{WEDDING.churchAddress}<br />о {WEDDING.churchTime}</p>
        </div>
        <div className="detail-card">
          <div className="detail-icon">🥂</div>
          <h3>Банкет</h3>
          <p>{WEDDING.venue}<br />{WEDDING.address}<br />о {WEDDING.banquetTime}</p>
          <p style={{ marginTop: '12px' }}>
            <a href={WEDDING.mapsUrl} target="_blank" rel="noreferrer"
               style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Маршрут →
            </a>
          </p>
        </div>
        <div className="detail-card">
          <div className="detail-icon">👗</div>
          <h3>Дрес-код</h3>
          <p>Урочистий одяг</p>
        </div>
        <div className="detail-card">
          <div className="detail-icon">📞</div>
          <h3>Контакт</h3>
          <p>Будь-які питання:</p>
          <p>Валентин: <a href="tel:+380989722925" style={{color:'var(--gold)', textDecoration:'none'}}>098 972 29 25</a></p>
          <p>Надія:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:+380637138805" style={{color:'var(--gold)', textDecoration:'none'}}>063 713 88 05</a></p>
        </div>
      </div>

      {/* ── Деталі ── */}
      <div className="section">
        <p className="section-label">Деталі</p>
        <h2>Кілька слів про подарунки</h2>
        <div className="gold-divider" />
        <p>Просимо Вас не дарувати нам квіти, ми не встигнемо насолодитися їх красою.</p>
        <p className="details-heart">♡</p>
        <p>Приємним компліментом для нас буде, якщо ви замість квітів вирішите подарувати нам пляшку алкогольного напою для нашої колекції, яку ми відкриємо на найближчому нашому спільному святі.</p>
        <p className="details-heart">♡</p>
        <p>Якщо ви хочете подарувати нам цінний та потрібний подарунок, ми будемо дуже вдячні за вклад у бюджет нашої молодої сім'ї.</p>
      </div>

      {/* ── RSVP ── */}
      <section className="rsvp-section">
        <p className="section-label">Підтвердження</p>
        <h2>Будете з нами?</h2>
        <p>Просимо підтвердити до {WEDDING.rsvpDeadline}</p>
        <RsvpForm />
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>{WEDDING.bride} & {WEDDING.groom}</span>
        &nbsp;·&nbsp;{WEDDING.dateDisplay}
      </footer>
    </div>
  )
}
