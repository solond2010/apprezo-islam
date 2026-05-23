import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, BookOpen, Lightbulb, SlidersHorizontal } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import ElRezo from '../pages/ElRezo'
import Surahs from '../pages/Surahs'
import Aprender from '../pages/Aprender'
import Ajustes from '../pages/Ajustes'

const tabs = [
  { label: 'Mihrab', icon: Moon, component: ElRezo },
  { label: 'Surahs', icon: BookOpen, component: Surahs },
  { label: 'Aprender', icon: Lightbulb, component: Aprender },
  { label: 'Ajustes', icon: SlidersHorizontal, component: Ajustes },
]

export default function Layout() {
  const [active, setActive] = useState(0)
  const { darkMode } = useSettings()
  const ActivePage = tabs[active].component

  return (
    <div
      className={`h-[100dvh] flex flex-col relative overflow-hidden ${
        darkMode ? 'bg-[#121212]' : ''
      }`}
      style={
        !darkMode
          ? {
              background:
                'linear-gradient(135deg, #FFF4E0 0%, #FFE8D6 35%, #FFDCC5 65%, #FFD0E0 100%)',
            }
          : undefined
      }
    >
      {!darkMode && (
        <>
          <div
            className="absolute -top-32 -left-24 w-80 h-80 rounded-full opacity-50 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FFC078 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/3 -right-24 w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FFB4B4 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FFD194 0%, transparent 70%)' }}
          />
        </>
      )}

      <main className="flex-1 overflow-y-auto px-4 pb-2 relative z-10 scrollbar-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ActivePage />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className={`flex-shrink-0 flex items-center justify-around px-2 pt-3 pb-8 md:pb-4 pb-[env(safe-area-inset-bottom)] relative z-10 ${
          darkMode
            ? 'bg-[#1e1e1e]/95 border-t border-[#2a2a2a]'
            : 'bg-white/70 backdrop-blur-xl border-t border-white/40'
        }`}
      >
        {tabs.map((tab, i) => {
          const Icon = tab.icon
          const isActive = i === active
          return (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-1 pt-1 px-3 transition-all duration-200 active:scale-90 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-10 h-1 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #F59E0B, #EF8A48)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={
                  isActive
                    ? 'text-[#D97706]'
                    : darkMode
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] leading-tight transition-all duration-200 ${
                  isActive
                    ? 'font-bold text-[#D97706]'
                    : darkMode
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
