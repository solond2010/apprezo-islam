// Recitadores disponibles en everyayah.com
// Cada recitador tiene un path (carpeta en el CDN) único.

export const RECITERS = [
  {
    id: 'sudais',
    name: 'Al-Sudais',
    desc: 'Imam de La Meca',
    path: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit',
    desc: 'Murattal clásico · Egipto',
    path: 'Abdul_Basit_Murattal_192kbps',
  },
  {
    id: 'alafasy',
    name: 'Mishary Alafasy',
    desc: 'Voz suave · Kuwait',
    path: 'Alafasy_64kbps',
  },
  {
    id: 'husary',
    name: 'Al-Husary',
    desc: 'Murattal · Egipto',
    path: 'Husary_128kbps',
  },
  {
    id: 'minshawi',
    name: 'Al-Minshawi',
    desc: 'Murattal · Egipto',
    path: 'Minshawy_Murattal_128kbps',
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    desc: 'Imam de La Meca',
    path: 'Saood_ash-Shuraym_128kbps',
  },
]

const BASE = 'https://everyayah.com/data'

// Construye la URL del audio para un ayah concreto con el recitador dado
export function buildAyahUrl(reciterPath, surahNum, ayahNum) {
  const s = String(surahNum).padStart(3, '0')
  const a = String(ayahNum).padStart(3, '0')
  return `${BASE}/${reciterPath}/${s}${a}.mp3`
}

// Devuelve el objeto recitador a partir del id (con fallback al primero)
export function getReciter(id) {
  return RECITERS.find((r) => r.id === id) || RECITERS[0]
}
