import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Compass,
  ChevronRight,
  Quote,
  PlayCircle,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import PrayerGuide from './PrayerGuide'
import QiblaScreen from '../components/QiblaScreen'
import logoMihrab from '/fotos/logo1.png'

const FALLBACK_COORDS = { lat: 40.4168, lon: -3.7038 }

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
}

const PRAYER_COLORS = {
  Fajr:    { bg: 'bg-amber-50',  text: 'text-amber-500'  },
  Dhuhr:   { bg: 'bg-yellow-50', text: 'text-yellow-500' },
  Asr:     { bg: 'bg-orange-50', text: 'text-orange-500' },
  Maghrib: { bg: 'bg-rose-50',   text: 'text-rose-500'   },
  Isha:    { bg: 'bg-indigo-50', text: 'text-indigo-500' },
}

function formatTime(t) {
  if (!t) return '--:--'
  if (typeof t === 'string') return t.slice(0, 5)
  return '--:--'
}

function getNextPrayerInfo(timings) {
  const now = new Date()
  const currentMin = now.getHours() * 60 + now.getMinutes()
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  for (const name of prayers) {
    const [h, m] = timings[name].split(':').map(Number)
    if (h * 60 + m > currentMin) return { name, time: timings[name], isTomorrow: false }
  }
  return { name: 'Fajr', time: timings['Fajr'], isTomorrow: true }
}

function calcTimeLeft(targetTime, isTomorrow) {
  const now = new Date()
  const [h, m] = targetTime.split(':').map(Number)
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  if (isTomorrow) target.setDate(target.getDate() + 1)
  const diff = Math.max(0, target - now)
  const s = Math.floor(diff / 1000)
  return {
    hours:   String(Math.floor(s / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((s % 3600) / 60)).padStart(2, '0'),
    seconds: String(s % 60).padStart(2, '0'),
  }
}

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(FALLBACK_COORDS)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(FALLBACK_COORDS),
      { timeout: 8000, enableHighAccuracy: false }
    )
  })
}


/* ── Compact next-prayer inside prayer times ── */
function NextPrayerBadge({ nextPrayer, timeLeft, locationName, loading }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-4 py-3 mb-3 shadow-sm overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

      <div className="relative z-10">
        <p className="text-[9px] font-bold text-white/75 uppercase tracking-widest mb-0.5">
          Próximo rezo
        </p>
        <p className="text-sm font-black text-white">{nextPrayer?.name || '—'}</p>
      </div>

      {loading ? (
        <div className="h-7 w-28 bg-white/20 rounded-lg animate-pulse" />
      ) : (
        <div className="relative z-10 flex items-center gap-0.5">
          <span className="text-[22px] leading-none font-black text-white tabular-nums tracking-tight">
            {timeLeft?.hours || '00'}
          </span>
          <motion.span
            className="text-[18px] leading-none font-black text-white/70 mx-px"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >:</motion.span>
          <span className="text-[22px] leading-none font-black text-white tabular-nums tracking-tight">
            {timeLeft?.minutes || '00'}
          </span>
          <motion.span
            className="text-[18px] leading-none font-black text-white/70 mx-px"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >:</motion.span>
          <span className="text-[22px] leading-none font-black text-white tabular-nums tracking-tight">
            {timeLeft?.seconds || '00'}
          </span>
        </div>
      )}
    </div>
  )
}

/* ── HERO CTA: Guía de Rezo ── */
function PrayerGuideCard({ onPress }) {
  return (
    <motion.button
      onClick={onPress}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-full overflow-hidden rounded-3xl mb-4 shadow-xl text-left"
    >
      {/* deep warm gradient — same amber family, darker & richer */}
      <div
        className="relative px-5 pt-6 pb-6"
        style={{
          background: 'linear-gradient(135deg, #431407 0%, #7C2D12 45%, #C2410C 100%)',
        }}
      >
        {/* decorative glow */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FCD34D 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(124,45,18,0.7), transparent)' }} />

        {/* badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
          <div className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
          <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest">
            Lo más importante
          </span>
        </div>

        <h2 className="text-2xl font-black text-white leading-tight mb-1">
          Guía Paso a Paso
          <br />
          <span className="text-amber-300">para Rezar</span>
        </h2>
        <p className="text-xs text-white/70 mb-5 leading-relaxed">
          Sigue cada movimiento con audio, texto y transliteración. Perfecta para aprender.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5">
            <PlayCircle size={18} className="text-amber-300" strokeWidth={2.5} />
            <span className="text-sm font-bold text-white">Comenzar ahora</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <ChevronRight size={20} className="text-white/80" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.button>
  )
}

/* ── Secondary: Qibla ── */
function QiblaCard({ onPress }) {
  return (
    <motion.button
      onClick={onPress}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      whileTap={{ scale: 0.97 }}
      className="w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 px-4 py-4 flex items-center gap-4 mb-5 text-left"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #FCD34D, #F59E0B)' }}>
        <Compass size={22} className="text-white" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">Brújula Qibla</p>
        <p className="text-xs text-gray-500 mt-0.5">Dirección hacia La Meca</p>
      </div>
      <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
    </motion.button>
  )
}

/* ── Prayer times row ── */
function PrayerTimesRow({ timings, nextPrayer, timeLeft, locationName, loading }) {
  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  if (loading) {
    return (
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3 px-1">Horarios de Rezo</h3>
        <div className="h-14 bg-white/40 rounded-2xl mb-3 animate-pulse" />
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
          {prayerNames.map((p) => (
            <div key={p} className="bg-white/60 rounded-2xl p-3 min-w-[72px] animate-pulse flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto mb-2" />
              <div className="h-2.5 w-10 bg-gray-200 rounded mx-auto mb-1" />
              <div className="h-2.5 w-8 bg-gray-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-gray-800">Horarios de Rezo</h3>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Hoy</span>
      </div>
      <NextPrayerBadge
        nextPrayer={nextPrayer}
        timeLeft={timeLeft}
        locationName={locationName}
        loading={loading}
      />
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
        {prayerNames.map((name) => {
          const Icon = PRAYER_ICONS[name]
          const colors = PRAYER_COLORS[name]
          const isNext = nextPrayer?.name === name
          return (
            <motion.div
              key={name}
              whileTap={{ scale: 0.95 }}
              className="relative min-w-[72px] flex-shrink-0 rounded-2xl p-3 flex flex-col items-center"
              style={{
                background: isNext
                  ? 'linear-gradient(145deg, #FBBF24 0%, #F59E0B 100%)'
                  : 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(12px)',
                boxShadow: isNext ? '0 4px 20px rgba(245,158,11,0.35)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${isNext ? 'bg-white/30' : colors.bg}`}>
                <Icon size={15} className={isNext ? 'text-white' : colors.text} strokeWidth={2.3} />
              </div>
              <span className={`text-[10px] font-bold ${isNext ? 'text-white' : 'text-gray-600'}`}>
                {name}
              </span>
              <span className={`text-[11px] font-black tabular-nums mt-0.5 ${isNext ? 'text-white' : 'text-gray-900'}`}>
                {formatTime(timings[name])}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function VerseCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/70 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/60 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Quote size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">
            Versículo del día
          </p>
          <p className="text-xs text-gray-700 italic leading-relaxed">
            &ldquo;Recordadme, y Yo os recordaré. Sed agradecidos conmigo y no seáis ingratos.&rdquo;
          </p>
          <p className="text-[10px] text-gray-500 font-medium mt-1.5">
            Al-Baqarah · 2:152
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ElRezo() {
  const [timings, setTimings] = useState(null)
  const [locationName, setLocationName] = useState('Obteniendo ubicación...')
  const [loading, setLoading] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [nextPrayer, setNextPrayer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [userCoords, setUserCoords] = useState(null)
  const [currentScreen, setCurrentScreen] = useState('home')

  useEffect(() => {
    let cancelled = false
    async function fetchTimings() {
      const { lat, lon } = await getLocation()
      if (cancelled) return
      setUserCoords({ lat, lon })
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
        const data = await res.json()
        if (cancelled) return
        setTimings(data.data.timings)
        setLocationName(data.data.meta?.timezone || 'Ubicación actual')
      } catch {
        if (cancelled) return
        setTimings(null)
        setLocationName('Sin conexión')
      }
      if (!cancelled) setLoading(false)
    }
    fetchTimings()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!timings) return
    function tick() {
      const info = getNextPrayerInfo(timings)
      setNextPrayer(info)
      setTimeLeft(calcTimeLeft(info.time, info.isTomorrow))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timings])

  if (currentScreen === 'qibla' && userCoords) {
    return (
      <QiblaScreen
        latitude={userCoords.lat}
        longitude={userCoords.lon}
        onBack={() => setCurrentScreen('home')}
      />
    )
  }

  if (showGuide) {
    return <PrayerGuide onBack={() => setShowGuide(false)} />
  }

  return (
    <div className="pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Assalamu Alaikum
          </p>
          <h1 className="text-xl font-black text-gray-800 mt-0.5">Mihrab</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-white/60 flex items-center justify-center overflow-hidden p-1.5">
          <img src={logoMihrab} alt="Mihrab" className="w-full h-full object-contain" />
        </div>
      </div>

      <PrayerGuideCard onPress={() => setShowGuide(true)} />

      <QiblaCard onPress={() => setCurrentScreen('qibla')} />

      <PrayerTimesRow
        timings={timings}
        nextPrayer={nextPrayer}
        timeLeft={timeLeft}
        locationName={locationName}
        loading={loading}
      />

      <VerseCard />
    </div>
  )
}
