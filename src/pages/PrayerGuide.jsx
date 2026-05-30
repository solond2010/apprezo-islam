import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Play, Pause, X, ZoomIn, ChevronDown,
  ChevronUp, SkipBack, SkipForward, Volume2, Mic,
  Sunrise, Sun, CloudSun, Sunset, Moon,
} from 'lucide-react'
import { PRAYER_RAKAATS, getStepsForRakaa } from '../data/prayerData'
import { useSettings } from '../context/SettingsContext'
import { buildAyahUrl } from '../data/reciters'

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
   STEP CARD — rediseño profesional
───────────────────────────────────────── */
const StepCard = ({
  step, stepNumber, gender,
  localItemIdx, recitItemIdx,
  currentItemIdx, isPlaying,
  onPlayItem, onOpenLightbox,
  cardRef,
}) => {
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
      ref={cardRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-3xl mb-3 overflow-hidden transition-all duration-300 ${
        isAnyActive ? 'shadow-xl shadow-amber-300/50 scale-[1.01]' : 'shadow-sm'
      }`}
    >
      {/* Glow exterior cuando está activo */}
      {isAnyActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-0.5 rounded-3xl pointer-events-none blur-lg"
          style={{
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
            opacity: 0.4,
          }}
        />
      )}

      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: isAnyActive
            ? 'linear-gradient(180deg, rgba(254,243,199,0.95) 0%, rgba(255,255,255,0.95) 100%)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(14px)',
          border: isAnyActive ? '1.5px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.7)',
        }}
      >
        {/* ─── Header con número grande a la izquierda ─── */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-2">
          <div className="relative flex-shrink-0">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-2xl text-white text-base font-black shadow-md"
              style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
            >
              {stepNumber}
            </div>
            {step.repeat > 1 && (
              <div
                className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-white text-[9px] font-black shadow-sm border-2 border-white"
                style={{ background: '#EA580C' }}
              >
                ×{step.repeat}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-base font-black text-gray-800 leading-tight">{step.name}</h3>
            <p className="text-sm text-amber-700 font-bold mt-0.5" dir="rtl">
              {step.nameAr}
            </p>
          </div>

          {/* Indicador "reproduciendo" */}
          {isAnyActive && isPlaying && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ background: 'linear-gradient(135deg, #FBBF24, #EA580C)' }}
            >
              <Volume2 size={14} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* ─── Imagen ─── */}
        {hasImage && (
          <button
            onClick={() => onOpenLightbox(step)}
            className="w-full flex flex-col items-center px-5 pt-3 group active:scale-[0.98] transition-transform"
          >
            {isSalam ? (
              <div className="flex gap-3 items-end justify-center w-full">
                <div
                  className="flex-1 max-w-[140px] rounded-2xl overflow-hidden border-2 shadow-md"
                  style={{ aspectRatio: '3/4', background: '#FFFBF2', borderColor: 'rgba(251,191,36,0.3)' }}
                >
                  <img
                    src={`${GENDER_FOLDERS[gender] || GENDER_FOLDERS.hombre}/taslim1.png`}
                    alt="Taslim derecha"
                    className="w-full h-full object-contain p-2"
                    onError={(e) => { if (gender !== 'hombre') e.currentTarget.src = `${GENDER_FOLDERS.hombre}/taslim1.png` }}
                  />
                </div>
                <div
                  className="flex-1 max-w-[140px] rounded-2xl overflow-hidden border-2 shadow-md"
                  style={{ aspectRatio: '3/4', background: '#FFFBF2', borderColor: 'rgba(251,191,36,0.3)' }}
                >
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
                className="w-full max-w-[200px] rounded-2xl overflow-hidden border-2 shadow-md relative"
                style={{ aspectRatio: '3/4', background: '#FFFBF2', borderColor: 'rgba(251,191,36,0.3)' }}
              >
                <img
                  src={stepImgUrl}
                  alt={step.name}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => { if (fallbackImg && gender !== 'hombre') e.currentTarget.src = fallbackImg }}
                />
                {/* Botón flotante de ampliar */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center backdrop-blur-md">
                  <ZoomIn size={13} className="text-amber-600" />
                </div>
              </div>
            )}
          </button>
        )}

        {/* ─── Descripción ─── */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-sm text-gray-700 leading-relaxed text-center">{step.description}</p>
          {step.instruction && (
            <p className="text-xs text-gray-500 leading-relaxed mt-1.5 italic text-center">
              {step.instruction}
            </p>
          )}
        </div>

        {/* ─── Nota destacada ─── */}
        {step.note && (
          <div className="mx-5 mt-3 rounded-xl px-3.5 py-2.5 flex items-start gap-2"
            style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">{step.note}</p>
          </div>
        )}

        {/* ─── Texto árabe con marco decorado ─── */}
        {step.arabic && (
          <div className="mx-5 mt-4 rounded-2xl px-4 py-4 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(254,243,199,0.5), rgba(254,215,170,0.4))',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            {/* Decoración esquinas */}
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)' }} />

            <p
              className="text-2xl leading-loose text-amber-900 text-right font-medium relative z-10"
              dir="rtl"
              lang="ar"
            >
              {step.arabic}
            </p>

            {step.transliteration && (
              <>
                <div className="h-px bg-amber-200/60 my-2.5" />
                <p className="text-xs text-amber-800 italic font-semibold leading-relaxed">
                  {step.transliteration}
                </p>
              </>
            )}

            {step.translation && (
              <>
                <div className="h-px bg-amber-200/60 my-2.5" />
                <p className="text-xs text-gray-700 leading-relaxed">{step.translation}</p>
              </>
            )}
          </div>
        )}

        {/* ─── Botones de audio (compactos lado a lado si ambos existen) ─── */}
        {(localItemIdx !== null || recitItemIdx !== null) && (
          <div className={`px-5 mt-4 mb-5 flex gap-2 ${localItemIdx !== null && recitItemIdx !== null ? '' : ''}`}>
            {localItemIdx !== null && (
              <button
                onClick={() => onPlayItem(localItemIdx)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black text-white shadow-md active:scale-[0.97] transition-transform"
                style={{
                  background: isLocalActive
                    ? 'linear-gradient(135deg, #C2410C, #9A3412)'
                    : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
                }}
              >
                {isLocalActive && isPlaying ? <Pause size={14} /> : <Mic size={14} />}
                <span>{isLocalActive && isPlaying ? 'Pausar' : 'Pronunciación'}</span>
              </button>
            )}

            {recitItemIdx !== null && (
              <button
                onClick={() => onPlayItem(recitItemIdx)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black text-white shadow-md active:scale-[0.97] transition-transform"
                style={{
                  background: isRecitActive
                    ? 'linear-gradient(135deg, #C2410C, #9A3412)'
                    : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
                }}
              >
                {isRecitActive && isPlaying ? <Pause size={14} /> : <Volume2 size={14} />}
                <span>{isRecitActive && isPlaying ? 'Pausar' : 'Recitación'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function PrayerGuide({ onBack }) {
  const { userGender, reciter, darkMode } = useSettings()
  const [selectedPrayer, setSelectedPrayer] = useState('fajr')
  const [lightboxStep, setLightboxStep] = useState(null)

  // Reproductor global
  const [currentItemIdx, setCurrentItemIdx] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef(null)
  const sequenceRef = useRef(null)

  // Refs por tarjeta: key = `${rakaa}-${step.id}` → elemento DOM
  // Permite hacer scroll automático al paso activo cuando el audio avanza.
  const cardRefs = useRef({})

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
        if (step.quranRefs?.length > 0) {
          items.push({
            type: 'recitation',
            step,
            rakaa,
            urls: step.quranRefs.map(([s, a]) => buildAyahUrl(reciter.path, s, a)),
          })
        }
      })
    })
    return items
  }, [allStepsByRakaa, userGender, reciter])

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

  // Si cambia el recitador mientras se reproduce un audio del Quran,
  // paramos para que no quede colgado el src antiguo.
  useEffect(() => {
    stopAudio()
    setCurrentItemIdx(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciter.id])

  // ── Auto-scroll al paso activo cuando cambia ──────────────────────────
  // Cuando el audio pasa al siguiente item (avance automático o manual),
  // hacemos scroll suave para que la card quede centrada en pantalla.
  useEffect(() => {
    if (currentItemIdx === null) return
    const item = playableItems[currentItemIdx]
    if (!item) return
    const key = `${item.rakaa}-${item.step.id}`
    const el = cardRefs.current[key]
    if (el && typeof el.scrollIntoView === 'function') {
      // Usamos un pequeño delay para que la transición visual de "activo"
      // se renderice antes del scroll, queda más natural.
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [currentItemIdx, playableItems])

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
          className={`flex items-center gap-1 text-sm active:scale-95 transition-transform px-2 py-1.5 rounded-xl ${
            darkMode ? 'text-gray-300 active:bg-white/10' : 'text-gray-600 active:bg-white/50'
          }`}
        >
          <ChevronLeft size={18} />
          <span className="font-semibold">Volver</span>
        </button>

        <PrayerDropdown selected={selectedPrayer} onSelect={handlePrayerChange} darkMode={darkMode} />
      </div>

      {/* Título */}
      <div className="mb-5 px-1">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Guía completa
        </p>
        <h1 className={`text-2xl font-black mt-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Paso a Paso</h1>
        <div className="flex items-center gap-2 mt-1.5">
          <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className={`font-bold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{PRAYERS.find(p => p.id === selectedPrayer)?.label}</span>
            <span className="text-gray-400">•</span>
            <span>{totalRakaas} rakaas</span>
            <span className="text-gray-400">•</span>
            <span>{playableItems.length} audios</span>
          </div>
        </div>
      </div>

      {/* Banner hero con motivo decorativo */}
      <div
        className="relative rounded-3xl px-5 py-5 mb-6 overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        {/* Decoraciones */}
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15 pointer-events-none" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Volume2 size={22} className="text-white" strokeWidth={2.3} />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base leading-tight">Aprende rezando</p>
            <p className="text-white/90 text-xs leading-relaxed mt-1">
              Toca cualquier paso para escuchar. El audio avanza automáticamente y la pantalla te sigue.
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

            const cardKey = `${rakaa}-${step.id}`
            return (
              <StepCard
                key={cardKey}
                step={step}
                stepNumber={stepNumbers[rakaaIdx][stepIdx]}
                gender={userGender}
                localItemIdx={localItemIdx}
                recitItemIdx={recitItemIdx}
                currentItemIdx={currentItemIdx}
                isPlaying={isPlaying}
                onPlayItem={handlePlayItem}
                onOpenLightbox={setLightboxStep}
                cardRef={(el) => { cardRefs.current[cardKey] = el }}
              />
            )
          })}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className={`text-xs leading-relaxed font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Taqabbal Allahu minna wa minkum
        </p>
        <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Que Allah acepte nuestros rezos</p>
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
