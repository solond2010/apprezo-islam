import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Volume2, Square } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const surahs = [
  {
    id: 1,
    name: 'Al-Fatiha',
    nameAr: 'الفاتحة',
    meaning: 'La Apertura',
    audioUrl: 'https://www.w3schools.com/html/horse.mp3',
    verses: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteracion: 'Bismil-lahi r-rahmani r-rahim',
        traduccion: 'En el nombre de Dios, el Clemente, el Misericordioso',
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteracion: 'Al-hamdu lil-lahi rabil-alamin',
        traduccion: 'Alabado sea Dios, Señor de todos los mundos',
      },
      {
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteracion: 'Ar-rahmani r-rahim',
        traduccion: 'El Clemente, el Misericordioso',
      },
      {
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteracion: 'Maliki yawmid-din',
        traduccion: 'Soberano del Día del Juicio',
      },
      {
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteracion: 'Iyaka na\'budu wa iyaka nasta\'in',
        traduccion: 'Solo a Ti te adoramos y solo a Ti pedimos ayuda',
      },
      {
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteracion: 'Ihdinas-siratal mustaqim',
        traduccion: 'Guíanos por el camino recto',
      },
      {
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteracion: 'Siratal ladina an\'amta \'alayhim, gayril magdubi \'alayhim, walad-dalin',
        traduccion: 'El camino de quienes has bendecido, no el de los que cayeron en ira, ni el de los extraviados',
      },
    ],
  },
  {
    id: 2,
    name: 'Al-Ikhlas',
    nameAr: 'الإخلاص',
    meaning: 'La Sinceridad',
    audioUrl: 'https://www.w3schools.com/html/horse.mp3',
    verses: [
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteracion: 'Qul huwal-lahu ahad',
        traduccion: 'Di: Él es Dios, Uno',
      },
      {
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteracion: 'Al-lahus-samad',
        traduccion: 'Dios, el Absoluto',
      },
      {
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteracion: 'Lam yalid wa lam yulad',
        traduccion: 'No ha engendrado ni ha sido engendrado',
      },
      {
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteracion: 'Wa lam yakun lahu kufuwan ahad',
        traduccion: 'Y no hay nadie que sea comparable a Él',
      },
    ],
  },
]

function VerseRow({ verse, index, fontSize }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-mono text-slate-400 mt-1 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="text-xl leading-relaxed text-right flex-1" dir="rtl" lang="ar">
          {verse.arabic}
        </p>
      </div>
      <p className="font-bold italic text-slate-600 mb-1 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
        {verse.transliteracion}
      </p>
      <p className="text-sm text-slate-500 leading-relaxed">
        {verse.traduccion}
      </p>
    </div>
  )
}

function SurahCard({ surah, isOpen, onToggle, audioRef, isPlaying, onPlay, fontSize }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left active:bg-slate-50 transition-colors"
      >
        <div>
          <h3 className="text-base font-semibold text-slate-800">{surah.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-lg" dir="rtl">{surah.nameAr}</span>
            <span className="text-xs text-slate-400">—</span>
            <span className="text-xs text-slate-500">{surah.meaning}</span>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-100">
              <button
                onClick={() => onPlay(surah)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium py-3 rounded-lg mt-4 mb-3 transition-colors"
              >
                {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
                {isPlaying ? 'Detener' : 'Reproducir Surah'}
              </button>
              {surah.verses.map((verse, i) => (
                <VerseRow key={i} verse={verse} index={i} fontSize={fontSize} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Surahs() {
  const [openId, setOpenId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { fontSize } = useSettings()
  const audioRef = useRef(null)

  function handlePlay(surah) {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    } else {
      console.log('Reproduciendo:', surah.name, '-', surah.audioUrl)
      audio.src = surah.audioUrl
      audio.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }, [openId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pt-4 pb-2"
    >
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Surahs</h2>
      {surahs.map((s) => (
        <SurahCard
          key={s.id}
          surah={s}
          isOpen={openId === s.id}
          onToggle={() => setOpenId(openId === s.id ? null : s.id)}
          audioRef={audioRef}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          fontSize={fontSize}
        />
      ))}
    </motion.div>
  )
}
