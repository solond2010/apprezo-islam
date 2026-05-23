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

// Mapeo de step.id → imagen de postura real
const STEP_IMAGE = {
  niyya:             '/fotos/poses rezo hombre/intencion.png',
  takbir_initial:    '/fotos/poses rezo hombre/takbir.png',
  dua_opening:       '/fotos/poses rezo hombre/qiyam.png',
  basmala:           '/fotos/poses rezo hombre/qiyam.png',
  fatiha:            '/fotos/poses rezo hombre/qiyam.png',
  surah:             '/fotos/poses rezo hombre/qiyam.png',
  takbir_ruku:       '/fotos/poses rezo hombre/qiyam.png',
  ruku:              '/fotos/poses rezo hombre/ruku.png',
  tasmi:             '/fotos/poses rezo hombre/qiyam.png',
  tahmid:            '/fotos/poses rezo hombre/qiyam.png',
  takbir_sujud:      '/fotos/poses rezo hombre/qiyam.png',
  sujud_1:           '/fotos/poses rezo hombre/sujud.png',
  jalsah:            '/fotos/poses rezo hombre/jalsa.png',
  takbir_sujud2:     '/fotos/poses rezo hombre/jalsa.png',
  sujud_2:           '/fotos/poses rezo hombre/sujud.png',
  tashahhud_middle:  '/fotos/poses rezo hombre/jalsa.png',
  tashahhud_final:   '/fotos/poses rezo hombre/jalsa.png',
  darood:            '/fotos/poses rezo hombre/jalsa.png',
  dua_final:         '/fotos/poses rezo hombre/jalsa.png',
  salam:             null, // caso especial — taslim1 + taslim2
}

function PostureImage({ stepId }) {
  // Salam: mostrar ambas imágenes (derecha + izquierda) en fila
  if (stepId === 'salam') {
    return (
      <div className="flex items-center gap-1 shrink-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-50 flex items-center justify-center">
          <img
            src="/fotos/poses rezo hombre/taslim1.png"
            alt="Taslim derecha"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-50 flex items-center justify-center">
          <img
            src="/fotos/poses rezo hombre/taslim2.png"
            alt="Taslim izquierda"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    )
  }

  const src = STEP_IMAGE[stepId]
  if (!src) return null

  return (
    <div className="w-[52px] h-[52px] rounded-xl overflow-hidden bg-amber-50 flex items-center justify-center shrink-0">
      <img src={src} alt={stepId} className="w-full h-full object-contain" />
    </div>
  )
}

function RakaaHeader({ rakaa, total }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-3">
      <div className="flex-1 h-px bg-[#EDE3D3]" />
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex gap-1">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i + 1 === rakaa ? 'bg-amber-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Rakaa {rakaa} de {total}
        </span>
      </div>
      <div className="flex-1 h-px bg-[#EDE3D3]" />
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
        <PostureImage stepId={step.id} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-300 font-medium">#{stepNumber}</span>
            <h3 className="text-sm font-semibold text-gray-900">{step.name}</h3>
            {step.repeat > 1 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                ×{step.repeat}
              </span>
            )}
          </div>
          <p className="text-xs text-amber-600 mt-0.5" dir="rtl">{step.nameAr}</p>
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
        <div className="border-t border-[#EDE3D3] pt-3 mt-2 space-y-2">
          <p
            className="text-xl leading-loose text-amber-800 text-right"
            dir="rtl"
            lang="ar"
          >
            {step.arabic}
          </p>
          {step.transliteration && (
            <p className="text-xs text-amber-600 italic leading-relaxed">
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
              : 'text-white'
          }`}
          style={
            !isPlaying
              ? { background: 'linear-gradient(135deg, #A06A38 0%, #C2410C 100%)' }
              : undefined
          }
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

  const allStepsByRakaa = useMemo(() => {
    return Array.from({ length: totalRakaas }, (_, i) => ({
      rakaa: i + 1,
      steps: getStepsForRakaa(i + 1, totalRakaas),
    }))
  }, [selectedPrayer, totalRakaas])

  const stepNumbers = useMemo(() => {
    let counter = 0
    return allStepsByRakaa.map(({ steps }) =>
      steps.map(() => ++counter)
    )
  }, [allStepsByRakaa])

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

  useEffect(() => () => stopAudio(), [])

  return (
    <div className="pt-4 pb-10">
      {/* Back */}
      <button
        onClick={() => { stopAudio(); onBack() }}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors active:scale-95"
      >
        <ChevronLeft size={16} />
        Volver al inicio
      </button>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Guía Paso a Paso</h2>

      {/* Selector de oración */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {PRAYERS.map((p) => {
          const active = selectedPrayer === p.id
          return (
            <button
              key={p.id}
              onClick={() => handlePrayerChange(p.id)}
              className="shrink-0 flex flex-col items-center gap-0.5 py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-90 text-white"
              style={
                active
                  ? { background: 'linear-gradient(135deg, #A06A38 0%, #C2410C 100%)' }
                  : { background: '#FFFBF2', color: '#4A3C2D', border: '1px solid #EDE3D3' }
              }
            >
              <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-800'}`}>
                {p.label}
              </span>
              <span className={`text-[9px] leading-tight ${active ? 'opacity-80 text-white' : 'text-gray-400'}`}>
                {p.desc}
              </span>
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
