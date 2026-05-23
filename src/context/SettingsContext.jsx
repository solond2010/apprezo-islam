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

  useEffect(() => {
    localStorage.setItem('rezar-font-size', String(fontSize))
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('rezar-dark-mode', String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  function increaseFont() {
    setFontSize((s) => Math.min(s + 2, 40))
  }

  function decreaseFont() {
    setFontSize((s) => Math.max(s - 2, 14))
  }

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, increaseFont, decreaseFont, darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
