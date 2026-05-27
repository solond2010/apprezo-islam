import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Play, Pause, X, ZoomIn, ChevronDown,
  ChevronUp, SkipBack, SkipForward, Volume2, Mic,
  Sunrise, Sun, CloudSun, Sunset, Moon,
} from 'lucide-react'
import { PRAYER_RAKAATS, getStepsForRakaa } from '../data/prayerData'
import { useSettings } from '../context/SettingsContext'

const PRAYERS = [
  { id: 'fajr',    label: 'Fajr',    desc: '2 rakaas', icon: Sunrise,  color: 'from-amber-400 to-orange-400' },
  { id: 'dhuhr',   label: 'Dhuhr',   desc: '4 rakaas', icon: Sun,      color: 'from-yellow-400 to-amber-500' },
  { id: 'asr',     label: 'Asr',     desc: '4 rakaas', icon: CloudSun, color: 'from-orange-400 to-orange-600' },
  { id: 'maghrib', label: 'Maghrib', desc: '3 rakaas', icon: Sunset,   color: 'from-rose-400 to-orange-500' },
  { id: 'isha',    label: 'Isha',    desc: '4 rakaas', icon: Moon,     color: 'from-indigo-400 to-violet-500' },
]

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

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
  salam:            null,
}

const GENDER_FOLDERS = {
  hombre: '/fotos/poses rezo hombre',
  mujer:  '/fotos/poses rezo mujer',
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
   PRAYER DROPDOWN — arriba a la derecha
───────────────────────────────────────── */
function PrayerDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const current = PRAYERS.find(p => p.id === selected)
  const CurrentIcon = current?.icon || Sunrise

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl text-white shadow-md active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        <div className="w-6 h-6 rounded-lg bg-white/25 flex items-center justify-center">
          <CurrentIcon size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-black">{current?.label}</span>
          <span className="text-[9px] text-white/80 font-semibold">{current?.desc}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-white/80 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay para cerrar al tocar fuera */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
            >
              <div className="px-4 py-3 border-b border-white/15">
                <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">
                  Elige tu rezo
                </p>
              </div>
              {PRAYERS.map((p) => {
                const Icon = p.icon
                const isActive = selected === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => { onSelect(p.id); setOpen(false) }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors ${
                      isActive ? 'bg-white/25' : 'active:bg-white/15'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-white/30' : 'bg-white/15'
                    }`}>
                      <Icon size={15} className="text-white" strokeWidth={2.3} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-bold leading-tight">{p.label}</p>
                      <p className="text-white/75 text-[10px] font-semibold">{p.desc}</p>
                    </div>
                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                        <span className="text-white text-[10px] font-black">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   MINI PLAYER (igual al de Surahs)
───────────────────────────────────────── */
function MiniPlayer({ item, totalItems, currentIdx, isPlaying, speed, onPlayPause, onPrev, onNext, onSpeedChange, onClose }) {
  const [showSpeeds, setShowSpeeds] = useState(false)
  if (!item) return null

  const isLocal = item.type === 'local'
  const stepName = item.step?.name || ''

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      className="fixed left-0 right-0 z-50 px-3"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
    >
      {/* Dropdown velocidad */}
      <AnimatePresence>
        {showSpeeds && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-3 mb-2 rounded-2xl overflow-hidden shadow-2xl z-10"
            style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
          >
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => { onSpeedChange(s); setShowSpeeds(false) }}
                className={`flex items-center justify-between w-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  s === speed ? 'bg-white/25 text-white' : 'text-white/85 active:bg-white/15'
                }`}
              >
                <span>{s === 1 ? '1×  Normal' : s < 1 ? `${s}×  Lento` : `${s}×  Rápido`}</span>
                {s === speed && <span className="text-white text-xs ml-4">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        {/* Barra de progreso */}
        <div className="h-1 bg-white/20">
          <motion.div
            className="h-full bg-white rounded-full"
            animate={{ width: totalItems > 0 ? `${((currentIdx + 1) / totalItems) * 100}%` : '0%' }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <div className="px-4 pt-3 pb-3">
          {/* Info + cerrar */}
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                {isLocal ? 'Pronunciación' : 'Recitación'} · Paso {(currentIdx ?? 0) + 1} / {totalItems}
              </p>
              <p className="text-white text-xs font-semibold truncate mt-0.5">
                {stepName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center active:scale-90 flex-shrink-0"
            >
              <X size={13} className="text-white" />
            </button>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setShowSpeeds(v => !v)}
              className="flex items-center gap-1 min-w-[52px] h-9 rounded-xl bg-white/20 px-2.5 active:scale-90 transition-transform"
            >
              <span className="text-[12px] font-black text-white tabular-nums leading-none">
                {speed === 1 ? '1×' : `${speed}×`}
              </span>
              <ChevronUp
                size={11}
                className={`text-white/80 transition-transform ${showSpeeds ? '' : 'rotate-180'}`}
              />
            </button>

            <button
              onClick={onPrev}
              disabled={currentIdx === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 disabled:opacity-30 bg-white/20 transition-transform"
            >
              <SkipBack size={18} className="text-white" />
            </button>

            <button
              onClick={onPlayPause}
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
            >
              {isPlaying
                ? <Pause size={23} className="text-orange-500" />
                : <Play size={23} className="text-orange-500 ml-0.5" />
              }
            </button>

            <button
              onClick={onNext}
              disabled={currentIdx >= totalItems - 1}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 disabled:opacity-30 bg-white/20 transition-transform"
            >
              <SkipForward size={18} className="text-white" />
            </button>

            <div className="min-w-[52px] flex flex-col items-end">
              <span className="text-[8px] text-white/55 font-bold uppercase leading-none tracking-wide">
                {isLocal ? 'Voz' : 'Audio'}
              </span>
              <span className="text-[10px] text-white font-black leading-tight text-right mt-0.5">
                {isLocal ? 'Local' : 'Quran'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   LIGHTBOX — sin cambios funcionales, pequeños retoques
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
      className="fixed inset-0 z-[60] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex justify-end p-4 shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-12 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col items-center w-full">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1 text-center">
            {step.nameAr}
          </p>
          <h2 className="text-xl font-black text-white text-center mb-6">{step.name}</h2>

          {isSalam ? (
            <div className="flex gap-6 items-center justify-center mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-48 bg-[#FFFBF2] rounded-2xl overflow-hidden flex items-center justify-center">
                  <img src="/fotos/poses rezo hombre/taslim1.png" alt="Taslim derecha" className="w-full h-full object-contain p-2" />
                </div>
                <span className="text-xs text-amber-300 font-semibold">Derecha →</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-48 bg-[#FFFBF2] rounded-2xl overflow-hidden flex items-center justify-center">
                  <img src="/fotos/poses rezo hombre/taslim2.png" alt="Taslim izquierda" className="w-full h-full object-contain p-2" />
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
                  if (gender !== 'hombre') e.currentTarget.src = `${GENDER_FOLDERS.hombre}/${STEP_IMAGE_KEY[step.id]}.png`
                }}
              />
            </div>
          )}

          <div className="w-full max-w-sm space-y-3">
            <p className="text-sm text-white/80 leading-relaxed text-center">{step.description}</p>
            {step.instruction && (
              <p className="text-xs text-amber-300/80 italic leading-relaxed text-center">{step.instruction}</p>
            )}
            {step.arabic && (
              <div className="bg-white/8 rounded-2xl px-4 py-4 mt-2 space-y-2 border border-white/10">
                <p className="text-3xl leading-[2.4] text-amber-200 text-right" dir="rtl" lang="ar">{step.arabic}</p>
                {step.transliteration && (
                  <p className="text-xs text-amber-400 italic leading-relaxed">{step.transliteration}</p>
                )}
                <p className="text-xs text-white/60 leading-relaxed">{step.translation}</p>
              </div>
            )}
            {step.note && (
              <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-300 leading-relaxed">💡 {step.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   RAKAA HEADER — divisor entre rakaas
───────────────────────────────────────── */
function RakaaHeader({ rakaa, total }) {
  return (
    <div className="flex items-center gap-3 mt-7 mb-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-amber-300" />
      <div
        className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full shadow-md"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        <div className="flex gap-1">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i + 1 === rakaa ? 'bg-white' : 'bg-white/35'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          Rakaa {rakaa} de {total}
        </span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-300 to-amber-300" />
    </div>
  )
}

/* ─────────────────────────────────────────
   STEP CARD — rediseñada
───────────────────────────────────────── */
function StepCard({
  step, stepNumber, gender,
  localItemIdx, recitItemIdx,
  currentItemIdx, isPlaying,
  onPlayItem, onOpenLightbox,
}) {
  const isLocalActive = localItemIdx !== null && currentItemIdx === localItemIdx
  const isRecitActive = recitItemIdx !== null && currentItemIdx === recitItemIdx
  const isAnyActive = isLocalActive || isRecitActive
  const isSalam = step.id === 'salam'
  const stepImgUrl = buildImageUrl(step.id, gender)
  const hasImage = isSalam || !!STEP_IMAGE_KEY[step.id]
  const fallbackImg = STEP_IMAGE_KEY[step.id]
    ? `${GENDER_FOLDERS.hombre}/${STEP_IMAGE_KEY[step.id]}.png`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-2xl mb-3 overflow-hidden transition-shadow ${
        isAnyActive ? 'shadow-lg shadow-amber-300/40' : 'shadow-sm'
      }`}
    >
      {/* Borde brillante cuando está activo */}
      {isAnyActive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            padding: 2,
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      <div className="relative bg-white/85 backdrop-blur-md border border-white/70 rounded-2xl px-4 pt-4 pb-4">
        {/* Header: número + título + repetir */}
        <div className="flex items-center justify-between mb-1">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl text-white text-[11px] font-black shadow-sm"
            style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}
          >
            {stepNumber}
          </div>
          {step.repeat > 1 && (
            <span
              className="text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-sm"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EA580C)' }}
            >
              ×{step.repeat}
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-base font-black text-gray-800 text-center mt-2">{step.name}</h3>
        <p className="text-xs text-amber-700 font-semibold text-center mb-3" dir="rtl">
          {step.nameAr}
        </p>

        {/* Imagen */}
        {hasImage && (
          <button
            onClick={() => onOpenLightbox(step)}
            className="w-full flex flex-col items-center mb-3 group active:scale-[0.98] transition-transform"
          >
            {isSalam ? (
              <div className="flex gap-3 items-end justify-center w-full">
                <div className="flex-1 max-w-[140px] rounded-2xl overflow-hidden bg-amber-50/80 border border-amber-200/60 shadow-sm"
                  style={{ aspectRatio: '3/4' }}>
                  <img
                    src={`${GENDER_FOLDERS[gender] || GENDER_FOLDERS.hombre}/taslim1.png`}
                    alt="Taslim derecha"
                    className="w-full h-full object-contain p-2"
                    onError={(e) => { if (gender !== 'hombre') e.currentTarget.src = `${GENDER_FOLDERS.hombre}/taslim1.png` }}
                  />
                </div>
                <div className="flex-1 max-w-[140px] rounded-2xl overflow-hidden bg-amber-50/80 border border-amber-200/60 shadow-sm"
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
              <div
                className="w-full max-w-[200px] rounded-2xl overflow-hidden bg-amber-50/80 border border-amber-200/60 shadow-sm"
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

            <div className="flex items-center gap-1 mt-2 opacity-60 group-active:opacity-100 transition-opacity">
              <ZoomIn size={11} className="text-amber-600" />
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Ampliar</span>
            </div>
          </button>
        )}

        {/* Descripción */}
        <p className="text-xs text-gray-600 leading-relaxed text-center">{step.description}</p>
        {step.instruction && (
          <p className="text-[11px] text-gray-400 leading-relaxed mt-1 italic text-center">{step.instruction}</p>
        )}

        {/* Nota */}
        {step.note && (
          <div className="mt-3 bg-amber-50 border border-amber-200/60 rounded-xl px-3 py-2">
            <p className="text-xs text-amber-800 leading-relaxed">💡 {step.note}</p>
          </div>
        )}

        {/* Texto árabe */}
        {step.arabic && (
          <div className="border-t border-amber-100 pt-3 mt-3 space-y-2">
            <p
              className="text-xl leading-loose text-amber-900 text-right"
              dir="rtl"
              lang="ar"
            >
              {step.arabic}
            </p>
            {step.transliteration && (
              <p className="text-xs text-amber-700 italic font-medium leading-relaxed">
                {step.transliteration}
              </p>
            )}
            <p className="text-xs text-gray-500 leading-relaxed">{step.translation}</p>
          </div>
        )}

        {/* Botones de audio */}
        <div className="mt-4 flex flex-col gap-2">
          {localItemIdx !== null && (
            <button
              onClick={() => onPlayItem(localItemIdx)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm active:scale-[0.97] transition-transform"
              style={{
                background: isLocalActive
                  ? 'linear-gradient(135deg, #EA580C, #C2410C)'
                  : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
              }}
            >
              {isLocalActive && isPlaying ? <Pause size={15} /> : <Mic size={15} />}
              {isLocalActive && isPlaying ? 'Pausar pronunciación' : 'Escuchar pronunciación'}
            </button>
          )}

          {recitItemIdx !== null && (
            <button
              onClick={() => onPlayItem(recitItemIdx)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm active:scale-[0.97] transition-transform"
              style={{
                background: isRecitActive
                  ? 'linear-gradient(135deg, #EA580C, #C2410C)'
                  : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
              }}
            >
              {isRecitActive && isPlaying ? <Pause size={15} /> : <Volume2 size={15} />}
              {isRecitActive && isPlaying ? 'Pausar recitación' : 'Escuchar recitación'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function PrayerGuide({ onBack }) {
  const { userGender } = useSettings()
  const [selectedPrayer, setSelectedPrayer] = useState('fajr')
  const [lightboxStep, setLightboxStep] = useState(null)

  // Reproductor global
  const [currentItemIdx, setCurrentItemIdx] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef(null)
  const sequenceRef = useRef(null)

  const totalRakaas = PRAYER_RAKAATS[selectedPrayer]

  const allStepsByRakaa = useMemo(() => {
    return Array.from({ length: totalRakaas }, (_, i) => ({
      rakaa: i + 1,
      steps: getStepsForRakaa(i + 1, totalRakaas),
    }))
  }, [selectedPrayer, totalRakaas])

  // Numeración global de pasos (1..N)
  const stepNumbers = useMemo(() => {
    let counter = 0
    return allStepsByRakaa.map(({ steps }) => steps.map(() => ++counter))
  }, [allStepsByRakaa])

  // Lista plana de items reproducibles (pronunciación + recitación)
  // Cada step puede tener uno, ambos o ninguno.
  const playableItems = useMemo(() => {
    const items = []
    allStepsByRakaa.forEach(({ rakaa, steps }) => {
      steps.forEach((step) => {
        if (step.localAudio) {
          items.push({
            type: 'local',
            step,
            rakaa,
            url: buildLocalAudioUrl(step.localAudio, userGender),
          })
        }
        if (step.audioUrls?.length > 0) {
          items.push({
            type: 'recitation',
            step,
            rakaa,
            urls: step.audioUrls,
          })
        }
      })
    })
    return items
  }, [allStepsByRakaa, userGender])

  // Mapa stepId → índice del item (para que las cards sepan qué item es suyo)
  const itemIdxByStep = useMemo(() => {
    const map = new Map()
    playableItems.forEach((it, idx) => {
      const key = `${it.rakaa}-${it.step.id}-${it.type}`
      map.set(key, idx)
    })
    return map
  }, [playableItems])

  function stopAudio() {
    sequenceRef.current = null
    const audio = audioRef.current
    if (audio) {
      audio.onended = null
      audio.onerror = null
      audio.pause()
      audio.src = ''
    }
    setIsPlaying(false)
  }

  function playItem(itemIdx) {
    const audio = audioRef.current
    if (!audio) return

    const token = Symbol()
    sequenceRef.current = token

    function advance(itemI, subI) {
      audio.onended = null
      audio.onerror = null

      if (sequenceRef.current !== token) return

      if (itemI >= playableItems.length) {
        setIsPlaying(false)
        setCurrentItemIdx(null)
        sequenceRef.current = null
        return
      }

      const item = playableItems[itemI]
      let url
      let isLastSubInItem = true

      if (item.type === 'local') {
        url = item.url
      } else {
        url = item.urls[subI]
        if (subI + 1 < item.urls.length) isLastSubInItem = false
      }

      setCurrentItemIdx(itemI)
      setIsPlaying(true)

      audio.src = url
      audio.load()
      audio.playbackRate = audio.defaultPlaybackRate || speed

      audio.onended = () => {
        if (!isLastSubInItem) advance(itemI, subI + 1)
        else advance(itemI + 1, 0)
      }
      audio.onerror = () => {
        if (!isLastSubInItem) advance(itemI, subI + 1)
        else advance(itemI + 1, 0)
      }

      audio.play().catch((err) => {
        if (err.name === 'NotAllowedError' && sequenceRef.current === token) {
          setIsPlaying(false)
        }
      })
    }

    advance(itemIdx, 0)
  }

  function handlePlayItem(itemIdx) {
    if (currentItemIdx === itemIdx && isPlaying) {
      // Pausar sin resetear
      audioRef.current?.pause()
      setIsPlaying(false)
      return
    }
    stopAudio()
    setTimeout(() => playItem(itemIdx), 30)
  }

  function handlePlayPause() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else if (currentItemIdx !== null) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  function handlePrev() {
    if (currentItemIdx === null || currentItemIdx === 0) return
    stopAudio()
    setTimeout(() => playItem(currentItemIdx - 1), 30)
  }

  function handleNext() {
    if (currentItemIdx === null || currentItemIdx >= playableItems.length - 1) return
    stopAudio()
    setTimeout(() => playItem(currentItemIdx + 1), 30)
  }

  function handleClose() {
    stopAudio()
    setCurrentItemIdx(null)
  }

  function handlePrayerChange(id) {
    stopAudio()
    setCurrentItemIdx(null)
    setSelectedPrayer(id)
  }

  // Aplicar velocidad al cambiar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      audioRef.current.defaultPlaybackRate = speed
    }
  }, [speed])

  useEffect(() => () => stopAudio(), [])

  const currentItem = currentItemIdx !== null ? playableItems[currentItemIdx] : null
  const showPlayer = currentItem !== null

  return (
    <div className="pt-4" style={{ paddingBottom: showPlayer ? 180 : 40 }}>
      <audio ref={audioRef} preload="none" />

      {/* Header con back + dropdown */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <button
          onClick={() => { stopAudio(); onBack() }}
          className="flex items-center gap-1 text-sm text-gray-600 active:scale-95 transition-transform px-2 py-1.5 rounded-xl active:bg-white/50"
        >
          <ChevronLeft size={18} />
          <span className="font-semibold">Volver</span>
        </button>

        <PrayerDropdown selected={selectedPrayer} onSelect={handlePrayerChange} />
      </div>

      {/* Título */}
      <div className="mb-6 px-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Guía completa
        </p>
        <h1 className="text-2xl font-black text-gray-800 mt-0.5">Paso a Paso</h1>
        <p className="text-xs text-gray-500 mt-1">
          {PRAYERS.find(p => p.id === selectedPrayer)?.label} · {totalRakaas} rakaas · {playableItems.length} audios
        </p>
      </div>

      {/* Banner motivacional */}
      <div
        className="relative rounded-3xl px-5 py-4 mb-5 overflow-hidden shadow-md"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/15 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0">
            <Volume2 size={20} className="text-white" strokeWidth={2.3} />
          </div>
          <div>
            <p className="text-white font-black text-sm">Aprende rezando</p>
            <p className="text-white/85 text-[11px] leading-tight mt-0.5">
              Toca cualquier paso para escuchar la pronunciación o la recitación
            </p>
          </div>
        </div>
      </div>

      {/* Pasos */}
      {allStepsByRakaa.map(({ rakaa, steps }, rakaaIdx) => (
        <div key={rakaa}>
          <RakaaHeader rakaa={rakaa} total={totalRakaas} />
          {steps.map((step, stepIdx) => {
            const localKey = `${rakaa}-${step.id}-local`
            const recitKey = `${rakaa}-${step.id}-recitation`
            const localItemIdx = itemIdxByStep.has(localKey) ? itemIdxByStep.get(localKey) : null
            const recitItemIdx = itemIdxByStep.has(recitKey) ? itemIdxByStep.get(recitKey) : null

            return (
              <StepCard
                key={`${rakaa}-${step.id}`}
                step={step}
                stepNumber={stepNumbers[rakaaIdx][stepIdx]}
                gender={userGender}
                localItemIdx={localItemIdx}
                recitItemIdx={recitItemIdx}
                currentItemIdx={currentItemIdx}
                isPlaying={isPlaying}
                onPlayItem={handlePlayItem}
                onOpenLightbox={setLightboxStep}
              />
            )
          })}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
          Taqabbal Allahu minna wa minkum
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Que Allah acepte nuestros rezos</p>
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

      {/* Mini reproductor */}
      <AnimatePresence>
        {showPlayer && (
          <MiniPlayer
            item={currentItem}
            totalItems={playableItems.length}
            currentIdx={currentItemIdx}
            isPlaying={isPlaying}
            speed={speed}
            onPlayPause={handlePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
            onSpeedChange={setSpeed}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
