import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Sunrise, Sun, CloudSun, Sunset, Moon, ArrowRight, Compass } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import PrayerGuide from './PrayerGuide'

const FALLBACK_COORDS = { lat: 40.4168, lon: -3.7038 }

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
}

const PRAYER_LABELS = {
  Fajr: 'Fajr',
  Sunrise: 'Shuruq',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
}

function formatTime(t) {
  if (!t) return '--:--'
  const hours = t.hours?.toString().padStart(2, '0') || t
  const minutes = t.minutes?.toString().padStart(2, '0') || '00'
  return `${hours}:${minutes}`
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

function KaabaSilhouette() {
  return (
    <svg
      viewBox="0 0 500 120"
      className="absolute bottom-0 left-0 right-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMax meet"
      style={{ color: 'rgba(0,0,0,0.12)' }}
      aria-hidden="true"
    >
      <rect x="0" y="112" width="500" height="8" fill="currentColor" rx="2" />
      <rect x="140" y="100" width="220" height="12" fill="currentColor" rx="2" />
      <rect x="160" y="45" width="6" height="55" fill="currentColor" rx="1.5" />
      <circle cx="163" cy="42" r="4" fill="currentColor" />
      <polygon points="163,35 158,46 168,46" fill="currentColor" />
      <rect x="334" y="45" width="6" height="55" fill="currentColor" rx="1.5" />
      <circle cx="337" cy="42" r="4" fill="currentColor" />
      <polygon points="337,35 332,46 342,46" fill="currentColor" />
      <rect x="210" y="55" width="80" height="45" fill="currentColor" rx="2" />
      <rect x="247" y="55" width="6" height="25" fill="currentColor" rx="1" opacity="0.4" />
      <path d="M 218 55 Q 250 38 282 55" fill="currentColor" />
      <rect x="243" y="78" width="14" height="22" fill="rgba(0,0,0,0.06)" rx="1" />
    </svg>
  )
}

function HeroSection() {
  const { darkMode } = useSettings()
  return (
    <div className="relative h-52 -mx-4 -mt-4 mb-6 overflow-hidden">
      <img
        src="https://images.pexels.com/photos/1671478/pexels-photo-1671478.jpeg?auto=compress&cs=tinysrgb&w=800"
        alt="Amanecer pastel"
        className="w-full h-full object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-white/30 ${darkMode ? 'to-[#1e1e1e]' : 'to-white'}`} />
      <KaabaSilhouette />
      <div className="absolute bottom-5 left-0 right-0 px-4">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">El Rezo</h1>
        <p className="text-sm text-white/80 drop-shadow">Tu guía para aprender a rezar</p>
      </div>
    </div>
  )
}

function PrayerTimesCard({ timings, locationName }) {
  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 px-5 py-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={14} className="text-emerald-600" />
        <span className="text-xs text-gray-500">{locationName}</span>
      </div>

      <div className="space-y-3">
        {prayerNames.map((name) => {
          const Icon = PRAYER_ICONS[name]
          return (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Icon size={14} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {formatTime(timings[name])}
              </span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-gray-100 mt-4 pt-3 flex items-center gap-2">
        <Compass size={12} className="text-gray-400" />
        <span className="text-xs text-gray-400">Horarios calculados para hoy</span>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 px-5 py-5 mb-5 animate-pulse">
      <div className="h-3 w-32 bg-gray-200 rounded mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

export default function ElRezo() {
  const [timings, setTimings] = useState(null)
  const [locationName, setLocationName] = useState('Obteniendo ubicación...')
  const [loading, setLoading] = useState(true)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchTimings() {
      const { lat, lon } = await getLocation()
      if (cancelled) return

      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`
        )
        const data = await res.json()
        if (cancelled) return
        setTimings(data.data.timings)
        setLocationName(
          data.data.meta?.timezone
            ? `Ubicación actual • ${data.data.meta.timezone}`
            : 'Ubicación actual'
        )
      } catch {
        if (cancelled) return
        setTimings(null)
        setLocationName('No se pudieron obtener los horarios')
      }
      if (!cancelled) setLoading(false)
    }
    fetchTimings()
    return () => { cancelled = true }
  }, [])

  if (showGuide) {
    return <PrayerGuide onBack={() => setShowGuide(false)} />
  }

  return (
    <div className="pt-4">
      <HeroSection />

      {loading ? <LoadingSkeleton /> : (
        <PrayerTimesCard timings={timings} locationName={locationName} />
      )}

      <button
        onClick={() => setShowGuide(true)}
        className="w-full flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl px-5 py-4 transition-all duration-200 shadow-sm mb-6"
      >
        <div className="text-left">
          <span className="text-sm font-semibold">Guía Paso a Paso para Rezar</span>
          <p className="text-xs text-emerald-100 mt-0.5">Sigue cada movimiento con audio y texto</p>
        </div>
        <ArrowRight size={18} />
      </button>
    </div>
  )
}
