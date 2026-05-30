import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ArrowLeft, Play, Pause,
  SkipBack, SkipForward, BookOpen, X, ChevronUp, Search, Loader2,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { buildAyahUrl } from '../data/reciters'
import { SURAHS, fetchSurahVerses } from '../data/surahsList'

// ── Velocidades disponibles ───────────────────────────────────────────────
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

// ── Mini reproductor global (fijo encima del nav) ─────────────────────────

function MiniPlayer({ surah, currentAyah, isPlaying, speed, onPlayPause, onPrev, onNext, onSpeedChange, onClose, reciter }) {
  const [showSpeeds, setShowSpeeds] = useState(false)
  const verse = surah?.verses[currentAyah]

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      className="fixed left-0 right-0 z-50 px-3"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
    >
      {/* Dropdown de velocidad — aparece encima del player */}
      <AnimatePresence>
        {showSpeeds && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-3 mb-2 rounded-2xl overflow-hidden shadow-2xl z-10"
            style={{ background: 'linear-gradient(135deg, #C2410C, #EA580C)' }}
          >
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => { onSpeedChange(s); setShowSpeeds(false) }}
                className={`flex items-center justify-between w-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  s === speed
                    ? 'bg-white/25 text-white'
                    : 'text-white/80 active:bg-white/15'
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
            animate={{ width: surah ? `${((currentAyah + 1) / surah.verses.length) * 100}%` : '0%' }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <div className="px-4 pt-3 pb-3">
          {/* Info + cerrar */}
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                {surah?.name} · Ayah {(currentAyah ?? 0) + 1} / {surah?.verses.length}
              </p>
              <p className="text-white text-xs font-semibold truncate mt-0.5" dir="rtl">
                {verse?.arabic?.slice(0, 38)}{(verse?.arabic?.length ?? 0) > 38 ? '…' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center active:scale-90 flex-shrink-0"
            >
              <X size={13} className="text-white" />
            </button>
          </div>

          {/* Controles principales */}
          <div className="flex items-center justify-between gap-2">

            {/* Velocidad — dropdown */}
            <button
              onClick={() => setShowSpeeds(v => !v)}
              className="flex items-center gap-1 min-w-[52px] h-9 rounded-xl bg-white/20 px-2.5 active:scale-90 transition-transform"
            >
              <span className="text-[12px] font-black text-white tabular-nums leading-none">
                {speed === 1 ? '1×' : `${speed}×`}
              </span>
              <ChevronUp
                size={11}
                className={`text-white/70 transition-transform ${showSpeeds ? '' : 'rotate-180'}`}
              />
            </button>

            {/* Anterior */}
            <button
              onClick={onPrev}
              disabled={currentAyah === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 disabled:opacity-30 bg-white/20 transition-transform"
            >
              <SkipBack size={18} className="text-white" />
            </button>

            {/* Play / Pause — botón principal */}
            <button
              onClick={onPlayPause}
              className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
            >
              {isPlaying
                ? <Pause size={23} className="text-orange-500" />
                : <Play size={23} className="text-orange-500 ml-0.5" />
              }
            </button>

            {/* Siguiente */}
            <button
              onClick={onNext}
              disabled={!surah || currentAyah >= surah.verses.length - 1}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 disabled:opacity-30 bg-white/20 transition-transform"
            >
              <SkipForward size={18} className="text-white" />
            </button>

            {/* Recitador */}
            <div className="min-w-[52px] max-w-[90px] flex flex-col items-end">
              <span className="text-[8px] text-white/50 font-bold uppercase leading-none tracking-wide">Recitador</span>
              <span className="text-[10px] text-white font-black leading-tight text-right mt-0.5 truncate w-full">
                {reciter?.name || 'Al-Sudais'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Detalle de surah ──────────────────────────────────────────────────────

function SurahDetail({ surah, onBack, fontSize, darkMode, reciter }) {
  const [currentAyah, setCurrentAyah] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const audioRef = useRef(null)
  const ayahRefs = useRef([])
  const sequenceRef = useRef(null)

  // Cargar los versículos de la surah (desde caché o API)
  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(false)
    setVerses([])
    fetchSurahVerses(surah.num)
      .then((v) => { if (alive) { setVerses(v); setLoading(false) } })
      .catch(() => { if (alive) { setError(true); setLoading(false) } })
    return () => { alive = false }
  }, [surah.num])

  // Limpiar audio al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    }
  }, [])

  // Scroll al ayah activo
  useEffect(() => {
    if (currentAyah !== null && ayahRefs.current[currentAyah]) {
      ayahRefs.current[currentAyah].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentAyah])

  // Aplicar velocidad al audio en tiempo real sin interrumpir la reproducción
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      audioRef.current.defaultPlaybackRate = speed
    }
  }, [speed])

  const playFrom = useCallback((startIdx) => {
    const audio = audioRef.current
    if (!audio) return

    const token = Symbol()
    sequenceRef.current = token

    function advance(idx) {
      // Limpiar handlers antes de hacer cualquier cosa
      // para evitar que un error del src anterior dispare el siguiente ayah
      audio.onended = null
      audio.onerror = null

      if (sequenceRef.current !== token) return

      if (idx >= verses.length) {
        setIsPlaying(false)
        setCurrentAyah(null)
        sequenceRef.current = null
        return
      }

      const verse = verses[idx]
      setCurrentAyah(idx)
      setIsPlaying(true)

      // Cambiar src y cargar explícitamente
      audio.src = buildAyahUrl(reciter.path, surah.num, verse.ayah)
      audio.load()

      // Aplicar velocidad después del load (algunos browsers la resetean)
      const rate = audioRef.current.defaultPlaybackRate || 1
      audio.playbackRate = rate

      // Asignar handlers DESPUÉS del load() para que no cojan eventos del src anterior
      audio.onended = () => advance(idx + 1)
      audio.onerror = () => advance(idx + 1)

      // play() — el .catch solo captura bloqueo de autoplay, no errores de red
      // (esos los maneja onerror para evitar el doble avance)
      audio.play().catch((err) => {
        if (err.name === 'NotAllowedError' && sequenceRef.current === token) {
          setIsPlaying(false)
        }
      })
    }

    advance(startIdx)
  }, [surah, reciter, verses])

  function stopAudio() {
    sequenceRef.current = null // invalida el token activo
    const audio = audioRef.current
    if (audio) {
      audio.onended = null
      audio.onerror = null
      audio.pause()
      audio.src = ''
    }
    setIsPlaying(false)
  }

  function handlePlayPause() {
    if (isPlaying) {
      stopAudio()
    } else {
      playFrom(currentAyah !== null ? currentAyah : 0)
    }
  }

  function handleAyahPlay(idx) {
    stopAudio()
    setTimeout(() => playFrom(idx), 40)
  }

  function handlePrev() {
    if (currentAyah === null || currentAyah === 0) return
    stopAudio()
    setTimeout(() => playFrom(currentAyah - 1), 40)
  }

  function handleNext() {
    if (currentAyah === null || currentAyah >= verses.length - 1) return
    stopAudio()
    setTimeout(() => playFrom(currentAyah + 1), 40)
  }

  function handleClose() {
    stopAudio()
    setCurrentAyah(null)
  }

  const showPlayer = currentAyah !== null

  return (
    <>
      <audio ref={audioRef} preload="none" />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex flex-col"
        style={{ paddingBottom: showPlayer ? 160 : 24 }}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 pt-4 pb-3 sticky top-0 z-10 ${
          darkMode ? 'bg-[#121212]' : 'bg-transparent'
        }`}>
          <button
            onClick={onBack}
            className={`p-2 rounded-xl active:scale-90 transition-transform ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {surah.name}
            </h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {surah.nameAr} · {surah.meaning} · {surah.ayahs} ayahs
            </p>
          </div>
          {/* Reproducir todo */}
          <button
            onClick={() => { stopAudio(); setTimeout(() => playFrom(0), 40) }}
            disabled={loading || error || verses.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95 transition-transform shadow-md disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C2410C, #EA580C)' }}
          >
            <Play size={13} className="fill-white" />
            Todo
          </button>
        </div>

        {/* Hero card de la surah */}
        <div
          className="relative rounded-3xl px-5 py-6 mb-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #431407 0%, #7C2D12 50%, #C2410C 100%)' }}
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 mb-3">
                <BookOpen size={11} className="text-amber-300" />
                <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest">Sagrado Corán</span>
              </div>
              <h3 className="text-2xl font-black text-white">{surah.name}</h3>
              <p className="text-sm text-white/70 mt-1">{surah.meaning} · {surah.ayahs} ayahs</p>
              <p className="text-xs text-white/50 mt-1">Recitador: {reciter?.name || 'Al-Sudais'}</p>
            </div>
            <p className="text-4xl text-amber-200/80 font-light" dir="rtl">{surah.nameAr}</p>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="text-amber-500 animate-spin" />
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Cargando versículos…
            </p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              No se pudieron cargar los versículos
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Revisa tu conexión a internet e inténtalo de nuevo.
            </p>
            <button
              onClick={() => {
                setLoading(true); setError(false)
                fetchSurahVerses(surah.num)
                  .then((v) => { setVerses(v); setLoading(false) })
                  .catch(() => { setError(true); setLoading(false) })
              }}
              className="mt-1 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md active:scale-95"
              style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de ayahs */}
        {!loading && !error && (
        <div className="flex flex-col gap-3">
          {verses.map((verse, idx) => {
            const isActive = currentAyah === idx
            return (
              <motion.div
                key={idx}
                ref={(el) => (ayahRefs.current[idx] = el)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
                  isActive
                    ? 'shadow-lg shadow-orange-200/40'
                    : ''
                }`}
              >
                {/* Fondo según estado */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)'
                      : darkMode
                        ? 'rgba(30,30,30,0.8)'
                        : 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(12px)',
                  }}
                />

                <div className="relative z-10 px-4 pt-4 pb-3">
                  {/* Número de ayah + botón play */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-white/25' : darkMode ? 'bg-white/10' : 'bg-amber-100'
                    }`}>
                      <span className={`text-xs font-black tabular-nums ${
                        isActive ? 'text-white' : darkMode ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                        {idx + 1}
                      </span>
                    </div>

                    <button
                      onClick={() => isActive && isPlaying ? stopAudio() : handleAyahPlay(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:scale-90 transition-all ${
                        isActive
                          ? 'bg-white/20'
                          : darkMode
                            ? 'bg-white/10 border border-white/10'
                            : 'bg-amber-50 border border-amber-200'
                      }`}
                    >
                      {isActive && isPlaying
                        ? <Pause size={13} className={isActive ? 'text-white' : darkMode ? 'text-amber-400' : 'text-amber-600'} />
                        : <Play size={13} className={`${isActive ? 'text-white' : darkMode ? 'text-amber-400' : 'text-amber-600'} ml-0.5`} />
                      }
                      <span className={`text-[11px] font-bold ${
                        isActive ? 'text-white' : darkMode ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                        {isActive && isPlaying ? 'Pausar' : 'Escuchar'}
                      </span>
                    </button>
                  </div>

                  {/* Árabe */}
                  <p
                    className={`text-2xl leading-loose text-right mb-3 ${
                      isActive ? 'text-white' : darkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}
                    dir="rtl"
                    lang="ar"
                  >
                    {verse.arabic}
                    {isActive && isPlaying && (
                      <motion.span
                        className="inline-block ml-2 text-base"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🔊
                      </motion.span>
                    )}
                  </p>

                  {/* Separador */}
                  <div className={`h-px mb-3 ${isActive ? 'bg-white/30' : darkMode ? 'bg-white/10' : 'bg-gray-100'}`} />

                  {/* Transliteración */}
                  <p
                    className={`italic leading-relaxed mb-1.5 ${
                      isActive ? 'text-white font-semibold' : darkMode ? 'text-gray-300 font-medium' : 'text-gray-600 font-medium'
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {verse.transliteracion}
                  </p>

                  {/* Traducción */}
                  <p className={`text-sm leading-relaxed ${
                    isActive ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {verse.traduccion}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        )}
      </motion.div>

      {/* Mini reproductor persistente */}
      <AnimatePresence>
        {showPlayer && (
          <MiniPlayer
            surah={{ ...surah, verses }}
            currentAyah={currentAyah}
            isPlaying={isPlaying}
            speed={speed}
            onPlayPause={handlePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
            onSpeedChange={setSpeed}
            onClose={handleClose}
            reciter={reciter}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Lista de surahs ───────────────────────────────────────────────────────

function SurahList({ onSelect, darkMode, reciter }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SURAHS
    return SURAHS.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      s.nameAr.includes(q) ||
      String(s.num) === q
    )
  }, [query])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="pt-4 pb-2"
    >
      {/* Header */}
      <div className="mb-5 px-1">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Sagrado Corán
        </p>
        <h1 className={`text-2xl font-black mt-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Surahs
        </h1>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Recitador: {reciter?.name || 'Al-Sudais'} · {SURAHS.length} surahs completas
        </p>
      </div>

      {/* Banner recitador */}
      <div
        className="relative rounded-3xl px-5 py-5 mb-4 overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/20 pointer-events-none" />
        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Recitador activo</p>
        <h3 className="text-xl font-black text-white">{reciter?.name || 'Al-Sudais'}</h3>
        <p className="text-xs text-white/80 mt-1">{reciter?.desc || 'Imam de La Meca'}</p>
        <p className="text-[10px] text-white/60 mt-2 italic">Puedes cambiarlo en Ajustes</p>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search
          size={17}
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar surah por nombre o número…"
          className={`w-full pl-11 pr-10 py-3 rounded-2xl text-sm font-medium shadow-sm border outline-none focus:ring-2 focus:ring-amber-400/50 transition-shadow ${
            darkMode
              ? 'bg-[#1e1e1e]/70 backdrop-blur-md border-[#2a2a2a] text-white placeholder:text-gray-500'
              : 'bg-white/70 backdrop-blur-md border-white/60 text-gray-800 placeholder:text-gray-400'
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200/80 flex items-center justify-center active:scale-90"
          >
            <X size={12} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((s, i) => (
          <motion.button
            key={s.num}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i, 12) * 0.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(s)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl shadow-sm border text-left transition-colors ${
              darkMode
                ? 'bg-[#1e1e1e]/70 backdrop-blur-md border-[#2a2a2a] active:bg-[#2a2a2a]'
                : 'bg-white/70 backdrop-blur-md border-white/60 active:bg-white/90'
            }`}
          >
            {/* Número */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-sm font-black text-white tabular-nums">{s.num}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{s.name}</p>
                <span className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s.meaning}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {s.ayahs} ayahs
                </span>
                <span className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>·</span>
                <div className="flex items-center gap-1">
                  <Play size={9} className="text-amber-500" />
                  <span className={`text-[10px] font-semibold ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
                    {reciter?.name || 'Al-Sudais'}
                  </span>
                </div>
              </div>
            </div>

            {/* Árabe + flecha */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xl ${darkMode ? 'text-gray-300' : 'text-amber-700'}`} dir="rtl">
                {s.nameAr}
              </span>
              <ChevronRight size={16} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
            </div>
          </motion.button>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No se encontró ninguna surah para «{query}»
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────

export default function Surahs() {
  const [selected, setSelected] = useState(null)
  const { fontSize, darkMode, reciter } = useSettings()

  return (
    <div className="pt-0 pb-2">
      <AnimatePresence mode="wait">
        {selected === null ? (
          <SurahList key="list" onSelect={setSelected} darkMode={darkMode} reciter={reciter} />
        ) : (
          <SurahDetail
            key={`surah-${selected.num}`}
            surah={selected}
            onBack={() => setSelected(null)}
            fontSize={fontSize}
            darkMode={darkMode}
            reciter={reciter}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
