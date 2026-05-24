import { createContext, useContext, useState, useEffect } from 'react'

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
  // TODO: Conectar selector en Ajustes para que el usuario lo cambie.
  const [userGender, setUserGender] = useState(() => {
    const saved = localStorage.getItem('rezar-user-gender')
    return saved === 'mujer' ? 'mujer' : 'hombre'
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

  function increaseFont() {
    setFontSize((s) => Math.min(s + 2, 40))
  }

  function decreaseFont() {
    setFontSize((s) => Math.max(s - 2, 14))
  }

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, increaseFont, decreaseFont, darkMode, setDarkMode, userGender, setUserGender }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
