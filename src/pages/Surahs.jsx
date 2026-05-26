import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ArrowLeft, Play, Pause,
  SkipBack, SkipForward, BookOpen, X, ChevronUp,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

// ── Recitador: Al-Sudais 192kbps ─────────────────────────────────────────
const EA = 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps'
function ayahUrl(surah, ayah) {
  return `${EA}/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
}

// ── Velocidades disponibles ───────────────────────────────────────────────
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

// ── Datos de surahs ───────────────────────────────────────────────────────
const surahs = [
  {
    id: 1, surahNum: 1,
    name: 'Al-Fatiha', nameAr: 'الفاتحة', meaning: 'La Apertura',
    verses: [
      { ayah: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteracion: 'Bismil-lahi r-rahmani r-rahim', traduccion: 'En el nombre de Dios, el Clemente, el Misericordioso' },
      { ayah: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteracion: 'Al-hamdu lil-lahi rabil-alamin', traduccion: 'Alabado sea Dios, Señor de todos los mundos' },
      { ayah: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', transliteracion: 'Ar-rahmani r-rahim', traduccion: 'El Clemente, el Misericordioso' },
      { ayah: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', transliteracion: 'Maliki yawmid-din', traduccion: 'Soberano del Día del Juicio' },
      { ayah: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteracion: "Iyaka na'budu wa iyaka nasta'in", traduccion: 'Solo a Ti te adoramos y solo a Ti pedimos ayuda' },
      { ayah: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteracion: 'Ihdinas-siratal mustaqim', traduccion: 'Guíanos por el camino recto' },
      { ayah: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", transliteracion: "Siratal ladina an'amta 'alayhim, gayril magdubi 'alayhim, walad-dalin", traduccion: 'El camino de quienes has bendecido, no el de los que cayeron en ira, ni el de los extraviados' },
    ],
  },
  {
    id: 2, surahNum: 112,
    name: 'Al-Ikhlas', nameAr: 'الإخلاص', meaning: 'La Sinceridad',
    verses: [
      { ayah: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteracion: 'Qul huwal-lahu ahad', traduccion: 'Di: Él es Dios, Uno' },
      { ayah: 2, arabic: 'اللَّهُ الصَّمَدُ', transliteracion: 'Al-lahus-samad', traduccion: 'Dios, el Absoluto' },
      { ayah: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteracion: 'Lam yalid wa lam yulad', traduccion: 'No ha engendrado ni ha sido engendrado' },
      { ayah: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteracion: 'Wa lam yakun lahu kufuwan ahad', traduccion: 'Y no hay nadie comparable a Él' },
    ],
  },
  {
    id: 3, surahNum: 113,
    name: 'Al-Falaq', nameAr: 'الفلق', meaning: 'El Amanecer',
    verses: [
      { ayah: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', transliteracion: "Qul a'udhu bi rabbi l-falaq", traduccion: 'Di: Me refugio en el Señor del amanecer' },
      { ayah: 2, arabic: 'مِن شَرِّ مَا خَلَقَ', transliteracion: 'Min sharri ma khalaq', traduccion: 'Del mal de todo lo que Él ha creado' },
      { ayah: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', transliteracion: 'Wa min sharri ghasiqin idha waqab', traduccion: 'Y del mal de la oscuridad cuando se extiende' },
      { ayah: 4, arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', transliteracion: "Wa min sharrin-naffathati fil-'uqad", traduccion: 'Y del mal de las que soplan sobre los nudos' },
      { ayah: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', transliteracion: 'Wa min sharri hasidin idha hasad', traduccion: 'Y del mal del envidioso cuando envidia' },
    ],
  },
  {
    id: 4, surahNum: 114,
    name: 'An-Nas', nameAr: 'الناس', meaning: 'La Humanidad',
    verses: [
      { ayah: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteracion: "Qul a'udhu bi rabbi n-nas", traduccion: 'Di: Me refugio en el Señor de la humanidad' },
      { ayah: 2, arabic: 'مَلِكِ النَّاسِ', transliteracion: 'Maliki n-nas', traduccion: 'Rey de la humanidad' },
      { ayah: 3, arabic: 'إِلَٰهِ النَّاسِ', transliteracion: 'Ilahi n-nas', traduccion: 'Dios de la humanidad' },
      { ayah: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteracion: 'Min sharril-waswasil-khannasi', traduccion: 'Del mal del susurrador que se esconde' },
      { ayah: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteracion: 'Alladhi yuwaswisu fi suduri n-nas', traduccion: 'Que susurra en los pechos de la humanidad' },
      { ayah: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteracion: 'Minal-jinnati wan-nas', traduccion: 'Sea de los genios o de los hombres' },
    ],
  },
  {
    id: 5, surahNum: 109,
    name: 'Al-Kafiroun', nameAr: 'الكافرون', meaning: 'Los Incrédulos',
    verses: [
      { ayah: 1, arabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', transliteracion: 'Qul ya ayyuhal-kafirun', traduccion: 'Di: ¡Oh, incrédulos!' },
      { ayah: 2, arabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', transliteracion: "La a'budu ma ta'budun", traduccion: 'No adoro lo que vosotros adoráis' },
      { ayah: 3, arabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', transliteracion: "Wa la antum 'abiduna ma a'bud", traduccion: 'Ni vosotros adoráis lo que yo adoro' },
      { ayah: 4, arabic: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ', transliteracion: "Wa la ana 'abidun ma 'abadtum", traduccion: 'Ni yo seré adorador de lo que vosotros adoráis' },
      { ayah: 5, arabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', transliteracion: "Wa la antum 'abiduna ma a'bud", traduccion: 'Ni vosotros adoráis lo que yo adoro' },
      { ayah: 6, arabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', transliteracion: 'Lakum dinukum wa liya din', traduccion: 'Para vosotros vuestra religión, y para mí la mía' },
    ],
  },
  {
    id: 6, surahNum: 108,
    name: 'Al-Kawthar', nameAr: 'الكوثر', meaning: 'La Abundancia',
    verses: [
      { ayah: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', transliteracion: "Inna a'tayna kal-kawthar", traduccion: 'En verdad te hemos dado la abundancia' },
      { ayah: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', transliteracion: 'Fasalli li rabbika wan-har', traduccion: 'Así que ora a tu Señor y ofrece el sacrificio' },
      { ayah: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteracion: "Inna shani'aka huwal-abtar", traduccion: 'Quien te odia es el que está verdaderamente cortado' },
    ],
  },
  {
    id: 7, surahNum: 103,
    name: 'Al-Asr', nameAr: 'العصر', meaning: 'El Tiempo',
    verses: [
      { ayah: 1, arabic: 'وَالْعَصْرِ', transliteracion: "Wal-'asr", traduccion: '¡Por el tiempo!' },
      { ayah: 2, arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', transliteracion: 'Innal-insana lafi khusr', traduccion: 'El ser humano está ciertamente en pérdida' },
      { ayah: 3, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', transliteracion: "Illal-ladhina amanu wa 'amilus-salihati wa tawassaw bil-haqqi wa tawassaw bis-sabr", traduccion: 'Excepto los que creen, hacen buenas obras, se exhortan a la verdad y se exhortan a la paciencia' },
    ],
  },
  {
    id: 8, surahNum: 110,
    name: 'An-Nasr', nameAr: 'النصر', meaning: 'La Victoria',
    verses: [
      { ayah: 1, arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', transliteracion: "Idha ja'a nasrullahi wal-fath", traduccion: 'Cuando llegue la ayuda de Dios y la victoria' },
      { ayah: 2, arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', transliteracion: "Wa ra'aytan-nasa yadkhuluna fi dinil-lahi afwaja", traduccion: 'Y veas a la gente entrar en la religión de Dios en multitudes' },
      { ayah: 3, arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا', transliteracion: 'Fasabbih bihamdi rabbika wastaghfirhu innahu kana tawwaba', traduccion: 'Entonces glorifica a tu Señor con Su alabanza y pídele perdón; Él es siempre indulgente' },
    ],
  },
  {
    id: 9, surahNum: 105,
    name: 'Al-Fil', nameAr: 'الفيل', meaning: 'El Elefante',
    verses: [
      { ayah: 1, arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', transliteracion: "Alam tara kayfa fa'ala rabbuka bi-as-habil-fil", traduccion: '¿No has visto cómo actuó tu Señor con los del elefante?' },
      { ayah: 2, arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', transliteracion: "Alam yaj'al kaydahum fi tadlil", traduccion: '¿Acaso no frustró su plan?' },
      { ayah: 3, arabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', transliteracion: "Wa arsala 'alayhim tayran ababila", traduccion: 'Y envió contra ellos bandadas de pájaros' },
      { ayah: 4, arabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', transliteracion: 'Tarmihim bihijaratin min sijjil', traduccion: 'Que les arrojaron piedras de arcilla endurecida' },
      { ayah: 5, arabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ', transliteracion: "Faja'alahum ka'asfin ma'kul", traduccion: 'Y los dejó como paja devorada' },
    ],
  },
  {
    id: 10, surahNum: 107,
    name: 'Al-Maun', nameAr: 'الماعون', meaning: 'La Ayuda Mutua',
    verses: [
      { ayah: 1, arabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', transliteracion: "Ara'aytal-ladhi yukadhibu bid-din", traduccion: '¿Has visto a quien desmiente el Juicio?' },
      { ayah: 2, arabic: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', transliteracion: "Fadhalika l-ladhi yadu'ul-yatim", traduccion: 'Ese es quien rechaza brutalmente al huérfano' },
      { ayah: 3, arabic: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', transliteracion: "Wa la yahuddu 'ala ta'amil-miskin", traduccion: 'Y no incita a alimentar al pobre' },
      { ayah: 4, arabic: 'فَوَيْلٌ لِّلْمُصَلِّينَ', transliteracion: 'Fawaylun lil-musallin', traduccion: '¡Ay de los que oran' },
      { ayah: 5, arabic: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ', transliteracion: 'Alladhina hum an salatihim sahun', traduccion: 'Pero son negligentes en su oración!' },
      { ayah: 6, arabic: 'الَّذِينَ هُمْ يُرَاءُونَ', transliteracion: "Alladhina hum yura'un", traduccion: 'Los que actúan por ostentación' },
      { ayah: 7, arabic: 'وَيَمْنَعُونَ الْمَاعُونَ', transliteracion: "Wa yamna'unal-ma'un", traduccion: 'Y niegan la ayuda más pequeña' },
    ],
  },
]

// ── Mini reproductor global (fijo encima del nav) ─────────────────────────

function MiniPlayer({ surah, currentAyah, isPlaying, speed, onPlayPause, onPrev, onNext, onSpeedChange, onClose }) {
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
        style={{ background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 60%, #F97316 100%)' }}
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
            <div className="min-w-[52px] flex flex-col items-end">
              <span className="text-[8px] text-white/50 font-bold uppercase leading-none tracking-wide">Recitador</span>
              <span className="text-[10px] text-white font-black leading-tight text-right mt-0.5">Al-Sudais</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Detalle de surah ──────────────────────────────────────────────────────

function SurahDetail({ surah, onBack, fontSize, darkMode }) {
  const [currentAyah, setCurrentAyah] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef(null)
  const ayahRefs = useRef([])
  const sequenceRef = useRef(null)

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

    // Usar un token para cancelar la secuencia si se llama stopAudio
    const token = Symbol()
    sequenceRef.current = token

    function playIndex(idx) {
      // Secuencia cancelada externamente
      if (sequenceRef.current !== token) return

      // Fin de la surah
      if (idx >= surah.verses.length) {
        setIsPlaying(false)
        setCurrentAyah(null)
        sequenceRef.current = null
        return
      }

      const verse = surah.verses[idx]
      setCurrentAyah(idx)
      setIsPlaying(true)

      // Usar onended/onerror en lugar de addEventListener
      // así se sobreescriben solos y nunca se acumulan listeners
      audio.onended = () => { if (sequenceRef.current === token) playIndex(idx + 1) }
      audio.onerror = () => { if (sequenceRef.current === token) playIndex(idx + 1) }

      // Cambiar src SIN llamar load() — play() lo hace internamente
      audio.src = ayahUrl(surah.surahNum, verse.ayah)
      audio.playbackRate = audioRef.current.playbackRate || 1

      const p = audio.play()
      if (p) p.catch(() => { if (sequenceRef.current === token) playIndex(idx + 1) })
    }

    playIndex(startIdx)
  }, [surah])

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
    if (currentAyah === null || currentAyah >= surah.verses.length - 1) return
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
              {surah.nameAr} · {surah.meaning} · {surah.verses.length} ayahs
            </p>
          </div>
          {/* Reproducir todo */}
          <button
            onClick={() => { stopAudio(); setTimeout(() => playFrom(0), 40) }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95 transition-transform shadow-md"
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
              <p className="text-sm text-white/70 mt-1">{surah.meaning} · {surah.verses.length} ayahs</p>
              <p className="text-xs text-white/50 mt-1">Recitador: Al-Sudais</p>
            </div>
            <p className="text-4xl text-amber-200/80 font-light" dir="rtl">{surah.nameAr}</p>
          </div>
        </div>

        {/* Lista de ayahs */}
        <div className="flex flex-col gap-3">
          {surah.verses.map((verse, idx) => {
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
      </motion.div>

      {/* Mini reproductor persistente */}
      <AnimatePresence>
        {showPlayer && (
          <MiniPlayer
            surah={surah}
            currentAyah={currentAyah}
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
    </>
  )
}

// ── Lista de surahs ───────────────────────────────────────────────────────

function SurahList({ onSelect, darkMode }) {
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
          Recitador: Al-Sudais · {surahs.length} surahs disponibles
        </p>
      </div>

      {/* Banner recitador */}
      <div
        className="relative rounded-3xl px-5 py-5 mb-5 overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/20 pointer-events-none" />
        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Recitador activo</p>
        <h3 className="text-xl font-black text-white">Sheikh Al-Sudais</h3>
        <p className="text-xs text-white/80 mt-1">Imam de la Gran Mezquita de La Meca · 192kbps</p>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2.5">
        {surahs.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
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
              <span className="text-sm font-black text-white tabular-nums">{s.id}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{s.name}</p>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s.meaning}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {s.verses.length} ayahs
                </span>
                <span className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>·</span>
                <div className="flex items-center gap-1">
                  <Play size={9} className={darkMode ? 'text-amber-500' : 'text-amber-500'} />
                  <span className={`text-[10px] font-semibold ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
                    Al-Sudais
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
      </div>
    </motion.div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────

export default function Surahs() {
  const [selected, setSelected] = useState(null)
  const { fontSize, darkMode } = useSettings()

  return (
    <div className="pt-0 pb-2">
      <AnimatePresence mode="wait">
        {selected === null ? (
          <SurahList key="list" onSelect={setSelected} darkMode={darkMode} />
        ) : (
          <SurahDetail
            key={`surah-${selected.id}`}
            surah={selected}
            onBack={() => setSelected(null)}
            fontSize={fontSize}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
