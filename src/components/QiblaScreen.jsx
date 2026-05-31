import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'

const MECCA = { lat: 21.4225, lng: 39.8262 }

function toRad(deg) { return deg * (Math.PI / 180) }
function toDeg(rad) { return rad * (180 / Math.PI) }

function calculateQiblaAngle(userLat, userLng) {
  const φ1 = toRad(userLat)
  const φ2 = toRad(MECCA.lat)
  const Δλ = toRad(MECCA.lng - userLng)
  const x = Math.sin(Δλ) * Math.cos(φ2)
  const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  let angle = toDeg(Math.atan2(x, y))
  return (angle + 360) % 360
}

// Distancia en km hasta La Meca (fórmula del haversine)
function distanceToMecca(userLat, userLng) {
  const R = 6371
  const dLat = toRad(MECCA.lat - userLat)
  const dLng = toRad(MECCA.lng - userLng)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLat)) * Math.cos(toRad(MECCA.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function QiblaCompass({ latitude, longitude, darkMode }) {
  const [permissionState, setPermissionState] = useState('idle')
  const [deviceHeading, setDeviceHeading] = useState(null)
  const listenerRef = useRef(null)
  const smoothedHeading = useRef(0)
  const lastUpdate = useRef(0)
  const wasAligned = useRef(false)
  const SMOOTHING = 0.15

  const qiblaAngle = calculateQiblaAngle(latitude, longitude)
  const distanceKm = distanceToMecca(latitude, longitude)
  const needleRotation = deviceHeading !== null ? qiblaAngle - deviceHeading : qiblaAngle

  // ¿Está el móvil apuntando a la Qibla? (diferencia normalizada ≤ 7°)
  let diff = ((needleRotation % 360) + 360) % 360
  if (diff > 180) diff = 360 - diff
  const aligned = deviceHeading !== null && diff <= 7

  // Vibrar una vez al alinear
  useEffect(() => {
    if (aligned && !wasAligned.current) {
      if (navigator.vibrate) navigator.vibrate(60)
      wasAligned.current = true
    } else if (!aligned) {
      wasAligned.current = false
    }
  }, [aligned])

  const isIOS =
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'

  function startListening() {
    const handler = (e) => {
      const now = Date.now()
      if (now - lastUpdate.current < 50) return
      lastUpdate.current = now

      let raw = 0
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        raw = e.webkitCompassHeading
      } else if (e.alpha !== null) {
        raw = 360 - e.alpha
      }

      let delta = raw - smoothedHeading.current
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360
      smoothedHeading.current = (smoothedHeading.current + delta * SMOOTHING + 360) % 360

      setDeviceHeading(smoothedHeading.current)
    }

    window.addEventListener('deviceorientation', handler, true)
    listenerRef.current = handler
  }

  async function requestSensor() {
    setPermissionState('requesting')

    if (isIOS) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission()
        if (permission === 'granted') {
          setPermissionState('granted')
          startListening()
        } else {
          setPermissionState('denied')
        }
      } catch {
        setPermissionState('denied')
      }
    } else if ('DeviceOrientationEvent' in window) {
      setPermissionState('granted')
      startListening()
    } else {
      setPermissionState('unavailable')
    }
  }

  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener('deviceorientation', listenerRef.current, true)
        listenerRef.current = null
      }
    }
  }, [])

  if (permissionState === 'idle' || permissionState === 'requesting') {
    return (
      <div className={`rounded-3xl border shadow-lg p-6 flex flex-col items-center ${
        darkMode ? 'bg-[#1e1e1e]/70 backdrop-blur-md border-[#2a2a2a]' : 'bg-white/70 backdrop-blur-md border-white/60'
      }`}>
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="comp-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="white" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="92" fill="url(#comp-grad)" stroke="#FCD34D" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#FDE68A" strokeWidth="0.5" />
            <text x="100" y="22" textAnchor="middle" fill="#D97706" fontSize="13" fontWeight="800" fontFamily="system-ui">N</text>
            <text x="178" y="105" textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="600" fontFamily="system-ui">E</text>
            <text x="100" y="186" textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="600" fontFamily="system-ui">S</text>
            <text x="22" y="105" textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="600" fontFamily="system-ui">O</text>
            <circle cx="100" cy="100" r="6" fill="#F59E0B" />
          </svg>
        </div>
        {/* Info de distancia y ángulo */}
        <div className="mt-4 flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-white/10 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
            🕋 {distanceKm.toLocaleString('es')} km a La Meca
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {Math.round(qiblaAngle)}°
          </div>
        </div>
        <button
          onClick={requestSensor}
          disabled={permissionState === 'requesting'}
          className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 disabled:opacity-60 text-white rounded-2xl py-4 font-bold text-sm transition-all shadow-lg shadow-amber-500/30"
        >
          {permissionState === 'requesting' ? 'Activando...' : 'Activar brújula'}
        </button>
      </div>
    )
  }

  if (permissionState === 'denied') {
    return (
      <div className={`rounded-2xl border shadow-sm p-5 flex flex-col items-center ${
        darkMode ? 'bg-[#1e1e1e]/70 border-[#2a2a2a]' : 'bg-[#FFFBF2] border-[#EDE3D3]'
      }`}>
        <div className="relative w-52 h-52">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
            <text x="100" y="22" textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="600" fontFamily="system-ui">N</text>
            <text x="178" y="102" textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="600" fontFamily="system-ui">E</text>
            <text x="100" y="184" textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="600" fontFamily="system-ui">S</text>
            <text x="22" y="102" textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="600" fontFamily="system-ui">O</text>
          </svg>
        </div>
        <p className={`mt-5 text-sm text-center leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Permiso denegado. Ve a{' '}
          <strong className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Ajustes → Safari → Sensor de movimiento y rotación</strong>
          {' '}y actívalo.
        </p>
        <div className={`mt-4 px-3 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-white/10 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
          🕋 {distanceKm.toLocaleString('es')} km · Qibla {Math.round(qiblaAngle)}°
        </div>
      </div>
    )
  }

  const showStatic = permissionState === 'unavailable' || deviceHeading === null

  return (
    <div
      className="rounded-3xl border shadow-lg p-6 flex flex-col items-center transition-colors duration-300"
      style={{
        background: aligned
          ? (darkMode ? 'rgba(6,78,59,0.4)' : 'rgba(209,250,229,0.85)')
          : (darkMode ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.7)'),
        borderColor: aligned ? 'rgba(16,185,129,0.5)' : (darkMode ? '#2a2a2a' : 'rgba(255,255,255,0.6)'),
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg viewBox="0 0 200 200" width="100%" style={{ maxWidth: '240px' }}>
          <defs>
            <radialGradient id="comp-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>
            <linearGradient id="needle-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="92" fill="url(#comp-bg)" stroke="#FCD34D" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="78" fill="white" stroke="#FDE68A" strokeWidth="0.5"/>

          <line x1="100" y1="14" x2="100" y2="26" stroke="#D97706" strokeWidth="2"/>
          <line x1="100" y1="174" x2="100" y2="186" stroke="#d1d5db" strokeWidth="1"/>
          <line x1="14" y1="100" x2="26" y2="100" stroke="#d1d5db" strokeWidth="1"/>
          <line x1="174" y1="100" x2="186" y2="100" stroke="#d1d5db" strokeWidth="1"/>

          <text x="100" y="13" textAnchor="middle" fontSize="13" fill="#D97706" fontWeight="800" fontFamily="system-ui">N</text>
          <text x="100" y="198" textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600" fontFamily="system-ui">S</text>
          <text x="196" y="104" textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600" fontFamily="system-ui">E</text>
          <text x="7" y="104" textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600" fontFamily="system-ui">O</text>

          <g
            style={{
              transform: `rotate(${showStatic ? qiblaAngle : needleRotation}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <polygon points="100,30 92,100 108,100" fill="url(#needle-grad)" />
            <polygon points="100,170 95,100 105,100" fill="#FDE68A" />
            <rect x="92" y="20" width="16" height="16" rx="3" fill="#1a1a1a"/>
            <rect x="92" y="26" width="16" height="4" fill="#FCD34D"/>
          </g>

          <circle cx="100" cy="100" r="8" fill="white" stroke="#FCD34D" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="4" fill="#F59E0B"/>
        </svg>
      </div>

      {!showStatic && (
        aligned ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-5 flex items-center gap-2 rounded-full px-5 py-2.5 shadow-md"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <span className="text-base">✓</span>
            <span className="text-xs font-black text-white uppercase tracking-wide">
              ¡Alineado con la Qibla!
            </span>
          </motion.div>
        ) : (
          <div className={`mt-5 flex items-center gap-2 rounded-full px-4 py-2.5 border ${
            darkMode ? 'bg-white/10 border-white/10' : 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200'
          }`}>
            <span className="text-base">🕋</span>
            <span className={`text-xs font-bold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              Gira tu móvil hacia la flecha
            </span>
          </div>
        )
      )}

      {/* Distancia siempre visible */}
      <div className={`mt-3 px-3 py-1.5 rounded-full text-[11px] font-bold ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
        {distanceKm.toLocaleString('es')} km hasta La Meca · Qibla {Math.round(qiblaAngle)}°
      </div>

      {showStatic && (
        <p className={`mt-3 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Sensor de orientación no disponible. Usa el ángulo de arriba.
        </p>
      )}
    </div>
  )
}

function QiblaVerse({ darkMode }) {
  return (
    <div className={`rounded-3xl border shadow-sm p-5 ${
      darkMode ? 'bg-[#1e1e1e]/70 backdrop-blur-md border-[#2a2a2a]' : 'bg-white/70 backdrop-blur-md border-white/60'
    }`}>
      <p
        className={`text-right text-xl leading-loose mb-3 pb-3 border-b ${darkMode ? 'text-amber-300 border-[#2a2a2a]' : 'text-amber-700 border-amber-100'}`}
        dir="rtl"
      >
        وَجِّهْ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
      </p>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
        <div>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            Corán · Al-Baqarah
          </p>
          <p className={`text-[9px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            2:144 — Revelación auténtica
          </p>
        </div>
      </div>

      <p className={`text-xs leading-relaxed italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        &ldquo;Vuelve tu rostro en dirección de la Mezquita Sagrada. Y donde quiera que estéis,
        volveos hacia ella.&rdquo;
      </p>
    </div>
  )
}

export default function QiblaScreen({ latitude, longitude, onBack }) {
  const { darkMode } = useSettings()
  return (
    <div className="pt-4 pb-4">
      <div className="flex items-center gap-3 mb-5 px-1">
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-2xl backdrop-blur-md border shadow-sm flex items-center justify-center text-amber-600 font-bold text-xl active:scale-90 transition-transform ${
            darkMode ? 'bg-[#1e1e1e]/70 border-[#2a2a2a]' : 'bg-white/70 border-white/60'
          }`}
        >
          ←
        </button>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Dirección
          </p>
          <h1 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>Brújula Qibla</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <QiblaCompass latitude={latitude} longitude={longitude} darkMode={darkMode} />
        <QiblaVerse darkMode={darkMode} />
      </div>
    </div>
  )
}
