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
  const [deviceAlpha, setDeviceAlpha] = useState(null)
  const [error, setError] = useState(null)
  const listenerRef = useRef(null)

  const qiblaAngle = calculateQiblaAngle(latitude, longitude)
  const heading = deviceAlpha !== null ? deviceAlpha : 0

  useEffect(() => {
    let cancelled = false

    async function startSensor() {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          const state = await DeviceOrientationEvent.requestPermission()
          if (state !== 'granted') {
            if (!cancelled) setError('Permiso denegado')
            return
          }
        } catch {
          if (!cancelled) setError('No se pudo solicitar permiso')
          return
        }
      }

      const handler = (e) => {
        if (e.alpha !== null) setDeviceAlpha(e.alpha)
      }
      window.addEventListener('deviceorientation', handler)
      listenerRef.current = handler
    }

    startSensor()

    return () => {
      cancelled = true
      if (listenerRef.current) {
        window.removeEventListener('deviceorientation', listenerRef.current)
        listenerRef.current = null
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
      {error ? (
        <div className="text-xs text-gray-400 text-center py-8">{error}</div>
      ) : (
        <>
          <div className="relative w-52 h-52">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="86" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />

              {[
                { label: 'N', angle: 0 },
                { label: 'E', angle: 90 },
                { label: 'S', angle: 180 },
                { label: 'O', angle: 270 },
              ].map(({ label, angle }) => {
                const rad = toRad(angle - 90)
                const r = 78
                return (
                  <text
                    key={label}
                    x={100 + r * Math.cos(rad)}
                    y={100 + r * Math.sin(rad)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#9ca3af"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="system-ui"
                  >
                    {label}
                  </text>
                )
              })}

              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                const rad = toRad(angle - 90)
                const isCardinal = angle % 90 === 0
                const r1 = isCardinal ? 84 : 87
                const r2 = 92
                return (
                  <line
                    key={angle}
                    x1={100 + r1 * Math.cos(rad)}
                    y1={100 + r1 * Math.sin(rad)}
                    x2={100 + r2 * Math.cos(rad)}
                    y2={100 + r2 * Math.sin(rad)}
                    stroke={isCardinal ? '#9ca3af' : '#d1d5db'}
                    strokeWidth={isCardinal ? 1.5 : 0.8}
                  />
                )
              })}

              <g
                style={{
                  transform: `rotate(${-heading}deg)`,
                  transformOrigin: '100px 100px',
                  transition: 'transform 300ms ease',
                }}
              >
                <polygon points="100,28 94,100 106,100" fill="#9ca3af" />
                <polygon points="100,172 94,100 106,100" fill="#e5e7eb" />
              </g>

              <g
                style={{
                  transform: `rotate(${qiblaAngle - heading}deg)`,
                  transformOrigin: '100px 100px',
                  transition: 'transform 300ms ease',
                }}
              >
                <polygon points="100,24 94,96 106,96" fill="#10b981" />
                <rect x="93" y="12" width="14" height="14" rx="2.5" fill="#1a1a1a" />
                <rect x="93" y="17" width="14" height="2.5" fill="#c9a227" />
              </g>

              <circle cx="100" cy="100" r="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="100" cy="100" r="4" fill="#10b981" />
            </svg>
          </div>

          <div className="mt-4 flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 border border-emerald-100">
            <span className="text-lg">📱</span>
            <span className="text-xs font-semibold text-emerald-600">
              Apunta tu móvil hacia la flecha verde 🕋
            </span>
          </div>

          {!deviceAlpha && !error && (
            <p className="text-xs text-gray-400 mt-3">
              Sensor de orientación no disponible. Ángulo estático mostrado.
            </p>
          )}
        </>
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
