import { createContext, useContext, useState, useEffect } from 'react'
import { LOCATIONS } from '../data/locations'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('rezar-font-size')
    return saved ? Number(saved) : 24
  })

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('rezar-dark-mode')
    return saved ? saved === 'true' : false
  })

  // userGender: 'hombre' | 'mujer'
  // Controla qué imágenes de posturas y audios se muestran en la Guía de Rezo.
  const [userGender, setUserGender] = useState(() => {
    const saved = localStorage.getItem('rezar-user-gender')
    return saved === 'mujer' ? 'mujer' : 'hombre'
  })

  // userLocation: { lat, lon, name }
  // Ubicación del usuario para obtener horarios de rezo.
  // Si no hay ubicación guardada, se usa Madrid como default.
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem('rezar-user-location')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return LOCATIONS[0] // Madrid fallback
      }
    }
    return LOCATIONS[0] // Madrid
  })

  useEffect(() => {
    localStorage.setItem('rezar-font-size', String(fontSize))
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('rezar-dark-mode', String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('rezar-user-gender', userGender)
  }, [userGender])

  useEffect(() => {
    localStorage.setItem('rezar-user-location', JSON.stringify(userLocation))
  }, [userLocation])

  function increaseFont() {
    setFontSize((s) => Math.min(s + 2, 40))
  }

  function decreaseFont() {
    setFontSize((s) => Math.max(s - 2, 14))
  }

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, increaseFont, decreaseFont, darkMode, setDarkMode, userGender, setUserGender, userLocation, setUserLocation }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
