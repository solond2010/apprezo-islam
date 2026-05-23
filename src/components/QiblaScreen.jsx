import { useState, useEffect, useRef } from 'react'

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

function QiblaCompass({ latitude, longitude }) {
  const [permissionState, setPermissionState] = useState('idle')
  const [deviceHeading, setDeviceHeading] = useState(null)
  const listenerRef = useRef(null)
  const smoothedHeading = useRef(0)
  const lastUpdate = useRef(0)
  const SMOOTHING = 0.15

  const qiblaAngle = calculateQiblaAngle(latitude, longitude)
  const needleRotation = deviceHeading !== null ? qiblaAngle - deviceHeading : qiblaAngle

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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
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
        <button
          onClick={requestSensor}
          disabled={permissionState === 'requesting'}
          className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 text-white rounded-2xl py-4 font-semibold text-sm transition-all"
        >
          {permissionState === 'requesting' ? '⌛ Activando...' : '🧭 Activar brújula'}
        </button>
      </div>
    )
  }

  if (permissionState === 'denied') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
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
        <p className="mt-5 text-sm text-gray-500 text-center leading-relaxed">
          Permiso denegado. Ve a{' '}
          <strong className="text-gray-700">Ajustes → Safari → Sensor de movimiento y rotación</strong>
          {' '}y actívalo.
        </p>
      </div>
    )
  }

  const showStatic = permissionState === 'unavailable' || deviceHeading === null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg viewBox="0 0 200 200" width="100%" style={{ maxWidth: '220px' }}>
          <circle cx="100" cy="100" r="90" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="75" fill="white" stroke="#f3f4f6" strokeWidth="0.5"/>

          <line x1="100" y1="12" x2="100" y2="24" stroke="#d1d5db" strokeWidth="1.5"/>
          <line x1="100" y1="176" x2="100" y2="188" stroke="#d1d5db" strokeWidth="1"/>
          <line x1="12" y1="100" x2="24" y2="100" stroke="#d1d5db" strokeWidth="1"/>
          <line x1="176" y1="100" x2="188" y2="100" stroke="#d1d5db" strokeWidth="1"/>

          <text x="100" y="11" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="700" fontFamily="system-ui">N</text>
          <text x="100" y="196" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="system-ui">S</text>
          <text x="196" y="104" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="system-ui">E</text>
          <text x="7" y="104" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="system-ui">O</text>

          <polygon points="100,28 95,100 105,100" fill="#9ca3af"/>
          <polygon points="100,172 95,100 105,100" fill="#e5e7eb"/>

          <g
            style={{
              transform: `rotate(${showStatic ? qiblaAngle : needleRotation}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <polygon points="100,32 94,96 106,96" fill="#10b981"/>
            <rect x="93" y="22" width="14" height="14" rx="2" fill="#1a1a1a"/>
            <rect x="93" y="27" width="14" height="3" fill="#c9a227"/>
          </g>

          <circle cx="100" cy="100" r="7" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <circle cx="100" cy="100" r="3.5" fill="#10b981"/>
        </svg>
      </div>

      {!showStatic && (
        <div className="mt-4 flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 border border-emerald-100">
          <span className="text-lg">📱</span>
          <span className="text-xs font-semibold text-emerald-600">
            Apunta tu móvil hacia la flecha verde 🕋
          </span>
        </div>
      )}

      {showStatic && (
        <p className="mt-4 text-xs text-gray-400 text-center">
          Sensor de orientación no disponible.
          <br />
          Ángulo Qibla: <strong className="text-gray-600">{Math.round(qiblaAngle)}°</strong>
        </p>
      )}
    </div>
  )
}

function QiblaVerse() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p
        className="text-right text-emerald-600 text-lg leading-loose mb-3 pb-3 border-b border-emerald-50"
        dir="rtl"
      >
        وَجِّهْ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
      </p>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-0.5 h-7 bg-emerald-500 rounded-full" />
        <div>
          <p className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest">
            Corán · Al-Baqarah
          </p>
          <p className="text-[8px] text-gray-400 mt-0.5">
            2:144 — Revelación auténtica
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed italic">
        &ldquo;Vuelve tu rostro en dirección de la Mezquita Sagrada. Y donde quiera que estéis,
        volveos hacia ella.&rdquo;
      </p>
    </div>
  )
}

export default function QiblaScreen({ latitude, longitude, onBack }) {
  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-emerald-500 font-bold text-lg"
        >
          ←
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900">Brújula Qibla</h1>
          <p className="text-xs text-gray-400">Dirección hacia La Meca</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4">
        <QiblaCompass latitude={latitude} longitude={longitude} />
        <QiblaVerse />
      </div>
    </div>
  )
}
