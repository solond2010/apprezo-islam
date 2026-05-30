import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { Text, Sun, Moon, Minus, Plus, Info, Heart, User, MapPin, ChevronRight, Mic, ChevronDown, Bell } from 'lucide-react'
import { useState } from 'react'
import LocationSelector from '../components/LocationSelector'
import { RECITERS } from '../data/reciters'
import { requestNotificationPermission, getPermission, sendTestNotification } from '../utils/notifications'

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
  const {
    fontSize, increaseFont, decreaseFont,
    darkMode, setDarkMode,
    userGender, setUserGender,
    userLocation, setUserLocation,
    reciterId, setReciterId, reciter,
    notificationsEnabled, setNotificationsEnabled,
  } = useSettings()
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [reciterOpen, setReciterOpen] = useState(false)
  const [notifMsg, setNotifMsg] = useState('')

  async function handleToggleNotifications() {
    if (notificationsEnabled) {
      setNotificationsEnabled(false)
      setNotifMsg('')
      return
    }
    const perm = getPermission()
    if (perm === 'unsupported') {
      setNotifMsg('Tu navegador no soporta notificaciones.')
      return
    }
    const result = perm === 'granted' ? 'granted' : await requestNotificationPermission()
    if (result === 'granted') {
      setNotificationsEnabled(true)
      setNotifMsg('')
    } else {
      setNotifMsg('Permiso denegado. Actívalo en los ajustes de tu navegador.')
    }
  }

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

        {/* ── Notificaciones de rezo ─────────────────────────────── */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-emerald-600" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">Notificaciones de rezo</p>
                <p className="text-[11px] text-gray-500">Aviso a la hora de cada oración</p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                notificationsEnabled ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notificationsEnabled ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {notificationsEnabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-amber-100"
              >
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-gray-500 leading-snug flex-1">
                    En iPhone funcionan mejor con la app añadida a la pantalla de inicio.
                  </p>
                  <button
                    onClick={() => sendTestNotification()}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}
                  >
                    Probar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {notifMsg && (
            <p className="px-4 pb-3 text-[11px] text-rose-500 font-medium">{notifMsg}</p>
          )}
        </div>

        {/* ── Recitador del Quran ────────────────────────────────── */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <button
            onClick={() => setReciterOpen((v) => !v)}
            className="w-full px-4 py-4 flex items-center justify-between active:bg-white/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Mic size={18} className="text-emerald-600" strokeWidth={2.2} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-gray-800">Recitador del Quran</p>
                <p className="text-[11px] text-gray-500 truncate">{reciter.name} · {reciter.desc}</p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${reciterOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {reciterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="overflow-hidden border-t border-amber-100"
              >
                <div className="px-2 py-2 flex flex-col gap-1">
                  {RECITERS.map((r) => {
                    const active = r.id === reciterId
                    return (
                      <button
                        key={r.id}
                        onClick={() => { setReciterId(r.id); setReciterOpen(false) }}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all ${
                          active
                            ? 'shadow-md text-white'
                            : 'active:bg-amber-50 text-gray-700'
                        }`}
                        style={active ? { background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' } : undefined}
                      >
                        <div className="text-left min-w-0">
                          <p className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-800'}`}>
                            {r.name}
                          </p>
                          <p className={`text-[10px] ${active ? 'text-white/85' : 'text-gray-500'}`}>
                            {r.desc}
                          </p>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-black">✓</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
