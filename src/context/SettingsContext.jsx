import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { LOCATIONS } from '../data/locations'
import { RECITERS, getReciter } from '../data/reciters'

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

  // reciterId: id del recitador de Quran activo (Surahs + Guía Paso a Paso).
  // Default: Al-Sudais.
  const [reciterId, setReciterId] = useState(() => {
    const saved = localStorage.getItem('rezar-reciter')
    return saved && RECITERS.some((r) => r.id === saved) ? saved : 'sudais'
  })

  const reciter = useMemo(() => getReciter(reciterId), [reciterId])

  // favoriteSurahs: array de números de surah marcados como favoritos.
  const [favoriteSurahs, setFavoriteSurahs] = useState(() => {
    try {
      const saved = localStorage.getItem('rezar-fav-surahs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // lastReadSurah: número de la última surah abierta (para "Continuar leyendo").
  const [lastReadSurah, setLastReadSurah] = useState(() => {
    const saved = localStorage.getItem('rezar-last-surah')
    return saved ? Number(saved) : null
  })

  function toggleFavorite(num) {
    setFavoriteSurahs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    )
  }

  // favoriteTopics: array de ids de temas de Aprender guardados.
  const [favoriteTopics, setFavoriteTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('rezar-fav-topics')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  function toggleFavoriteTopic(id) {
    setFavoriteTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

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

  useEffect(() => {
    localStorage.setItem('rezar-reciter', reciterId)
  }, [reciterId])

  useEffect(() => {
    localStorage.setItem('rezar-fav-surahs', JSON.stringify(favoriteSurahs))
  }, [favoriteSurahs])

  useEffect(() => {
    localStorage.setItem('rezar-fav-topics', JSON.stringify(favoriteTopics))
  }, [favoriteTopics])

  useEffect(() => {
    if (lastReadSurah != null) {
      localStorage.setItem('rezar-last-surah', String(lastReadSurah))
    }
  }, [lastReadSurah])

  function increaseFont() {
    setFontSize((s) => Math.min(s + 2, 40))
  }

  function decreaseFont() {
    setFontSize((s) => Math.max(s - 2, 14))
  }

  return (
    <SettingsContext.Provider value={{
      fontSize, setFontSize, increaseFont, decreaseFont,
      darkMode, setDarkMode,
      userGender, setUserGender,
      userLocation, setUserLocation,
      reciterId, setReciterId, reciter,
      favoriteSurahs, toggleFavorite,
      lastReadSurah, setLastReadSurah,
      favoriteTopics, toggleFavoriteTopic,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
