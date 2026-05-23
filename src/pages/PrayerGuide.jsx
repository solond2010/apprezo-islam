import { useState } from 'react'
import { ChevronLeft, User } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { pasosRezo } from './rezoData'
import KaraokePlayer from '../components/KaraokePlayer'

const prayers = [
  { id: 'Fajr', label: 'Fajr', time: 'Amanecer' },
  { id: 'Dhuhr', label: 'Dhuhr', time: 'Mediodía' },
  { id: 'Asr', label: 'Asr', time: 'Tarde' },
  { id: 'Maghrib', label: 'Maghrib', time: 'Atardecer' },
  { id: 'Isha', label: 'Isha', time: 'Noche' },
]

function PostureIcon({ paso }) {
  const isSuyud = paso.titulo.toLowerCase().includes('sujud')
  const isRuku = paso.titulo.toLowerCase().includes('ruku')
  const rotate = isSuyud ? '180' : isRuku ? '90' : ''

  return (
    <div
      className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-2 transition-transform shrink-0"
      style={rotate ? { transform: `rotateX(${rotate}deg)` } : {}}
    >
      <User size={20} className="text-emerald-600" />
    </div>
  )
}

export default function PrayerGuide({ onBack }) {
  const [selectedPrayer, setSelectedPrayer] = useState('Fajr')
  const { fontSize } = useSettings()

  return (
    <div className="pt-4 pb-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ChevronLeft size={16} />
        Volver al inicio
      </button>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Selecciona un Rezo</h2>

      <div className="grid grid-cols-5 gap-2 mb-8">
        {prayers.map((p) => {
          const active = selectedPrayer === p.id
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPrayer(p.id)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200 active:scale-90 ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-800'}`}>
                {p.label}
              </span>
              <span className="text-[9px] leading-tight opacity-70">{p.time}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-6 pb-8">
        {pasosRezo.map((paso) => (
          <div
            key={paso.id}
            id={`paso-${paso.id}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 px-5 py-5"
          >
            <div className="text-center mb-3">
              <PostureIcon paso={paso} />
              <h3 className="text-sm font-semibold text-emerald-600">{paso.titulo}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">{paso.accion}</p>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <KaraokePlayer
                segments={paso.segments}
                audioUrl={paso.audioUrl}
                fontSize={fontSize}
                pasoId={paso.id}
              />
            </div>

            <p className="text-xs text-gray-400 text-center leading-relaxed mt-3">
              {paso.traduccion}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
