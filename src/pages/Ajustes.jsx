import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { Text, Sun, Moon, Minus, Plus } from 'lucide-react'

function SettingRow({ icon: Icon, label, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-emerald-600" />
        </div>
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
      </div>
    </div>
  )
}

export default function Ajustes() {
  const { fontSize, increaseFont, decreaseFont, darkMode, setDarkMode } = useSettings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pt-4 pb-2"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ajustes</h2>

      <div className="flex flex-col gap-3">
        <SettingRow icon={Text} label="Tamaño de transliteración">
          <button
            onClick={decreaseFont}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-gray-700 tabular-nums">
            {fontSize}px
          </span>
          <button
            onClick={increaseFont}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        </SettingRow>

        <SettingRow
          icon={darkMode ? Moon : Sun}
          label="Modo Oscuro"
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              darkMode ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                darkMode ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </SettingRow>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
        Los cambios se guardan automáticamente
      </p>
    </motion.div>
  )
}
