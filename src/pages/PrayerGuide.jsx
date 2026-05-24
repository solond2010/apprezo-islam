import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Play, StopCircle, X, ZoomIn, Volume2 } from 'lucide-react'
import { PRAYER_RAKAATS, getStepsForRakaa } from '../data/prayerData'
import { useSettings } from '../context/SettingsContext'

const PRAYERS = [
  { id: 'fajr',    label: 'Fajr',    desc: '2 rakaas' },
  { id: 'dhuhr',   label: 'Dhuhr',   desc: '4 rakaas' },
  { id: 'asr',     label: 'Asr',     desc: '4 rakaas' },
  { id: 'maghrib', label: 'Maghrib', desc: '3 rakaas' },
  { id: 'isha',    label: 'Isha',    desc: '4 rakaas' },
]

// Mapeo de step.id → nombre base de imagen (sin género)
// La ruta final se construye en buildImageUrl() según userGender.
const STEP_IMAGE_KEY = {
  niyya:            'intencion',
  takbir_initial:   'takbir',
  basmala:          'qiyam',
  fatiha:           'qiyam',
  surah:            'qiyam',
  takbir_ruku:      'qiyam',
  ruku:             'ruku',
  tasmi:            'qiyam',
  tahmid:           'qiyam',
  takbir_sujud:     'qiyam',
  sujud_1:          'sujud',
  jalsah:           'jalsa',
  takbir_sujud2:    'jalsa',
  sujud_2:          'sujud',
  tashahhud_middle: 'jalsa',
  tashahhud_final:  'jalsa',
  darood:           'jalsa',
  dua_final:        'jalsa',
  salam:            null, // caso especial: taslim1 + taslim2
}

// Carpetas disponibles por género — fallback a hombre si la carpeta de mujer aún no existe
const GENDER_FOLDERS = {
  hombre: '/fotos/poses rezo hombre',
  mujer:  '/fotos/poses rezo mujer', // TODO: subir las ilustraciones de mujer
}

function buildImageUrl(stepId, gender) {
  const key = STEP_IMAGE_KEY[stepId]
  if (!key) return null
  const folder = GENDER_FOLDERS[gender] || GENDER_FOLDERS.hombre
  return `${folder}/${key}.png`
}

function buildLocalAudioUrl(localAudio, gender) {
  if (!localAudio) return null
  return `/audio/${gender}_${localAudio}.wav`
}

/* ─────────────────────────────────────────
   LIGHTBOX MODAL
───────────────────────────────────────── */
function PostureLightbox({ step, onClose, gender }) {
  const isSalam = step.id === 'salam'
  const imgUrl = buildImageUrl(step.id, gender)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <div className="flex justify-end p-4 shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Content — stops propagation so tapping content doesn't close */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-12 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col items-center w-full">
        {/* Step title */}
        <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1 text-center">
          {step.nameAr}
        </p>
        <h2 className="text-xl font-black text-white text-center mb-6">
          {step.name}
        </h2>

        {/* Image(s) */}
        {isSalam ? (
          <div className="flex gap-6 items-center justify-center mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-36 h-48 bg-[#FFFBF2] rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="/fotos/poses rezo hombre/taslim1.png"
                  alt="Taslim derecha"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <span className="text-xs text-amber-300 font-semibold">Derecha →</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-36 h-48 bg-[#FFFBF2] rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="/fotos/poses rezo hombre/taslim2.png"
                  alt="Taslim izquierda"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <span className="text-xs text-amber-300 font-semibold">← Izquierda</span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xs bg-[#FFFBF2] rounded-3xl overflow-hidden flex items-center justify-center mb-6"
            style={{ aspectRatio: '3/4' }}>
            <img
              src={imgUrl}
              alt={step.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                // Fallback a hombre si la imagen de mujer no existe
                if (gender !== 'hombre') e.currentTarget.src = `${GENDER_FOLDERS.hombre}/${STEP_IMAGE_KEY[step.id]}.png`
              }}
            />
          </div>
        )}

        {/* Description */}
        <div className="w-full max-w-sm space-y-3">
          <p className="text-sm text-white/80 leading-relaxed text-center">
            {step.description}
          </p>
          {step.instruction && (
            <p className="text-xs text-amber-300/80 italic leading-relaxed text-center">
              {step.instruction}
            </p>
          )}
          {step.arabic && (
            <div className="bg-white/8 rounded-2xl px-4 py-4 mt-2 space-y-2 border border-white/10">
              <p
                className="text-3xl leading-[2.4] text-amber-200 text-right"
                dir="rtl"
                lang="ar"
              >
                {step.arabic}
              </p>
              {step.transliteration && (
                <p className="text-xs text-amber-400 italic leading-relaxed">
                  {step.transliteration}
                </p>
              )}
              <p className="text-xs text-white/60 leading-relaxed">
                {step.translation}
              </p>
            </div>
          )}
          {step.note && (
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-300 leading-relaxed">
                💡 {step.note}
              </p>
            </div>
          )}
        </div>
        </div>{/* end inner flex-col */}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   RAKAA DIVIDER
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   STEP CARD — layout vertical centrado
───────────────────────────────────────── */
function StepCard({ step, stepNumber, playingAudioKey, onPlayAudio, onPlayLocalAudio, onOpenLightbox, gender }) {
  const sessionKey = step.audioUrls?.[0]
  const isPlaying = playingAudioKey === sessionKey
  const localAudioUrl = buildLocalAudioUrl(step.localAudio, gender)
  const isLocalPlaying = localAudioUrl && playingAudioKey === localAudioUrl
  const isSalam = step.id === 'salam'
  const stepImgUrl = buildImageUrl(step.id, gender)
  const hasImage = isSalam || !!STEP_IMAGE_KEY[step.id]
  const fallbackImg = STEP_IMAGE_KEY[step.id] ? `${GENDER_FOLDERS.hombre}/${STEP_IMAGE_KEY[step.id]}.png` : null

  return (
    <div className="bg-[#FFFBF2] rounded-2xl border border-[#EDE3D3] px-4 pt-4 pb-4 mb-3">

      {/* ── Título + número ── */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-[10px] text-gray-300 font-medium">#{stepNumber}</span>
        <h3 className="text-sm font-bold text-gray-900 text-center">{step.name}</h3>
        {step.repeat > 1 && (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
            ×{step.repeat}
          </span>
        )}
      </div>
      <p className="text-xs text-amber-600 text-center mb-3" dir="rtl">{step.nameAr}</p>

      {/* ── Imagen centralizada y grande ── */}
      {hasImage && (
        <button
          onClick={() => onOpenLightbox(step)}
          className="w-full flex flex-col items-center mb-3 group active:scale-98 transition-transform"
        >
          {isSalam ? (
            /* Salam: dos imágenes lado a lado */
            <div className="flex gap-3 items-end justify-center w-full">
              <div className="flex-1 max-w-[140px] rounded-2xl overflow-hidden bg-amber-50/80 border border-amber-100"
                style={{ aspectRatio: '3/4' }}>
                <img
                  src={`${GENDER_FOLDERS[gender] || GENDER_FOLDERS.hombre}/taslim1.png`}
                  alt="Taslim derecha"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { if (gender !== 'hombre') e.currentTarget.src = `${GENDER_FOLDERS.hombre}/taslim1.png` }}
                />
              </div>
              <div className="flex-1 max-w-[140px] rounded-2xl overflow-hidden bg-amber-50/80 border border-amber-100"
                style={{ aspectRatio: '3/4' }}>
                <img
                  src={`${GENDER_FOLDERS[gender] || GENDER_FOLDERS.hombre}/taslim2.png`}
                  alt="Taslim izquierda"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { if (gender !== 'hombre') e.currentTarget.src = `${GENDER_FOLDERS.hombre}/taslim2.png` }}
                />
              </div>
            </div>
          ) : (
            /* Resto de pasos: imagen centrada grande */
            <div
              className="w-full max-w-[200px] rounded-2xl overflow-hidden bg-amber-50/80 border border-amber-100"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={stepImgUrl}
                alt={step.name}
                className="w-full h-full object-contain p-3"
                onError={(e) => { if (fallbackImg && gender !== 'hombre') e.currentTarget.src = fallbackImg }}
              />
            </div>
          )}

          {/* Hint "Toca para ampliar" */}
          <div className="flex items-center gap-1 mt-2 opacity-60 group-active:opacity-100 transition-opacity">
            <ZoomIn size={11} className="text-amber-600" />
            <span className="text-[10px] text-amber-600 font-semibold">Toca para ampliar</span>
          </div>
        </button>
      )}

      {/* ── Descripción e instrucción ── */}
      <p className="text-xs text-gray-500 leading-relaxed mb-0.5 text-center">
        {step.description}
      </p>
      {step.instruction && (
        <p className="text-[11px] text-gray-400 leading-relaxed mb-3 italic text-center">
          {step.instruction}
        </p>
      )}

      {/* ── Nota ── */}
      {step.note && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-amber-700 leading-relaxed">💡 {step.note}</p>
        </div>
      )}

      {/* ── Texto árabe ── */}
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

      {/* ── Botón pronunciación local (.wav) ── */}
      {localAudioUrl && (
        <button
          onClick={() => onPlayLocalAudio(localAudioUrl)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm text-white"
          style={
            isLocalPlaying
              ? { background: '#EF4444' }
              : { background: 'linear-gradient(135deg, #A06A38 0%, #C2410C 100%)' }
          }
        >
          {isLocalPlaying ? (
            <><StopCircle size={15} /> Detener</>
          ) : (
            <><Play size={15} /> Escuchar pronunciación</>
          )}
        </button>
      )}

      {/* ── Botón audio (recitación coránica) ── */}
      {step.audioUrls?.length > 0 && (
        <button
          onClick={() => onPlayAudio(step.audioUrls)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm text-white"
          style={
            isPlaying
              ? { background: '#EF4444' }
              : { background: 'linear-gradient(135deg, #A06A38 0%, #C2410C 100%)' }
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

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function PrayerGuide({ onBack }) {
  const { userGender } = useSettings()
  const [selectedPrayer, setSelectedPrayer] = useState('fajr')
  const [playingAudioKey, setPlayingAudioKey] = useState(null)
  const [lightboxStep, setLightboxStep] = useState(null)
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
    return allStepsByRakaa.map(({ steps }) => steps.map(() => ++counter))
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
    if (index >= urls.length) { setPlayingAudioKey(null); audioRef.current = null; return }
    const audio = new Audio(urls[index])
    audioRef.current = audio
    audio.play()
      .then(() => setPlayingAudioKey(sessionKey))
      .catch(() => setPlayingAudioKey(null))
    audio.addEventListener('ended', () => {
      audioRef.current = null
      playSequence(urls, index + 1, sessionKey)
    })
  }

  function handlePlayAudio(audioUrls) {
    if (!audioUrls?.length) return
    const sessionKey = audioUrls[0]
    if (playingAudioKey === sessionKey) { stopAudio(); return }
    stopAudio()
    playSequence(audioUrls, 0, sessionKey)
  }

  // Reproductor de audio local (.wav de pronunciación hombre/mujer)
  function handlePlayLocalAudio(url) {
    if (!url) return
    if (playingAudioKey === url) { stopAudio(); return }
    stopAudio()
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play()
      .then(() => setPlayingAudioKey(url))
      .catch(() => setPlayingAudioKey(null))
    audio.addEventListener('ended', () => {
      audioRef.current = null
      setPlayingAudioKey(null)
    })
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
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {PRAYERS.map((p) => {
          const active = selectedPrayer === p.id
          return (
            <button
              key={p.id}
              onClick={() => handlePrayerChange(p.id)}
              className="shrink-0 flex flex-col items-center gap-0.5 py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-90"
              style={
                active
                  ? { background: 'linear-gradient(135deg, #A06A38 0%, #C2410C 100%)', color: 'white' }
                  : { background: '#FFFBF2', color: '#4A3C2D', border: '1px solid #EDE3D3' }
              }
            >
              <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-800'}`}>
                {p.label}
              </span>
              <span className={`text-[9px] leading-tight ${active ? 'text-white/80' : 'text-gray-400'}`}>
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
              onPlayLocalAudio={handlePlayLocalAudio}
              onOpenLightbox={setLightboxStep}
              gender={userGender}
            />
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">Taqabbal Allahu minna wa minkum</p>
        <p className="text-[10px] text-gray-300 mt-1">Que Allah acepte nuestros rezos</p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxStep && (
          <PostureLightbox
            step={lightboxStep}
            onClose={() => setLightboxStep(null)}
            gender={userGender}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
