import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { Text, Sun, Moon, Minus, Plus, Info, Heart, User, MapPin, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import LocationSelector from '../components/LocationSelector'

function SettingRow({ icon: Icon, iconColor = 'text-amber-600', iconBg = 'bg-amber-50', label, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={18} className={iconColor} strokeWidth={2.2} />
        </div>
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
      </div>
    </div>
  )
}

export default function Ajustes() {
  const { fontSize, increaseFont, decreaseFont, darkMode, setDarkMode, userGender, setUserGender, userLocation, setUserLocation } = useSettings()
  const [locationModalOpen, setLocationModalOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pt-4 pb-2"
    >
      <div className="mb-6 px-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Preferencias
        </p>
        <h1 className="text-2xl font-black text-gray-800 mt-0.5">Ajustes</h1>
      </div>

      <div className="flex flex-col gap-3">
        <SettingRow
          icon={MapPin}
          iconColor="text-cyan-500"
          iconBg="bg-cyan-50"
          label="Ubicación"
        >
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="text-sm font-semibold">{userLocation.name}</span>
            <ChevronRight size={14} />
          </button>
        </SettingRow>

        <SettingRow
          icon={Text}
          iconColor="text-violet-500"
          iconBg="bg-violet-50"
          label="Tamaño de transliteración"
        >
          <button
            onClick={decreaseFont}
            className="w-8 h-8 rounded-xl bg-white/80 shadow-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-gray-700 tabular-nums">
            {fontSize}px
          </span>
          <button
            onClick={increaseFont}
            className="w-8 h-8 rounded-xl bg-white/80 shadow-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        </SettingRow>

        <SettingRow
          icon={User}
          iconColor="text-rose-500"
          iconBg="bg-rose-50"
          label="Género"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setUserGender('hombre')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                userGender === 'hombre'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hombre
            </button>
            <button
              onClick={() => setUserGender('mujer')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                userGender === 'mujer'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mujer
            </button>
          </div>
        </SettingRow>

        <SettingRow
          icon={darkMode ? Moon : Sun}
          iconColor={darkMode ? 'text-indigo-500' : 'text-yellow-600'}
          iconBg={darkMode ? 'bg-indigo-50' : 'bg-yellow-50'}
          label="Modo Oscuro"
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              darkMode
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: darkMode ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </button>
        </SettingRow>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 shadow-lg text-white"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Heart size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-black mb-1">Mihrab</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              Tu compañero para aprender a rezar. Que Allah acepte tus oraciones.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-gray-500">
        <Info size={12} />
        <span>Los cambios se guardan automáticamente</span>
      </div>

      <LocationSelector
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelect={setUserLocation}
      />
    </motion.div>
  )
}
