import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowLeft, Play, Square, SkipBack } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const EA = 'https://everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com'
function ayahUrl(surah, ayah) {
  return `${EA}/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`
}

const surahs = [
  {
    id: 1,
    surahNum: 1,
    name: 'Al-Fatiha',
    nameAr: 'الفاتحة',
    meaning: 'La Apertura',
    verses: [
      {
        ayah: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteracion: 'Bismil-lahi r-rahmani r-rahim',
        traduccion: 'En el nombre de Dios, el Clemente, el Misericordioso',
      },
      {
        ayah: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteracion: 'Al-hamdu lil-lahi rabil-alamin',
        traduccion: 'Alabado sea Dios, Señor de todos los mundos',
      },
      {
        ayah: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteracion: 'Ar-rahmani r-rahim',
        traduccion: 'El Clemente, el Misericordioso',
      },
      {
        ayah: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteracion: 'Maliki yawmid-din',
        traduccion: 'Soberano del Día del Juicio',
      },
      {
        ayah: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteracion: "Iyaka na'budu wa iyaka nasta'in",
        traduccion: 'Solo a Ti te adoramos y solo a Ti pedimos ayuda',
      },
      {
        ayah: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteracion: 'Ihdinas-siratal mustaqim',
        traduccion: 'Guíanos por el camino recto',
      },
      {
        ayah: 7,
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteracion: "Siratal ladina an'amta 'alayhim, gayril magdubi 'alayhim, walad-dalin",
        traduccion: 'El camino de quienes has bendecido, no el de los que cayeron en ira, ni el de los extraviados',
      },
    ],
  },
  {
    id: 2,
    surahNum: 112,
    name: 'Al-Ikhlas',
    nameAr: 'الإخلاص',
    meaning: 'La Sinceridad',
    verses: [
      {
        ayah: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteracion: 'Qul huwal-lahu ahad',
        traduccion: 'Di: Él es Dios, Uno',
      },
      {
        ayah: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteracion: 'Al-lahus-samad',
        traduccion: 'Dios, el Absoluto',
      },
      {
        ayah: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteracion: 'Lam yalid wa lam yulad',
        traduccion: 'No ha engendrado ni ha sido engendrado',
      },
      {
        ayah: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteracion: 'Wa lam yakun lahu kufuwan ahad',
        traduccion: 'Y no hay nadie comparable a Él',
      },
    ],
  },
  {
    id: 3,
    surahNum: 113,
    name: 'Al-Falaq',
    nameAr: 'الفلق',
    meaning: 'El Amanecer',
    verses: [
      {
        ayah: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteracion: "Qul a'udhu bi rabbi l-falaq",
        traduccion: 'Di: Me refugio en el Señor del amanecer',
      },
      {
        ayah: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteracion: 'Min sharri ma khalaq',
        traduccion: 'Del mal de todo lo que Él ha creado',
      },
      {
        ayah: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteracion: 'Wa min sharri ghasiqin idha waqab',
        traduccion: 'Y del mal de la oscuridad cuando se extiende',
      },
      {
        ayah: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transliteracion: "Wa min sharrin-naffathati fil-'uqad",
        traduccion: 'Y del mal de las que soplan sobre los nudos',
      },
      {
        ayah: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteracion: 'Wa min sharri hasidin idha hasad',
        traduccion: 'Y del mal del envidioso cuando envidia',
      },
    ],
  },
  {
    id: 4,
    surahNum: 114,
    name: 'An-Nas',
    nameAr: 'الناس',
    meaning: 'La Humanidad',
    verses: [
      {
        ayah: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteracion: "Qul a'udhu bi rabbi n-nas",
        traduccion: 'Di: Me refugio en el Señor de la humanidad',
      },
      {
        ayah: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transliteracion: 'Maliki n-nas',
        traduccion: 'Rey de la humanidad',
      },
      {
        ayah: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transliteracion: 'Ilahi n-nas',
        traduccion: 'Dios de la humanidad',
      },
      {
        ayah: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliteracion: 'Min sharril-waswasil-khannasi',
        traduccion: 'Del mal del susurrador que se esconde',
      },
      {
        ayah: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliteracion: 'Alladhi yuwaswisu fi suduri n-nas',
        traduccion: 'Que susurra en los pechos de la humanidad',
      },
      {
        ayah: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteracion: 'Minal-jinnati wan-nas',
        traduccion: 'Sea de los genios o de los hombres',
      },
    ],
  },
  {
    id: 5,
    surahNum: 109,
    name: 'Al-Kafiroun',
    nameAr: 'الكافرون',
    meaning: 'Los Incrédulos',
    verses: [
      {
        ayah: 1,
        arabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ',
        transliteracion: 'Qul ya ayyuhal-kafirun',
        traduccion: 'Di: ¡Oh, incrédulos!',
      },
      {
        ayah: 2,
        arabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ',
        transliteracion: "La a'budu ma ta'budun",
        traduccion: 'No adoro lo que vosotros adoráis',
      },
      {
        ayah: 3,
        arabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
        transliteracion: "Wa la antum 'abiduna ma a'bud",
        traduccion: 'Ni vosotros adoráis lo que yo adoro',
      },
      {
        ayah: 4,
        arabic: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ',
        transliteracion: "Wa la ana 'abidun ma 'abadtum",
        traduccion: 'Ni yo seré adorador de lo que vosotros adoráis',
      },
      {
        ayah: 5,
        arabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
        transliteracion: "Wa la antum 'abiduna ma a'bud",
        traduccion: 'Ni vosotros adoráis lo que yo adoro',
      },
      {
        ayah: 6,
        arabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
        transliteracion: 'Lakum dinukum wa liya din',
        traduccion: 'Para vosotros vuestra religión, y para mí la mía',
      },
    ],
  },
  {
    id: 6,
    surahNum: 108,
    name: 'Al-Kawthar',
    nameAr: 'الكوثر',
    meaning: 'La Abundancia',
    verses: [
      {
        ayah: 1,
        arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        transliteracion: "Inna a'tayna kal-kawthar",
        traduccion: 'En verdad te hemos dado la abundancia',
      },
      {
        ayah: 2,
        arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        transliteracion: 'Fasalli li rabbika wan-har',
        traduccion: 'Así que ora a tu Señor y ofrece el sacrificio',
      },
      {
        ayah: 3,
        arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        transliteracion: "Inna shani'aka huwal-abtar",
        traduccion: 'Quien te odia es el que está verdaderamente cortado',
      },
    ],
  },
  {
    id: 7,
    surahNum: 103,
    name: 'Al-Asr',
    nameAr: 'العصر',
    meaning: 'El Tiempo',
    verses: [
      {
        ayah: 1,
        arabic: 'وَالْعَصْرِ',
        transliteracion: "Wal-'asr",
        traduccion: '¡Por el tiempo!',
      },
      {
        ayah: 2,
        arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        transliteracion: 'Innal-insana lafi khusr',
        traduccion: 'El ser humano está ciertamente en pérdida',
      },
      {
        ayah: 3,
        arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        transliteracion: "Illal-ladhina amanu wa 'amilus-salihati wa tawassaw bil-haqqi wa tawassaw bis-sabr",
        traduccion: 'Excepto los que creen, hacen buenas obras, se exhortan a la verdad y se exhortan a la paciencia',
      },
    ],
  },
  {
    id: 8,
    surahNum: 110,
    name: 'An-Nasr',
    nameAr: 'النصر',
    meaning: 'La Victoria',
    verses: [
      {
        ayah: 1,
        arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
        transliteracion: "Idha ja'a nasrullahi wal-fath",
        traduccion: 'Cuando llegue la ayuda de Dios y la victoria',
      },
      {
        ayah: 2,
        arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
        transliteracion: "Wa ra'aytan-nasa yadkhuluna fi dinil-lahi afwaja",
        traduccion: 'Y veas a la gente entrar en la religión de Dios en multitudes',
      },
      {
        ayah: 3,
        arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا',
        transliteracion: 'Fasabbih bihamdi rabbika wastaghfirhu innahu kana tawwaba',
        traduccion: 'Entonces glorifica a tu Señor con Su alabanza y pídele perdón; Él es siempre indulgente',
      },
    ],
  },
  {
    id: 9,
    surahNum: 105,
    name: 'Al-Fil',
    nameAr: 'الفيل',
    meaning: 'El Elefante',
    verses: [
      {
        ayah: 1,
        arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
        transliteracion: 'Alam tara kayfa fa\'ala rabbuka bi-as-habil-fil',
        traduccion: '¿No has visto cómo actuó tu Señor con los del elefante?',
      },
      {
        ayah: 2,
        arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
        transliteracion: 'Alam yaj\'al kaydahum fi tadlil',
        traduccion: '¿Acaso no frustró su plan?',
      },
      {
        ayah: 3,
        arabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
        transliteracion: "Wa arsala 'alayhim tayran ababila",
        traduccion: 'Y envió contra ellos bandadas de pájaros',
      },
      {
        ayah: 4,
        arabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
        transliteracion: 'Tarmihim bihijaratin min sijjil',
        traduccion: 'Que les arrojaron piedras de arcilla endurecida',
      },
      {
        ayah: 5,
        arabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ',
        transliteracion: "Faja'alahum ka'asfin ma'kul",
        traduccion: 'Y los dejó como paja devorada',
      },
    ],
  },
  {
    id: 10,
    surahNum: 107,
    name: 'Al-Maun',
    nameAr: 'الماعون',
    meaning: 'La Ayuda Mutua',
    verses: [
      {
        ayah: 1,
        arabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ',
        transliteracion: "Ara'aytal-ladhi yukadhibu bid-din",
        traduccion: '¿Has visto a quien desmiente el Juicio?',
      },
      {
        ayah: 2,
        arabic: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
        transliteracion: "Fadhalika l-ladhi yadu'ul-yatim",
        traduccion: 'Ese es quien rechaza brutalmente al huérfano',
      },
      {
        ayah: 3,
        arabic: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
        transliteracion: "Wa la yahuddu 'ala ta'amil-miskin",
        traduccion: 'Y no incita a alimentar al pobre',
      },
      {
        ayah: 4,
        arabic: 'فَوَيْلٌ لِّلْمُصَلِّينَ',
        transliteracion: 'Fawaylun lil-musallin',
        traduccion: '¡Ay de los que oran',
      },
      {
        ayah: 5,
        arabic: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ',
        transliteracion: 'Alladhina hum an salatihim sahun',
        traduccion: 'Pero son negligentes en su oración!',
      },
      {
        ayah: 6,
        arabic: 'الَّذِينَ هُمْ يُرَاءُونَ',
        transliteracion: "Alladhina hum yura'un",
        traduccion: 'Los que actúan por ostentación',
      },
      {
        ayah: 7,
        arabic: 'وَيَمْنَعُونَ الْمَاعُونَ',
        transliteracion: "Wa yamna'unal-ma'un",
        traduccion: 'Y niegan la ayuda más pequeña',
      },
    ],
  },
]

// ── Lista de surahs ─────────────────────────────────────────────────────────

function SurahList({ onSelect, darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="pt-4 pb-2"
    >
      <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
        Surahs
      </h2>
      <div className="flex flex-col gap-3">
        {surahs.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl shadow-sm border text-left active:scale-[0.98] transition-all duration-150 ${
              darkMode
                ? 'bg-[#1e1e1e] border-[#2a2a2a] active:bg-[#2a2a2a]'
                : 'bg-[#FFFBF2] border-[#EDE3D3] active:bg-[#F5ECD8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono tabular-nums w-5 shrink-0 ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {s.id}
              </span>
              <div>
                <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {s.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} dir="rtl">
                    {s.nameAr}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>—</span>
                  <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {s.meaning}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {s.verses.length} ayahs
                </p>
              </div>
            </div>
            <ChevronRight size={20} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Página de detalle de surah ──────────────────────────────────────────────

function SurahDetail({ surah, onBack, fontSize, darkMode }) {
  const [currentAyah, setCurrentAyah] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const ayahRefs = useRef([])
  const sequenceRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    if (currentAyah !== null && ayahRefs.current[currentAyah]) {
      ayahRefs.current[currentAyah].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentAyah])

  const playFrom = useCallback((startIndex) => {
    const audio = audioRef.current
    if (!audio) return

    sequenceRef.current = startIndex

    const playIndex = (idx) => {
      if (sequenceRef.current !== startIndex && sequenceRef.current !== idx) return
      if (idx >= surah.verses.length) {
        setIsPlaying(false)
        setCurrentAyah(null)
        sequenceRef.current = null
        return
      }

      const verse = surah.verses[idx]
      const url = ayahUrl(surah.surahNum, verse.ayah)

      setCurrentAyah(idx)
      setIsPlaying(true)

      audio.src = url
      audio.load()

      const onEnded = () => {
        audio.removeEventListener('ended', onEnded)
        playIndex(idx + 1)
      }
      const onError = () => {
        audio.removeEventListener('error', onError)
        playIndex(idx + 1)
      }

      audio.addEventListener('ended', onEnded)
      audio.addEventListener('error', onError)
      audio.play().catch(() => {})
    }

    playIndex(startIndex)
  }, [surah])

  function handlePlayPause() {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      sequenceRef.current = null
    } else {
      const from = currentAyah !== null ? currentAyah : 0
      playFrom(from)
    }
  }

  function handleRestart() {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.src = '' }
    setCurrentAyah(null)
    setIsPlaying(false)
    sequenceRef.current = null
    setTimeout(() => playFrom(0), 50)
  }

  function handleTapAyah(idx) {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.src = '' }
    setIsPlaying(false)
    sequenceRef.current = null
    setTimeout(() => playFrom(idx), 50)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      <audio ref={audioRef} preload="none" />

      {/* Header */}
      <div className={`flex items-center gap-3 pt-4 pb-3 sticky top-0 z-10 ${
        darkMode ? 'bg-[#121212]' : 'bg-[#F7F1E6]'
      }`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-colors active:scale-90 ${
            darkMode ? 'text-slate-300 active:bg-[#2a2a2a]' : 'text-slate-600 active:bg-slate-100'
          }`}
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className={`text-xl font-semibold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {surah.name}
          </h2>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {surah.nameAr} · {surah.meaning} · {surah.verses.length} ayahs
          </p>
        </div>
      </div>

      {/* Barra de controles de audio */}
      <div className="flex items-center gap-2 px-1 pb-3">
        <button
          onClick={handleRestart}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors active:scale-90 ${
            darkMode
              ? 'border-[#2a2a2a] text-slate-400 active:bg-[#2a2a2a]'
              : 'border-slate-200 text-slate-500 active:bg-slate-100'
          }`}
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={handlePlayPause}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors active:scale-[0.98]"
        >
          {isPlaying ? <Square size={16} /> : <Play size={16} />}
          {isPlaying
            ? 'Detener'
            : currentAyah !== null
            ? `Continuar desde ayah ${currentAyah + 1}`
            : 'Reproducir completa'}
        </button>
      </div>

      {/* Lista de ayahs */}
      <div className="flex flex-col gap-0 pb-6">
        {surah.verses.map((verse, idx) => {
          const active = currentAyah === idx
          return (
            <button
              key={idx}
              ref={(el) => (ayahRefs.current[idx] = el)}
              onClick={() => handleTapAyah(idx)}
              className={`w-full text-left px-4 py-4 border-b transition-colors duration-200 active:scale-[0.99] ${
                darkMode
                  ? active
                    ? 'bg-emerald-900/30 border-emerald-700/40'
                    : 'border-[#2a2a2a] active:bg-[#2a2a2a]'
                  : active
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'border-slate-100 active:bg-slate-50'
              }`}
            >
              {/* Número + árabe */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className={`text-xs font-mono mt-1 shrink-0 tabular-nums ${
                  active
                    ? 'text-emerald-600 font-bold'
                    : darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {String(idx + 1).padStart(2, '0')}
                  {active && isPlaying && (
                    <span className="ml-1 inline-block animate-pulse">▶</span>
                  )}
                </span>
                <p
                  className={`text-2xl leading-loose text-right flex-1 ${
                    active
                      ? 'text-emerald-700'
                      : darkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}
                  dir="rtl"
                  lang="ar"
                >
                  {verse.arabic}
                </p>
              </div>

              {/* Transliteración */}
              <p
                className={`italic mb-1 leading-relaxed ${
                  active
                    ? 'text-emerald-700 font-semibold'
                    : darkMode ? 'text-slate-300 font-medium' : 'text-slate-600 font-medium'
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {verse.transliteracion}
              </p>

              {/* Traducción */}
              <p className={`text-sm leading-relaxed ${
                active
                  ? 'text-emerald-600'
                  : darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {verse.traduccion}
              </p>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────

export default function Surahs() {
  const [selected, setSelected] = useState(null)
  const { fontSize, darkMode } = useSettings()

  return (
    <div className="pt-0 pb-2">
      <AnimatePresence mode="wait">
        {selected === null ? (
          <SurahList
            key="list"
            onSelect={setSelected}
            darkMode={darkMode}
          />
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
