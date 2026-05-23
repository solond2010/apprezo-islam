// Recitador: Abdul Basit Abdul Samad (everyayah.com)
const EA = 'https://everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com'

// Helper: genera URLs para una o varias ayahs de una sura
// quranAudio(1, 1)        → ['...001001.mp3']
// quranAudio(1, 2, 3, 7)  → ['...001002.mp3', '...001003.mp3', '...001007.mp3']
function quranAudio(surah, ...ayahs) {
  const s = String(surah).padStart(3, '0')
  return ayahs.map((a) => `${EA}/${s}${String(a).padStart(3, '0')}.mp3`)
}

export const PRAYER_RAKAATS = {
  fajr: 2,
  dhuhr: 4,
  asr: 4,
  maghrib: 3,
  isha: 4,
}

export const PRAYER_STEPS = [
  {
    id: 'niyya',
    name: 'Intención (Niyya)',
    nameAr: 'النية',
    position: 'standing',
    description:
      'Haz la intención en tu corazón de realizar la oración. No se dice en voz alta.',
    instruction: 'Ponte de pie mirando hacia la Qibla. La intención no requiere palabras.',
    arabic: null,
    transliteration: null,
    translation: null,
    audioKey: null,
    audioUrls: null,
    repeat: 1,
    onlyFirstRakaa: true,
  },
  {
    id: 'takbir_initial',
    name: 'Takbir de apertura',
    nameAr: 'تكبيرة الإحرام',
    position: 'standing',
    description: 'Levanta las manos a la altura de los hombros/orejas y di:',
    instruction: 'Levanta ambas manos con los dedos separados, palmas hacia adelante.',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah es el más Grande',
    audioKey: 'takbir',
    audioUrls: null,
    repeat: 1,
    onlyFirstRakaa: true,
  },
  {
    id: 'dua_opening',
    name: "Du'a de apertura",
    nameAr: 'دعاء الاستفتاح',
    position: 'standing',
    description: 'Recita en voz baja solo en la primera rakaa:',
    instruction: 'Manos sobre el pecho, derecha sobre izquierda.',
    arabic:
      'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
    transliteration:
      "Subhānaka Allāhumma wa bihamdik, wa tabārakasmuk, wa ta'ālā jadduk, wa lā ilāha ghayruk",
    translation:
      'Gloria a Ti, oh Allah, y toda alabanza es Tuya. Bendito es Tu nombre, exaltada Tu majestad. No hay dios sino Tú.',
    audioKey: 'dua_opening',
    audioUrls: null,
    repeat: 1,
    onlyFirstRakaa: true,
  },
  {
    id: 'basmala',
    name: 'Bismillah',
    nameAr: 'البسملة',
    position: 'standing',
    description: 'Recita en voz baja antes de Al-Fatiha:',
    instruction: 'Manos sobre el pecho.',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāhi r-rahmāni r-rahīm',
    translation: 'En el nombre de Allah, el Compasivo, el Misericordioso',
    audioKey: 'basmala',
    audioUrls: quranAudio(1, 1),
    repeat: 1,
  },
  {
    id: 'fatiha',
    name: 'Al-Fatiha',
    nameAr: 'الفاتحة',
    position: 'standing',
    description: 'Recita la apertura del Corán:',
    instruction:
      'Obligatoria en cada rakaa. En Fajr, Maghrib (1ª-2ª) e Isha (1ª-2ª) en voz alta. En Dhuhr y Asr en silencio.',
    arabic:
      'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration:
      "Alhamdu lillāhi rabbi l-'ālamīn. Ar-rahmāni r-rahīm. Māliki yawmi d-dīn. Iyyāka na'budu wa iyyāka nasta'īn. Ihdinā s-sirāta l-mustaqīm. Sirāta lladhīna an'amta 'alayhim, ghayri l-maghdūbi 'alayhim wa lā d-dāllīn.",
    translation:
      'Toda alabanza pertenece a Allah, Señor de los mundos, el Compasivo, el Misericordioso, Dueño del Día del Juicio. Solo a Ti adoramos y solo a Ti pedimos ayuda. Guíanos por el camino recto, el camino de quienes has bendecido, no de los que se han ganado la ira ni de los extraviados.',
    audioKey: 'fatiha',
    // Surah 1, ayahs 2-7 (la basmala = ayah 1 ya está en el paso anterior)
    audioUrls: quranAudio(1, 2, 3, 4, 5, 6, 7),
    repeat: 1,
    note: 'Ameen — di Ameen en voz baja al terminar',
  },
  {
    id: 'surah',
    name: 'Surah corta',
    nameAr: 'سورة قصيرة',
    position: 'standing',
    description: 'Recita una surah corta tras Al-Fatiha. Se recomienda Al-Ikhlas:',
    instruction: 'Solo en las primeras 2 rakaas. En Fajr, Maghrib e Isha en voz alta.',
    arabic:
      'قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ',
    transliteration: 'Qul huwa Llāhu ahad. Allāhu s-samad. Lam yalid wa lam yūlad. Wa lam yakun lahu kufuwan ahad.',
    translation: 'Di: Él es Allah, Uno. Allah, el Eterno Absoluto. No engendró ni fue engendrado. Y no hay nadie comparable a Él.',
    audioKey: 'surah_ikhlas',
    // Surah 112 (Al-Ikhlas), ayahs 1-4
    audioUrls: quranAudio(112, 1, 2, 3, 4),
    repeat: 1,
    onlyInRakaas: [1, 2],
  },
  {
    id: 'takbir_ruku',
    name: 'Takbir → Ruku',
    nameAr: 'تكبير الركوع',
    position: 'standing',
    description: 'Di Allahu Akbar mientras te inclinas:',
    instruction: 'Inclínate hasta que tu espalda quede horizontal, manos sobre las rodillas.',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah es el más Grande',
    audioKey: 'takbir',
    audioUrls: null,
    repeat: 1,
  },
  {
    id: 'ruku',
    name: 'Ruku (inclinación)',
    nameAr: 'الركوع',
    position: 'bowing',
    description: 'En posición de inclinación, di:',
    instruction: 'Espalda recta y horizontal, manos sobre rodillas, ojos hacia abajo.',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliteration: "Subhāna rabbiyal 'azīm",
    translation: 'Gloria a mi Señor, el Grandioso',
    audioKey: 'ruku_tasbih',
    audioUrls: null,
    repeat: 3,
  },
  {
    id: 'tasmi',
    name: 'Levantarse del Ruku',
    nameAr: 'التسميع',
    position: 'standing',
    description: 'Al incorporarte di:',
    instruction: 'Levántate completamente hasta quedar erguido.',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
    transliteration: "Sami'a Llāhu liman hamidah",
    translation: 'Allah escucha a quien Le alaba',
    audioKey: 'tasmi',
    audioUrls: null,
    repeat: 1,
  },
  {
    id: 'tahmid',
    name: 'Tahmid (de pie)',
    nameAr: 'التحميد',
    position: 'standing',
    description: 'De pie, añade:',
    instruction: 'Permanece erguido un momento antes de prosternarte.',
    arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ',
    transliteration: 'Rabbanā wa laka l-hamd',
    translation: 'Señor nuestro, a Ti sea toda la alabanza',
    audioKey: 'tahmid',
    audioUrls: null,
    repeat: 1,
  },
  {
    id: 'takbir_sujud',
    name: 'Takbir → Sujud',
    nameAr: 'تكبير السجود',
    position: 'standing',
    description: 'Di Allahu Akbar mientras te prosternas:',
    instruction: 'Baja al suelo: rodillas, manos, frente y nariz tocan el suelo.',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah es el más Grande',
    audioKey: 'takbir',
    audioUrls: null,
    repeat: 1,
  },
  {
    id: 'sujud_1',
    name: 'Primer Sujud',
    nameAr: 'السجدة الأولى',
    position: 'prostrating',
    description: 'Prosternado, di:',
    instruction: 'Frente, nariz, ambas palmas, rodillas y dedos del pie tocan el suelo.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhāna rabbiyal a'lā",
    translation: 'Gloria a mi Señor, el Altísimo',
    audioKey: 'sujud_tasbih',
    audioUrls: null,
    repeat: 3,
  },
  {
    id: 'jalsah',
    name: 'Jalsah (sentarse entre sujudes)',
    nameAr: 'الجلسة',
    position: 'sitting',
    description: 'Siéntate brevemente entre los dos sujudes y di:',
    instruction: 'Siéntate sobre el pie izquierdo, pie derecho erguido.',
    arabic: 'رَبِّ اغْفِرْ لِي',
    transliteration: 'Rabbi ghfir lī',
    translation: 'Señor mío, perdóname',
    audioKey: 'jalsah',
    audioUrls: null,
    repeat: 1,
  },
  {
    id: 'takbir_sujud2',
    name: 'Takbir → Segundo Sujud',
    nameAr: 'تكبير السجدة الثانية',
    position: 'sitting',
    description: 'Di Allahu Akbar para el segundo sujud:',
    instruction: 'Vuelve a prosternarte igual que antes.',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah es el más Grande',
    audioKey: 'takbir',
    audioUrls: null,
    repeat: 1,
  },
  {
    id: 'sujud_2',
    name: 'Segundo Sujud',
    nameAr: 'السجدة الثانية',
    position: 'prostrating',
    description: 'Segunda postración, di:',
    instruction: 'Igual que el primer sujud.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhāna rabbiyal a'lā",
    translation: 'Gloria a mi Señor, el Altísimo',
    audioKey: 'sujud_tasbih',
    audioUrls: null,
    repeat: 3,
  },
  {
    id: 'tashahhud_middle',
    name: 'Tashahhud (sentada intermedia)',
    nameAr: 'التشهد الأوسط',
    position: 'sitting',
    description: 'Tras la 2ª rakaa en oraciones de 3 o 4 rakaas, siéntate y recita:',
    instruction: 'Siéntate. Levanta el dedo índice derecho al decir "illa Allah".',
    arabic:
      'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration:
      "At-tahiyyātu lillāhi was-salawātu wat-tayyibāt. As-salāmu 'alayka ayyuhan-nabiyyu wa rahmatullāhi wa barakātuh. As-salāmu 'alaynā wa 'alā 'ibādillāhis-sālihīn. Ashhadu an lā ilāha illallāhu wa ashhadu anna Muhammadan 'abduhu wa rasūluh.",
    translation:
      'Todos los saludos, oraciones y palabras buenas son para Allah. La paz sea contigo, oh Profeta, y la misericordia y bendiciones de Allah. La paz sea con nosotros y con los siervos virtuosos de Allah. Atestiguo que no hay dios sino Allah, y atestiguo que Muhammad es Su siervo y mensajero.',
    audioKey: 'tashahhud',
    audioUrls: null,
    repeat: 1,
    afterRakaa: 2,
    notLastRakaa: true,
  },
  {
    id: 'tashahhud_final',
    name: 'Tashahhud final',
    nameAr: 'التشهد الأخير',
    position: 'sitting',
    description: 'En la última rakaa, recita el Tashahhud completo:',
    instruction: 'Siéntate. Levanta el dedo índice derecho al decir "illa Allah".',
    arabic:
      'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'At-tahiyyātu lillāhi... (igual que el tashahhud intermedio)',
    translation: 'Igual que el tashahhud intermedio',
    audioKey: 'tashahhud',
    audioUrls: null,
    repeat: 1,
    lastRakaaOnly: true,
  },
  {
    id: 'darood',
    name: 'Darood Ibrahim',
    nameAr: 'الصلاة الإبراهيمية',
    position: 'sitting',
    description: 'Tras el Tashahhud final, recita:',
    instruction: 'Continúa sentado.',
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      "Allāhumma salli 'alā Muhammadin wa 'alā āli Muhammadin kamā sallayta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Hamīdun Majīd. Allāhumma bārik 'alā Muhammadin wa 'alā āli Muhammadin kamā bārakta 'alā Ibrāhīma wa 'alā āli Ibrāhīm, innaka Hamīdun Majīd.",
    translation:
      'Oh Allah, envía bendiciones sobre Muhammad y sobre la familia de Muhammad, como enviaste bendiciones sobre Ibrahim y la familia de Ibrahim. Ciertamente Tú eres Digno de alabanza, Glorioso.',
    audioKey: 'darood',
    audioUrls: null,
    repeat: 1,
    lastRakaaOnly: true,
  },
  {
    id: 'dua_final',
    name: "Du'a final",
    nameAr: 'الدعاء الأخير',
    position: 'sitting',
    description: 'Antes del salam, puedes recitar esta súplica (sunnah):',
    instruction: 'Continúa sentado.',
    arabic:
      'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliteration:
      "Allāhumma innī zalamtu nafsī zulman kathīran wa lā yaghfiru dh-dhunūba illā Anta, faghfir lī maghfiratan min 'indika warhamni innaka Anta l-Ghafūru r-Rahīm.",
    translation:
      'Oh Allah, me he hecho a mí mismo mucha injusticia y nadie perdona los pecados sino Tú, así que concédeme Tu perdón y ten misericordia de mí. Ciertamente Tú eres el Perdonador, el Misericordioso.',
    audioKey: 'dua_final',
    audioUrls: null,
    repeat: 1,
    lastRakaaOnly: true,
  },
  {
    id: 'salam',
    name: 'Salam (fin del rezo)',
    nameAr: 'التسليم',
    position: 'sitting',
    description: 'Gira la cabeza a la derecha y luego a la izquierda diciendo:',
    instruction: 'Primero a la derecha, luego a la izquierda. El rezo ha terminado.',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'As-salāmu \'alaykum wa rahmatullāh',
    translation: 'La paz y misericordia de Allah sean con vosotros',
    audioKey: 'salam',
    audioUrls: null,
    repeat: 2,
  },
]

export function getStepsForRakaa(rakaaNumber, totalRakaas) {
  return PRAYER_STEPS.filter((step) => {
    if (step.onlyFirstRakaa && rakaaNumber !== 1) return false
    if (step.onlyInRakaas && !step.onlyInRakaas.includes(rakaaNumber)) return false
    if (step.lastRakaaOnly && rakaaNumber !== totalRakaas) return false
    if (step.notLastRakaa && rakaaNumber === totalRakaas) return false
    if (step.afterRakaa) {
      return rakaaNumber === step.afterRakaa && totalRakaas > step.afterRakaa
    }
    return true
  })
}

export function getPrayerById(id) {
  const map = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
  return map[id.toLowerCase()] || id
}
