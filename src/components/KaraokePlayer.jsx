import { useRef, useState, useEffect } from 'react'

export default function KaraokePlayer({ segments, audioUrl, fontSize, pasoId }) {
  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const activeIndex = segments.findIndex(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  )

  function toggleAudio() {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setCurrentTime(0)
      audio.currentTime = 0
      setIsPlaying(false)
    } else {
      const el = document.getElementById(`paso-${pasoId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      audio.src = audioUrl
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.error('Error al reproducir:', err)
      })
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (audio) setCurrentTime(audio.currentTime)
  }

  function handleEnded() {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }, [audioUrl])

  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="none"
      />

      <div className="space-y-2 mb-3">
        {segments.map((seg, i) => {
          const isActive = i === activeIndex && isPlaying
          const isPast = i < activeIndex
          return (
            <div
              key={i}
              className={`transition-all duration-200 break-words whitespace-normal leading-relaxed ${
                isActive
                  ? 'font-bold text-emerald-600'
                  : isPast
                  ? 'text-gray-300'
                  : 'text-gray-500'
              }`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {seg.text}
            </div>
          )
        })}
      </div>

      <button
        onClick={toggleAudio}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm ${
          isPlaying
            ? 'bg-rose-500 hover:bg-rose-600 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
      >
        {isPlaying ? 'Detener' : 'Reproducir'}
      </button>
    </div>
  )
}
