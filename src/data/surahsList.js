// Metadatos de las 114 surahs del Corán.
// Los versículos (texto árabe, transliteración y traducción) se cargan
// bajo demanda desde la API de alquran.cloud — ver fetchSurahVerses().

export const SURAHS = [
  { num: 1, name: 'Al-Fatiha', nameAr: 'الفاتحة', meaning: 'La Apertura', ayahs: 7 },
  { num: 2, name: 'Al-Baqara', nameAr: 'البقرة', meaning: 'La Vaca', ayahs: 286 },
  { num: 3, name: 'Aal-E-Imran', nameAr: 'آل عمران', meaning: 'La Familia de Imran', ayahs: 200 },
  { num: 4, name: 'An-Nisa', nameAr: 'النساء', meaning: 'Las Mujeres', ayahs: 176 },
  { num: 5, name: 'Al-Maeda', nameAr: 'المائدة', meaning: 'La Mesa Servida', ayahs: 120 },
  { num: 6, name: 'Al-Anaam', nameAr: 'الأنعام', meaning: 'Los Rebaños', ayahs: 165 },
  { num: 7, name: 'Al-Araf', nameAr: 'الأعراف', meaning: 'Los Lugares Elevados', ayahs: 206 },
  { num: 8, name: 'Al-Anfal', nameAr: 'الأنفال', meaning: 'Los Botines', ayahs: 75 },
  { num: 9, name: 'At-Tawba', nameAr: 'التوبة', meaning: 'El Arrepentimiento', ayahs: 129 },
  { num: 10, name: 'Yunus', nameAr: 'يونس', meaning: 'Jonás', ayahs: 109 },
  { num: 11, name: 'Hud', nameAr: 'هود', meaning: 'Hud', ayahs: 123 },
  { num: 12, name: 'Yusuf', nameAr: 'يوسف', meaning: 'José', ayahs: 111 },
  { num: 13, name: 'Ar-Rad', nameAr: 'الرعد', meaning: 'El Trueno', ayahs: 43 },
  { num: 14, name: 'Ibrahim', nameAr: 'ابراهيم', meaning: 'Abraham', ayahs: 52 },
  { num: 15, name: 'Al-Hijr', nameAr: 'الحجر', meaning: 'La Región Rocosa', ayahs: 99 },
  { num: 16, name: 'An-Nahl', nameAr: 'النحل', meaning: 'Las Abejas', ayahs: 128 },
  { num: 17, name: 'Al-Isra', nameAr: 'الإسراء', meaning: 'El Viaje Nocturno', ayahs: 111 },
  { num: 18, name: 'Al-Kahf', nameAr: 'الكهف', meaning: 'La Caverna', ayahs: 110 },
  { num: 19, name: 'Maryam', nameAr: 'مريم', meaning: 'María', ayahs: 98 },
  { num: 20, name: 'Ta-Ha', nameAr: 'طه', meaning: 'Ta-Ha', ayahs: 135 },
  { num: 21, name: 'Al-Anbiya', nameAr: 'الأنبياء', meaning: 'Los Profetas', ayahs: 112 },
  { num: 22, name: 'Al-Hajj', nameAr: 'الحج', meaning: 'La Peregrinación', ayahs: 78 },
  { num: 23, name: 'Al-Muminoon', nameAr: 'المؤمنون', meaning: 'Los Creyentes', ayahs: 118 },
  { num: 24, name: 'An-Noor', nameAr: 'النور', meaning: 'La Luz', ayahs: 64 },
  { num: 25, name: 'Al-Furqan', nameAr: 'الفرقان', meaning: 'El Criterio', ayahs: 77 },
  { num: 26, name: 'Ash-Shuara', nameAr: 'الشعراء', meaning: 'Los Poetas', ayahs: 227 },
  { num: 27, name: 'An-Naml', nameAr: 'النمل', meaning: 'Las Hormigas', ayahs: 93 },
  { num: 28, name: 'Al-Qasas', nameAr: 'القصص', meaning: 'El Relato', ayahs: 88 },
  { num: 29, name: 'Al-Ankaboot', nameAr: 'العنكبوت', meaning: 'La Araña', ayahs: 69 },
  { num: 30, name: 'Ar-Room', nameAr: 'الروم', meaning: 'Los Romanos', ayahs: 60 },
  { num: 31, name: 'Luqman', nameAr: 'لقمان', meaning: 'Luqman', ayahs: 34 },
  { num: 32, name: 'As-Sajda', nameAr: 'السجدة', meaning: 'La Prosternación', ayahs: 30 },
  { num: 33, name: 'Al-Ahzab', nameAr: 'الأحزاب', meaning: 'Los Aliados', ayahs: 73 },
  { num: 34, name: 'Saba', nameAr: 'سبأ', meaning: 'Saba', ayahs: 54 },
  { num: 35, name: 'Fatir', nameAr: 'فاطر', meaning: 'El Originador', ayahs: 45 },
  { num: 36, name: 'Ya-Seen', nameAr: 'يس', meaning: 'Ya-Sin', ayahs: 83 },
  { num: 37, name: 'As-Saaffat', nameAr: 'الصافات', meaning: 'Los Ordenados en Filas', ayahs: 182 },
  { num: 38, name: 'Sad', nameAr: 'ص', meaning: 'Sad', ayahs: 88 },
  { num: 39, name: 'Az-Zumar', nameAr: 'الزمر', meaning: 'Los Grupos', ayahs: 75 },
  { num: 40, name: 'Ghafir', nameAr: 'غافر', meaning: 'El Perdonador', ayahs: 85 },
  { num: 41, name: 'Fussilat', nameAr: 'فصلت', meaning: 'Explicados en Detalle', ayahs: 54 },
  { num: 42, name: 'Ash-Shura', nameAr: 'الشورى', meaning: 'La Consulta', ayahs: 53 },
  { num: 43, name: 'Az-Zukhruf', nameAr: 'الزخرف', meaning: 'Los Adornos de Oro', ayahs: 89 },
  { num: 44, name: 'Ad-Dukhan', nameAr: 'الدخان', meaning: 'El Humo', ayahs: 59 },
  { num: 45, name: 'Al-Jathiya', nameAr: 'الجاثية', meaning: 'La Arrodillada', ayahs: 37 },
  { num: 46, name: 'Al-Ahqaf', nameAr: 'الأحقاف', meaning: 'Las Dunas', ayahs: 35 },
  { num: 47, name: 'Muhammad', nameAr: 'محمد', meaning: 'Muhammad', ayahs: 38 },
  { num: 48, name: 'Al-Fath', nameAr: 'الفتح', meaning: 'La Victoria', ayahs: 29 },
  { num: 49, name: 'Al-Hujraat', nameAr: 'الحجرات', meaning: 'Las Habitaciones', ayahs: 18 },
  { num: 50, name: 'Qaf', nameAr: 'ق', meaning: 'Qaf', ayahs: 45 },
  { num: 51, name: 'Adh-Dhariyat', nameAr: 'الذاريات', meaning: 'Los Vientos', ayahs: 60 },
  { num: 52, name: 'At-Tur', nameAr: 'الطور', meaning: 'El Monte', ayahs: 49 },
  { num: 53, name: 'An-Najm', nameAr: 'النجم', meaning: 'La Estrella', ayahs: 62 },
  { num: 54, name: 'Al-Qamar', nameAr: 'القمر', meaning: 'La Luna', ayahs: 55 },
  { num: 55, name: 'Ar-Rahman', nameAr: 'الرحمن', meaning: 'El Misericordioso', ayahs: 78 },
  { num: 56, name: 'Al-Waqia', nameAr: 'الواقعة', meaning: 'El Acontecimiento', ayahs: 96 },
  { num: 57, name: 'Al-Hadid', nameAr: 'الحديد', meaning: 'El Hierro', ayahs: 29 },
  { num: 58, name: 'Al-Mujadila', nameAr: 'المجادلة', meaning: 'La Disputa', ayahs: 22 },
  { num: 59, name: 'Al-Hashr', nameAr: 'الحشر', meaning: 'La Concentración', ayahs: 24 },
  { num: 60, name: 'Al-Mumtahina', nameAr: 'الممتحنة', meaning: 'La Examinada', ayahs: 13 },
  { num: 61, name: 'As-Saff', nameAr: 'الصف', meaning: 'Las Filas', ayahs: 14 },
  { num: 62, name: 'Al-Jumua', nameAr: 'الجمعة', meaning: 'El Viernes', ayahs: 11 },
  { num: 63, name: 'Al-Munafiqoon', nameAr: 'المنافقون', meaning: 'Los Hipócritas', ayahs: 11 },
  { num: 64, name: 'At-Taghabun', nameAr: 'التغابن', meaning: 'El Desengaño', ayahs: 18 },
  { num: 65, name: 'At-Talaq', nameAr: 'الطلاق', meaning: 'El Divorcio', ayahs: 12 },
  { num: 66, name: 'At-Tahrim', nameAr: 'التحريم', meaning: 'La Prohibición', ayahs: 12 },
  { num: 67, name: 'Al-Mulk', nameAr: 'الملك', meaning: 'La Soberanía', ayahs: 30 },
  { num: 68, name: 'Al-Qalam', nameAr: 'القلم', meaning: 'El Cálamo', ayahs: 52 },
  { num: 69, name: 'Al-Haaqqa', nameAr: 'الحاقة', meaning: 'La Inevitable', ayahs: 52 },
  { num: 70, name: 'Al-Maarij', nameAr: 'المعارج', meaning: 'Las Vías de Ascenso', ayahs: 44 },
  { num: 71, name: 'Nooh', nameAr: 'نوح', meaning: 'Noé', ayahs: 28 },
  { num: 72, name: 'Al-Jinn', nameAr: 'الجن', meaning: 'Los Genios', ayahs: 28 },
  { num: 73, name: 'Al-Muzzammil', nameAr: 'المزمل', meaning: 'El Arropado', ayahs: 20 },
  { num: 74, name: 'Al-Muddaththir', nameAr: 'المدثر', meaning: 'El Envuelto', ayahs: 56 },
  { num: 75, name: 'Al-Qiyama', nameAr: 'القيامة', meaning: 'La Resurrección', ayahs: 40 },
  { num: 76, name: 'Al-Insan', nameAr: 'الإنسان', meaning: 'El Ser Humano', ayahs: 31 },
  { num: 77, name: 'Al-Mursalat', nameAr: 'المرسلات', meaning: 'Los Enviados', ayahs: 50 },
  { num: 78, name: 'An-Naba', nameAr: 'النبأ', meaning: 'La Noticia', ayahs: 40 },
  { num: 79, name: 'An-Naziat', nameAr: 'النازعات', meaning: 'Los Que Arrancan', ayahs: 46 },
  { num: 80, name: 'Abasa', nameAr: 'عبس', meaning: 'Frunció el Ceño', ayahs: 42 },
  { num: 81, name: 'At-Takwir', nameAr: 'التكوير', meaning: 'El Enrollamiento', ayahs: 29 },
  { num: 82, name: 'Al-Infitar', nameAr: 'الإنفطار', meaning: 'La Hendidura', ayahs: 19 },
  { num: 83, name: 'Al-Mutaffifin', nameAr: 'المطففين', meaning: 'Los Tramposos', ayahs: 36 },
  { num: 84, name: 'Al-Inshiqaq', nameAr: 'الإنشقاق', meaning: 'El Resquebrajamiento', ayahs: 25 },
  { num: 85, name: 'Al-Burooj', nameAr: 'البروج', meaning: 'Las Constelaciones', ayahs: 22 },
  { num: 86, name: 'At-Tariq', nameAr: 'الطارق', meaning: 'El Astro Nocturno', ayahs: 17 },
  { num: 87, name: 'Al-Ala', nameAr: 'الأعلى', meaning: 'El Altísimo', ayahs: 19 },
  { num: 88, name: 'Al-Ghashiya', nameAr: 'الغاشية', meaning: 'La Que Cubre', ayahs: 26 },
  { num: 89, name: 'Al-Fajr', nameAr: 'الفجر', meaning: 'El Alba', ayahs: 30 },
  { num: 90, name: 'Al-Balad', nameAr: 'البلد', meaning: 'La Ciudad', ayahs: 20 },
  { num: 91, name: 'Ash-Shams', nameAr: 'الشمس', meaning: 'El Sol', ayahs: 15 },
  { num: 92, name: 'Al-Lail', nameAr: 'الليل', meaning: 'La Noche', ayahs: 21 },
  { num: 93, name: 'Ad-Duha', nameAr: 'الضحى', meaning: 'La Mañana', ayahs: 11 },
  { num: 94, name: 'Ash-Sharh', nameAr: 'الشرح', meaning: 'La Apertura del Pecho', ayahs: 8 },
  { num: 95, name: 'At-Tin', nameAr: 'التين', meaning: 'La Higuera', ayahs: 8 },
  { num: 96, name: 'Al-Alaq', nameAr: 'العلق', meaning: 'El Coágulo', ayahs: 19 },
  { num: 97, name: 'Al-Qadr', nameAr: 'القدر', meaning: 'El Decreto', ayahs: 5 },
  { num: 98, name: 'Al-Bayyina', nameAr: 'البينة', meaning: 'La Prueba Clara', ayahs: 8 },
  { num: 99, name: 'Az-Zalzala', nameAr: 'الزلزلة', meaning: 'El Terremoto', ayahs: 8 },
  { num: 100, name: 'Al-Adiyat', nameAr: 'العاديات', meaning: 'Los Corceles', ayahs: 11 },
  { num: 101, name: 'Al-Qaria', nameAr: 'القارعة', meaning: 'La Calamidad', ayahs: 11 },
  { num: 102, name: 'At-Takathur', nameAr: 'التكاثر', meaning: 'El Afán de Tener Más', ayahs: 8 },
  { num: 103, name: 'Al-Asr', nameAr: 'العصر', meaning: 'El Tiempo', ayahs: 3 },
  { num: 104, name: 'Al-Humaza', nameAr: 'الهمزة', meaning: 'El Difamador', ayahs: 9 },
  { num: 105, name: 'Al-Fil', nameAr: 'الفيل', meaning: 'El Elefante', ayahs: 5 },
  { num: 106, name: 'Quraish', nameAr: 'قريش', meaning: 'Los Quraish', ayahs: 4 },
  { num: 107, name: 'Al-Maun', nameAr: 'الماعون', meaning: 'La Ayuda Mutua', ayahs: 7 },
  { num: 108, name: 'Al-Kawthar', nameAr: 'الكوثر', meaning: 'La Abundancia', ayahs: 3 },
  { num: 109, name: 'Al-Kafiroon', nameAr: 'الكافرون', meaning: 'Los Incrédulos', ayahs: 6 },
  { num: 110, name: 'An-Nasr', nameAr: 'النصر', meaning: 'La Victoria', ayahs: 3 },
  { num: 111, name: 'Al-Masad', nameAr: 'المسد', meaning: 'Las Fibras', ayahs: 5 },
  { num: 112, name: 'Al-Ikhlas', nameAr: 'الإخلاص', meaning: 'La Sinceridad', ayahs: 4 },
  { num: 113, name: 'Al-Falaq', nameAr: 'الفلق', meaning: 'El Amanecer', ayahs: 5 },
  { num: 114, name: 'An-Nas', nameAr: 'الناس', meaning: 'La Humanidad', ayahs: 6 },
]

// Cache en memoria + localStorage para no re-descargar surahs ya vistas.
const memCache = {}

function lsKey(num) {
  return `mihrab-surah-${num}`
}

// Descarga los versículos de una surah: árabe + transliteración + traducción ES.
// Devuelve [{ ayah, arabic, transliteracion, traduccion }].
export async function fetchSurahVerses(num) {
  if (memCache[num]) return memCache[num]

  // Intentar localStorage primero
  try {
    const cached = localStorage.getItem(lsKey(num))
    if (cached) {
      const parsed = JSON.parse(cached)
      memCache[num] = parsed
      return parsed
    }
  } catch { /* ignore */ }

  // Una sola petición trae las 3 ediciones (árabe, transliteración, español)
  const url = `https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,en.transliteration,es.cortes`
  const res = await fetch(url)
  if (!res.ok) throw new Error('No se pudo cargar la surah')
  const json = await res.json()

  const [ar, tr, es] = json.data

  // La edición árabe antepone la Basmala (4 palabras: بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ
  // ٱلرَّحِيمِ) al primer ayah de casi todas las surahs (excepto Al-Fatiha #1 y
  // At-Tawba #9), pero la transliteración y traducción no la incluyen. La
  // quitamos por tokens (independiente de los diacríticos) para que las 3
  // líneas coincidan.
  const verses = ar.ayahs.map((a, i) => {
    let arabic = a.text
    if (i === 0 && num !== 1 && num !== 9) {
      const tokens = arabic.split(/\s+/)
      if (tokens.length > 4 && tokens[0].startsWith('بِ')) {
        arabic = tokens.slice(4).join(' ')
      }
    }
    return {
      ayah: a.numberInSurah,
      arabic,
      transliteracion: tr.ayahs[i]?.text || '',
      traduccion: es.ayahs[i]?.text || '',
    }
  })

  memCache[num] = verses
  try {
    localStorage.setItem(lsKey(num), JSON.stringify(verses))
  } catch { /* cuota llena — ignorar */ }

  return verses
}
