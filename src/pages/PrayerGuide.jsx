import { useState, useRef, useMemo, useEffect } from 'react'
import { ChevronLeft, Play, StopCircle } from 'lucide-react'
import { PRAYER_RAKAATS, getStepsForRakaa } from '../data/prayerData'

const PRAYERS = [
  { id: 'fajr',    label: 'Fajr',    desc: '2 rakaas' },
  { id: 'dhuhr',   label: 'Dhuhr',   desc: '4 rakaas' },
  { id: 'asr',     label: 'Asr',     desc: '4 rakaas' },
  { id: 'maghrib', label: 'Maghrib', desc: '3 rakaas' },
  { id: 'isha',    label: 'Isha',    desc: '4 rakaas' },
]

const POSITION_ICONS = {
  standing: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="17" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="12" y1="17" x2="8" y2="22" />
      <line x1="12" y1="17" x2="16" y2="22" />
    </svg>
  ),
  bowing: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="5" r="3" />
      <path d="M14 8 Q8 12 5 18" />
      <line x1="5" y1="18" x2="3" y2="22" />
      <line x1="9" y1="13" x2="6" y2="17" />
      <line x1="12" y1="11" x2="9" y2="16" />
    </svg>
  ),
  prostrating: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2.8" />
      <path d="M6 15 Q12 8 18 15" />
      <rect x="7" y="15" width="10" height="2.5" rx="1" />
      <line x1="7" y1="17.5" x2="5" y2="21" />
      <line x1="17" y1="17.5" x2="19" y2="21" />
    </svg>
  ),
  sitting: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="12" y1="14" x2="7" y2="20" />
      <line x1="12" y1="14" x2="17" y2="20" />
      <line x1="6" y1="14" x2="18" y2="14" />
    </svg>
  ),
}

function PostureIcon({ position }) {
  return (
    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
      {POSITION_ICONS[position] || POSITION_ICONS.standing}
    </div>
  )
}

function RakaaHeader({ rakaa, total }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-3">
      <div className="flex-1 h-px bg-gray-200" />
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex gap-1">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i + 1 === rakaa ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Rakaa {rakaa} de {total}
        </span>
      </div>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

function StepCard({ step, stepNumber, playingAudioKey, onPlayAudio }) {
  const sessionKey = step.audioUrls?.[0]
  const isPlaying = playingAudioKey === sessionKey

  return (
    <div className="bg-[#FFFBF2] rounded-2xl border border-[#EDE3D3] px-4 py-4 mb-3">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <PostureIcon position={step.position} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-300 font-medium">#{stepNumber}</span>
            <h3 className="text-sm font-semibold text-gray-900">{step.name}</h3>
            {step.repeat > 1 && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                ×{step.repeat}
              </span>
            )}
          </div>
          <p className="text-xs text-emerald-500 mt-0.5" dir="rtl">{step.nameAr}</p>
        </div>
      </div>

      {/* Instrucciones */}
      <p className="text-xs text-gray-500 leading-relaxed mb-0.5">{step.description}</p>
      <p className="text-[11px] text-gray-400 leading-relaxed mb-2 italic">{step.instruction}</p>

      {/* Nota */}
      {step.note && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-amber-700 leading-relaxed">💡 {step.note}</p>
        </div>
      )}

      {/* Texto árabe */}
      {step.arabic && (
        <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
          <p
            className="text-xl leading-loose text-emerald-700 text-right"
            dir="rtl"
            lang="ar"
          >
            {step.arabic}
          </p>
          {step.transliteration && (
            <p className="text-xs text-emerald-500 italic leading-relaxed">
              {step.transliteration}
            </p>
          )}
          <p className="text-xs text-gray-500 leading-relaxed">{step.translation}</p>
        </div>
      )}

      {/* Botón audio */}
      {step.audioUrls?.length > 0 && (
        <button
          onClick={() => onPlayAudio(step.audioUrls)}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isPlaying ? (
            <><StopCircle size={15} /> Detener</>
          ) : (
            <><Play size={15} /> Escuchar recitación</>
          )}
        </button>
      )}
    </div>
  )
}

export default function PrayerGuide({ onBack }) {
  const [selectedPrayer, setSelectedPrayer] = useState('fajr')
  const [playingAudioKey, setPlayingAudioKey] = useState(null)
  const audioRef = useRef(null)

  const totalRakaas = PRAYER_RAKAATS[selectedPrayer]

  // Todos los pasos agrupados por rakaa
  const allStepsByRakaa = useMemo(() => {
    return Array.from({ length: totalRakaas }, (_, i) => ({
      rakaa: i + 1,
      steps: getStepsForRakaa(i + 1, totalRakaas),
    }))
  }, [selectedPrayer, totalRakaas])

  // Número global de paso para mostrar en cada card
  const stepNumbers = useMemo(() => {
    let counter = 0
    return allStepsByRakaa.map(({ steps }) =>
      steps.map(() => ++counter)
    )
  }, [allStepsByRakaa])

  // --- Audio ---
  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setPlayingAudioKey(null)
  }

  function playSequence(urls, index, sessionKey) {
    if (index >= urls.length) {
      setPlayingAudioKey(null)
      audioRef.current = null
      return
    }
    const audio = new Audio(urls[index])
    audioRef.current = audio
    audio.play()
      .then(() => setPlayingAudioKey(sessionKey))
      .catch((err) => {
        console.warn('Audio no disponible:', urls[index], err)
        setPlayingAudioKey(null)
      })
    audio.addEventListener('ended', () => {
      audioRef.current = null
      playSequence(urls, index + 1, sessionKey)
    })
  }

  function handlePlayAudio(audioUrls) {
    if (!audioUrls || audioUrls.length === 0) return
    const sessionKey = audioUrls[0]
    if (playingAudioKey === sessionKey) {
      stopAudio()
      return
    }
    stopAudio()
    playSequence(audioUrls, 0, sessionKey)
  }

  function handlePrayerChange(id) {
    stopAudio()
    setSelectedPrayer(id)
  }

  // Parar audio al desmontar
  useEffect(() => () => stopAudio(), [])

  return (
    <div className="pt-4 pb-10">
      {/* Back */}
      <button
        onClick={() => { stopAudio(); onBack() }}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
      >
        <ChevronLeft size={16} />
        Volver al inicio
      </button>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Guía Paso a Paso</h2>

      {/* Selector de oración */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {PRAYERS.map((p) => {
          const active = selectedPrayer === p.id
          return (
            <button
              key={p.id}
              onClick={() => handlePrayerChange(p.id)}
              className={`shrink-0 flex flex-col items-center gap-0.5 py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-90 ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#FFFBF2] text-gray-600 border border-[#EDE3D3]'
              }`}
            >
              <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-800'}`}>
                {p.label}
              </span>
              <span className="text-[9px] leading-tight opacity-70">{p.desc}</span>
            </button>
          )
        })}
      </div>

      {/* Todos los pasos */}
      {allStepsByRakaa.map(({ rakaa, steps }, rakaaIdx) => (
        <div key={rakaa}>
          <RakaaHeader rakaa={rakaa} total={totalRakaas} />
          {steps.map((step, stepIdx) => (
            <StepCard
              key={`${rakaa}-${step.id}`}
              step={step}
              stepNumber={stepNumbers[rakaaIdx][stepIdx]}
              playingAudioKey={playingAudioKey}
              onPlayAudio={handlePlayAudio}
            />
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          Taqabbal Allahu minna wa minkum
        </p>
        <p className="text-[10px] text-gray-300 mt-1">
          Que Allah acepte nuestros rezos
        </p>
      </div>
    </div>
  )
}
