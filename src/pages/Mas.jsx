import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ChevronRight, RotateCcw, Sparkles, ScrollText,
  Search, X, Shuffle, Star,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { ASMA_UL_HUSNA } from '../data/asmaUlHusna'
import { HADITHS } from '../data/hadiths'

const GRAD = 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)'
const GRAD_DEEP = 'linear-gradient(135deg, #431407 0%, #7C2D12 50%, #C2410C 100%)'

// ─────────────────────────────────────────────────────────────────────────
// CONTADOR DE DHIKR (Tasbih)
// ─────────────────────────────────────────────────────────────────────────

const DHIKR_PRESETS = [
  { id: 'subhanallah', label: 'SubhanAllah', ar: 'سُبْحَانَ اللَّه', meaning: 'Glorificado sea Allah', target: 33 },
  { id: 'alhamdulillah', label: 'Alhamdulillah', ar: 'الْحَمْدُ لِلَّه', meaning: 'Alabado sea Allah', target: 33 },
  { id: 'allahuakbar', label: 'Allahu Akbar', ar: 'اللَّهُ أَكْبَر', meaning: 'Allah es el más Grande', target: 34 },
  { id: 'lailaha', label: 'La ilaha illa Allah', ar: 'لَا إِلَهَ إِلَّا اللَّه', meaning: 'No hay más dios que Allah', target: 100 },
  { id: 'astaghfirullah', label: 'Astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّه', meaning: 'Pido perdón a Allah', target: 100 },
]

function DhikrCounter({ darkMode, onBack }) {
  const [presetId, setPresetId] = useState(() => localStorage.getItem('mihrab-dhikr-preset') || 'subhanallah')
  const [count, setCount] = useState(() => Number(localStorage.getItem('mihrab-dhikr-count') || 0))
  const [rounds, setRounds] = useState(() => Number(localStorage.getItem('mihrab-dhikr-rounds') || 0))

  const preset = DHIKR_PRESETS.find((p) => p.id === presetId) || DHIKR_PRESETS[0]
  const target = preset.target
  const progress = Math.min(count / target, 1)

  useEffect(() => { localStorage.setItem('mihrab-dhikr-count', String(count)) }, [count])
  useEffect(() => { localStorage.setItem('mihrab-dhikr-rounds', String(rounds)) }, [rounds])
  useEffect(() => { localStorage.setItem('mihrab-dhikr-preset', presetId) }, [presetId])

  function vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms)
  }

  function tap() {
    setCount((c) => {
      const next = c + 1
      if (next >= target) {
        vibrate([40, 60, 120])
        setRounds((r) => r + 1)
        return 0
      }
      vibrate(15)
      return next
    })
  }

  function reset() {
    setCount(0)
    setRounds(0)
    vibrate(30)
  }

  function changePreset(id) {
    setPresetId(id)
    setCount(0)
  }

  // Circunferencia del anillo de progreso
  const R = 130
  const C = 2 * Math.PI * R

  return (
    <div className="pt-4 pb-6 min-h-[80vh] flex flex-col">
      <SubHeader title="Contador de Dhikr" darkMode={darkMode} onBack={onBack} />

      {/* Selector de dhikr */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 mb-6">
        {DHIKR_PRESETS.map((p) => {
          const active = p.id === presetId
          return (
            <button
              key={p.id}
              onClick={() => changePreset(p.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                active ? 'text-white shadow-md' : darkMode ? 'bg-[#1e1e1e] text-gray-300 border border-[#2a2a2a]' : 'bg-white/70 text-gray-600 border border-white/60'
              }`}
              style={active ? { background: GRAD } : undefined}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Texto del dhikr actual */}
      <div className="text-center mb-2">
        <p className={`text-3xl font-medium mb-1 ${darkMode ? 'text-amber-300' : 'text-amber-800'}`} dir="rtl" lang="ar">
          {preset.ar}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{preset.meaning}</p>
      </div>

      {/* Anillo + botón central */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <button onClick={tap} className="relative active:scale-95 transition-transform" aria-label="Contar dhikr">
          <svg width="300" height="300" viewBox="0 0 300 300" className="-rotate-90">
            <circle cx="150" cy="150" r={R} fill="none" stroke={darkMode ? '#2a2a2a' : 'rgba(255,255,255,0.6)'} strokeWidth="14" />
            <motion.circle
              cx="150" cy="150" r={R} fill="none" stroke="url(#dhikrGrad)" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - progress) }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
            <defs>
              <linearGradient id="dhikrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
          {/* Contenido central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={count}
              initial={{ scale: 0.6, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className={`text-7xl font-black tabular-nums ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              {count}
            </motion.span>
            <span className={`text-sm font-semibold mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              / {target}
            </span>
            <span className={`text-[11px] font-bold mt-3 uppercase tracking-widest ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Toca para contar
            </span>
          </div>
        </button>
      </div>

      {/* Stats + reset */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <div className={`px-5 py-3 rounded-2xl text-center ${darkMode ? 'bg-[#1e1e1e] border border-[#2a2a2a]' : 'bg-white/70 border border-white/60'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Vueltas</p>
          <p className={`text-2xl font-black tabular-nums ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{rounds}</p>
        </div>
        <button
          onClick={reset}
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm active:scale-95 transition-transform ${
            darkMode ? 'bg-[#1e1e1e] text-gray-300 border border-[#2a2a2a]' : 'bg-white/70 text-gray-600 border border-white/60'
          }`}
        >
          <RotateCcw size={16} />
          Reiniciar
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// 99 NOMBRES DE ALLAH
// ─────────────────────────────────────────────────────────────────────────

function AsmaNames({ darkMode, onBack }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ASMA_UL_HUSNA
    return ASMA_UL_HUSNA.filter((n) =>
      n.tr.toLowerCase().includes(q) || n.es.toLowerCase().includes(q) || String(n.num) === q
    )
  }, [query])

  return (
    <div className="pt-4 pb-6">
      <SubHeader title="99 Nombres de Allah" subtitle="Asma ul-Husna" darkMode={darkMode} onBack={onBack} />

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search size={17} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar nombre…"
          className={`w-full pl-11 pr-10 py-3 rounded-2xl text-sm font-medium shadow-sm border outline-none focus:ring-2 focus:ring-amber-400/50 ${
            darkMode ? 'bg-[#1e1e1e]/70 border-[#2a2a2a] text-white placeholder:text-gray-500' : 'bg-white/70 border-white/60 text-gray-800 placeholder:text-gray-400'
          }`}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200/80 flex items-center justify-center active:scale-90">
            <X size={12} className="text-gray-600" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {filtered.map((n, i) => (
          <motion.div
            key={n.num}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 15) * 0.02 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm border ${
              darkMode ? 'bg-[#1e1e1e]/70 border-[#2a2a2a]' : 'bg-white/70 border-white/60'
            }`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GRAD }}>
              <span className="text-xs font-black text-white tabular-nums">{n.num}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{n.tr}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.es}</p>
            </div>
            <p className={`text-xl font-medium ${darkMode ? 'text-amber-300' : 'text-amber-700'}`} dir="rtl" lang="ar">{n.ar}</p>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className={`text-center py-12 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Sin resultados para «{query}»
          </p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// HADICES
// ─────────────────────────────────────────────────────────────────────────

function HadithsView({ darkMode, onBack }) {
  const [shuffleKey, setShuffleKey] = useState(0)

  const list = useMemo(() => {
    if (shuffleKey === 0) return HADITHS
    return [...HADITHS].sort(() => Math.random() - 0.5)
  }, [shuffleKey])

  return (
    <div className="pt-4 pb-6">
      <SubHeader
        title="Hadices del Profeta ﷺ"
        subtitle={`${HADITHS.length} hadices auténticos`}
        darkMode={darkMode}
        onBack={onBack}
        action={
          <button
            onClick={() => setShuffleKey((k) => k + 1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform text-white shadow-md"
            style={{ background: GRAD }}
            aria-label="Mezclar"
          >
            <Shuffle size={16} />
          </button>
        }
      />

      <div className="flex flex-col gap-3">
        {list.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 12) * 0.03 }}
            className={`relative rounded-2xl p-5 shadow-sm border overflow-hidden ${
              darkMode ? 'bg-[#1e1e1e]/70 border-[#2a2a2a]' : 'bg-white/70 border-white/60'
            }`}
          >
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: GRAD }} />
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-3"
              style={{ background: darkMode ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.12)' }}>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                {h.category}
              </span>
            </div>
            <p className={`text-[15px] leading-relaxed mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              «{h.text}»
            </p>
            <div className={`flex items-center justify-between text-[11px] border-t pt-2.5 ${darkMode ? 'border-[#2a2a2a]' : 'border-gray-100'}`}>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Narrado por {h.narrator}</span>
              <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{h.source}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// Encabezado reutilizable de sub-sección
// ─────────────────────────────────────────────────────────────────────────

function SubHeader({ title, subtitle, darkMode, onBack, action }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <button onClick={onBack} className={`p-2 rounded-xl active:scale-90 transition-transform ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <ArrowLeft size={22} />
      </button>
      <div className="flex-1 min-w-0">
        <h2 className={`text-xl font-black leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
        {subtitle && <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// HUB principal de "Más"
// ─────────────────────────────────────────────────────────────────────────

const FEATURES = [
  { id: 'dhikr', title: 'Contador de Dhikr', desc: 'Tasbih digital para tu recuerdo de Allah', icon: Sparkles },
  { id: 'asma', title: '99 Nombres de Allah', desc: 'Asma ul-Husna con significado', icon: Star },
  { id: 'hadiths', title: 'Hadices', desc: 'Enseñanzas del Profeta ﷺ', icon: ScrollText },
]

export default function Mas({ onBack }) {
  const { darkMode } = useSettings()
  const [screen, setScreen] = useState('hub')

  if (screen === 'dhikr') return <DhikrCounter darkMode={darkMode} onBack={() => setScreen('hub')} />
  if (screen === 'asma') return <AsmaNames darkMode={darkMode} onBack={() => setScreen('hub')} />
  if (screen === 'hadiths') return <HadithsView darkMode={darkMode} onBack={() => setScreen('hub')} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="pt-4 pb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={onBack} className={`p-2 rounded-xl active:scale-90 transition-transform ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Explora</p>
          <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>Más</h1>
        </div>
      </div>

      {/* Banner */}
      <div className="relative rounded-3xl px-5 py-6 mb-5 overflow-hidden shadow-lg" style={{ background: GRAD_DEEP }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FCD34D 0%, transparent 70%)' }} />
        <p className="text-[10px] font-bold text-amber-200 uppercase tracking-widest mb-1">Recuerda a Allah</p>
        <h3 className="text-xl font-black text-white leading-tight">Herramientas espirituales</h3>
        <p className="text-xs text-white/70 mt-1">Dhikr, los nombres de Allah y enseñanzas del Profeta ﷺ</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setScreen(f.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl shadow-sm border text-left ${
                darkMode ? 'bg-[#1e1e1e]/70 backdrop-blur-md border-[#2a2a2a]' : 'bg-white/70 backdrop-blur-md border-white/60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: GRAD }}>
                <Icon size={22} className="text-white" strokeWidth={2.3} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{f.title}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>
              </div>
              <ChevronRight size={18} className={`flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
