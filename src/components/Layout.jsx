import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookHeart, BookHeadphones, GraduationCap, Settings } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import ElRezo from '../pages/ElRezo'
import Surahs from '../pages/Surahs'
import Aprender from '../pages/Aprender'
import Ajustes from '../pages/Ajustes'

const tabs = [
  { label: 'Mihrab', icon: BookHeart, component: ElRezo },
  { label: 'Surahs', icon: BookHeadphones, component: Surahs },
  { label: 'Aprender', icon: GraduationCap, component: Aprender },
  { label: 'Ajustes', icon: Settings, component: Ajustes },
]

export default function Layout() {
  const [active, setActive] = useState(0)
  const { darkMode } = useSettings()
  const ActivePage = tabs[active].component

  return (
    <div className={`h-[100dvh] flex flex-col ${darkMode ? 'bg-[#121212]' : 'bg-[#F7F1E6]'}`}>
      <main className="flex-1 overflow-y-auto px-4 pb-2">
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

      <nav className={`flex-shrink-0 flex items-center justify-around px-2 pt-2 pb-8 md:pb-4 pb-[env(safe-area-inset-bottom)] border-t ${
        darkMode
          ? 'bg-[#1e1e1e] border-[#2a2a2a]'
          : 'bg-[#FBF6EE] border-[#E8DDD0]'
      }`}>
        {tabs.map((tab, i) => {
          const Icon = tab.icon
          const isActive = i === active
          return (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-0.5 pt-1 px-3 transition-all duration-200 active:scale-90"
            >
              <Icon
                size={22}
                className={isActive
                  ? 'text-emerald-600'
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
                }
              />
              <span className={`text-[10px] leading-tight transition-all duration-200 ${
                isActive
                  ? 'font-semibold text-emerald-600'
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
