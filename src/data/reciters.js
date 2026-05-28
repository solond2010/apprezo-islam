// Recitadores disponibles en everyayah.com
// Cada recitador tiene un path (carpeta en el CDN) único.

export const RECITERS = [
  {
    id: 'sudais',
    name: 'Al-Sudais',
    desc: 'Imam de La Meca · Arabia Saudí',
    path: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: 'alafasy',
    name: 'Mishary Alafasy',
    desc: 'Voz melódica · Kuwait',
    path: 'Alafasy_128kbps',
  },
  {
    id: 'qatami',
    name: 'Nasser Al-Qatami',
    desc: 'Voz poderosa · Kuwait',
    path: 'Nasser_Alqatami_128kbps',
  },
  {
    id: 'ghamadi',
    name: 'Al-Ghamadi',
    desc: 'Imam de La Meca · Arabia Saudí',
    path: 'Ghamadi_40kbps',
  },
  {
    id: 'muaiqly',
    name: 'Maher Al-Muaiqly',
    desc: 'Imam de La Meca · Arabia Saudí',
    path: 'MaherAlMuaiqly128kbps',
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
