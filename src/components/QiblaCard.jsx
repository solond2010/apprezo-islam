import { useState, useEffect, useRef } from 'react'
import { Compass, ChevronRight } from 'lucide-react'

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

export default function QiblaCard({ latitude, longitude }) {
  const [open, setOpen] = useState(false)
  const [deviceAlpha, setDeviceAlpha] = useState(null)
  const [error, setError] = useState(null)
  const [permitted, setPermitted] = useState(false)
  const listenerRef = useRef(null)

  const qiblaAngle = calculateQiblaAngle(latitude, longitude)
  const needleAngle = deviceAlpha !== null ? (qiblaAngle - deviceAlpha + 360) % 360 : null

  useEffect(() => {
    if (!open) return

    let cancelled = false

    async function startSensor() {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          const state = await DeviceOrientationEvent.requestPermission()
          if (state !== 'granted') {
            if (!cancelled) setError('Permiso denegado. Ve a Ajustes > Safari > Motion & Orientation.')
            return
          }
        } catch {
          if (!cancelled) setError('No se pudo solicitar permiso.')
          return
        }
      }

      setPermitted(true)

      const handler = (e) => {
        if (e.alpha !== null) {
          setDeviceAlpha(e.alpha)
        }
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
      setDeviceAlpha(null)
      setPermitted(false)
      setError(null)
    }
  }, [open])

  const hasSensor = deviceAlpha !== null
  const showError = error && !hasSensor

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left active:bg-gray-50 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Compass size={16} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-800">Brújula Qibla</span>
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-semibold leading-none">NUEVO</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Dirección hacia La Meca</p>
        </div>
        <ChevronRight
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {showError ? (
            <div className="text-xs text-gray-400 text-center py-6">{error}</div>
          ) : (
            <div className="flex flex-col items-center py-3">
              <div className="relative w-44 h-44">
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
                    const x = 100 + r * Math.cos(rad)
                    const y = 100 + r * Math.sin(rad)
                    return (
                      <text
                        key={label}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-gray-400"
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
                    const x1 = 100 + r1 * Math.cos(rad)
                    const y1 = 100 + r1 * Math.sin(rad)
                    const x2 = 100 + r2 * Math.cos(rad)
                    const y2 = 100 + r2 * Math.sin(rad)
                    return (
                      <line
                        key={angle}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isCardinal ? '#9ca3af' : '#d1d5db'}
                        strokeWidth={isCardinal ? 1.5 : 0.8}
                      />
                    )
                  })}

                  <g
                    style={{
                      transform: `rotate(${needleAngle ?? qiblaAngle}deg)`,
                      transformOrigin: '100px 100px',
                      transition: 'transform 300ms ease',
                    }}
                  >
                    <polygon points="100,15 94,100 100,90 106,100" fill="#10b981" />
                    <polygon points="100,185 94,100 100,110 106,100" fill="#9ca3af" />
                    <circle cx="100" cy="100" r="5" fill="#1e293b" />
                  </g>

                  <g
                    style={{
                      transform: `rotate(${qiblaAngle}deg)`,
                      transformOrigin: '100px 100px',
                    }}
                  >
                    <rect
                      x="93"
                      y="8"
                      width="14"
                      height="14"
                      rx="2"
                      fill="#1e293b"
                      stroke="#e5e7eb"
                      strokeWidth="0.5"
                    />
                    <line x1="100" y1="8" x2="100" y2="14" stroke="#d4a853" strokeWidth="1" />
                    <rect x="95" y="10" width="10" height="2" rx="0.5" fill="#e5e7eb" opacity="0.4" />
                  </g>
                </svg>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg font-bold text-slate-800 tabular-nums">{Math.round(qiblaAngle)}°</span>
                <span className="text-sm text-gray-500">hacia La Meca</span>
              </div>

              {!hasSensor && !error && (
                <p className="text-xs text-gray-400 mt-2">Sensor no disponible. Ángulo estático mostrado.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
