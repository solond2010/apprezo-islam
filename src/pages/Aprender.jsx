import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowLeft,
  Waves, Shield, CircleAlert, Star, BookMarked, MessageSquare,
  BookOpen, Heart, Shirt, Repeat2, Moon, Utensils, Dog,
  Droplets, Sunset, HelpCircle, Scroll, Zap, Globe,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

// ── Datos ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',         label: 'Todo' },
  { id: 'fundamentos', label: 'Fundamentos' },
  { id: 'pureza',      label: 'Pureza' },
  { id: 'oracion',     label: 'Oración' },
  { id: 'quran',       label: 'Quran' },
  { id: 'ayuno',       label: 'Ayuno' },
  { id: 'vida',        label: 'Vida' },
]

const topics = [
  // ── FUNDAMENTOS ──────────────────────────────────────────────────────────
  {
    id: 1,
    category: 'fundamentos',
    title: '¿Qué es el Islam?',
    subtitle: 'La religión de sumisión a Allah',
    icon: Globe,
    reference: 'Hadith de Ibn Umar — Sahih al-Bukhari 8 y Sahih Muslim 16',
    content: [
      'El Islam es la religión de sumisión a Allah, basada en los Cinco Pilares que el Profeta ﷺ describió con claridad.',
      'La palabra "Islam" en árabe significa sumisión y paz. Quien se somete a la voluntad de Allah alcanza la paz verdadera en este mundo y en el siguiente.',
      'El Profeta ﷺ dijo: "El Islam se ha construido sobre cinco pilares: el testimonio de que no hay más dios que Allah y que Muhammad es Su Mensajero, establecer la oración, dar el Zakat, peregrinar a la Meca y ayunar el mes de Ramadán."',
    ],
  },
  {
    id: 2,
    category: 'fundamentos',
    title: 'Los Cinco Pilares del Islam',
    subtitle: 'Los fundamentos de la práctica islámica',
    icon: Star,
    reference: 'Sahih al-Bukhari 8 y Sahih Muslim 16',
    content: [
      'Los Cinco Pilares son los fundamentos sobre los que se construye la vida del musulmán:',
      '1. SHAHADA — El testimonio de fe: "No hay más dios que Allah y Muhammad es Su Mensajero."',
      '2. SALAH — Las cinco oraciones diarias, el pilar más practicado del Islam.',
      '3. ZAKAT — La limosna obligatoria del 2,5% de la riqueza acumulada.',
      '4. SAWM — El ayuno durante el mes de Ramadán.',
      '5. HAJJ — La peregrinación a La Meca al menos una vez en la vida, para quien tenga capacidad.',
      'Estos cinco pilares no son opcionales; son obligaciones directas de Allah sobre cada musulmán adulto y capaz.',
    ],
  },
  {
    id: 3,
    category: 'fundamentos',
    title: '¿Qué es la Shahada?',
    subtitle: 'El testimonio de fe islámico',
    icon: Scroll,
    reference: 'Hadith de Anas — Sahih al-Bukhari 582 y Sahih Muslim 43',
    content: [
      'La Shahada es el testimonio de fe: "Ashhadu an la ilaha illa Allah wa ashhadu anna Muhammadan rasulullah."',
      'Traducción: "Testifico que no hay más dios que Allah y que Muhammad es Su Mensajero."',
      'Es el primer pilar del Islam y la puerta de entrada a la religión. Quien la pronuncia con sinceridad y comprensión, entra al Islam.',
      'El Profeta ﷺ dijo: "Quien diga \'La ilaha illa Allah\' con sinceridad en su corazón, entrará al Paraíso."',
      'Para convertirse al Islam, basta con pronunciarla con convicción. No se necesita testigo oficial, aunque es recomendable hacerlo ante la comunidad musulmana.',
    ],
  },
  {
    id: 4,
    category: 'fundamentos',
    title: '¿Qué es "Fard"?',
    subtitle: 'Lo obligatorio en el Islam',
    icon: Zap,
    reference: 'Principio establecido en el Fiqh islámico — Quran 2:183, 9:71',
    content: [
      'Fard (o Farz) significa obligatorio. Son los mandamientos directos e innegociables dictados por Allah.',
      'La regla es clara: si lo haces, recibes recompensa divina. Si lo omites intencionadamente, cometes un pecado grave.',
      'Ejemplos de Fard: realizar los 5 rezos diarios, ayunar en el mes de Ramadán, pagar la caridad obligatoria (Zakat), cubrir la Awrah, realizar el Hajj si se tiene capacidad.',
      'Hay dos tipos: Fard Ayn (obligatorio individualmente, como la oración diaria) y Fard Kifaya (obligatorio colectivamente, como el janazah —oración fúnebre—, que si algunos lo hacen, los demás quedan exentos).',
    ],
  },
  {
    id: 5,
    category: 'fundamentos',
    title: '¿Qué es "Sunnah"?',
    subtitle: 'Las enseñanzas del Profeta ﷺ',
    icon: BookMarked,
    reference: 'Principio establecido en Usul al-Fiqh — Sahih al-Bukhari 1, Sahih Muslim 1907',
    content: [
      'Sunnah engloba las enseñanzas, acciones, hábitos y aprobaciones del Profeta Muhammad ﷺ. En términos de práctica diaria, se refiere a lo recomendado.',
      'La regla: Si lo haces, ganas una inmensa recompensa adicional y sigues el ejemplo del Profeta ﷺ. Si no lo haces, no cometes pecado, pero te pierdes esa bendición.',
      'Ejemplos: rezar oraciones voluntarias antes y después de las obligatorias (Rawatib), sonreír a los demás (el Profeta ﷺ dijo que la sonrisa es Sadaqa), romper el ayuno con dátiles, usar el miswak para limpiar los dientes.',
      'Seguir la Sunnah es un acto de amor hacia Allah: "Di: si amáis a Allah, seguidme, y Allah os amará" (Quran 3:31).',
    ],
  },
  {
    id: 6,
    category: 'fundamentos',
    title: '¿Qué es un "Hadith"?',
    subtitle: 'Las narraciones del Profeta Muhammad ﷺ',
    icon: MessageSquare,
    reference: 'Ciencia del Hadith (Ilm al-Hadith) — Sahih al-Bukhari, Sahih Muslim',
    content: [
      'Un Hadith (Hadiz) es un relato o narración registrada que documenta exactamente lo que el Profeta Muhammad ﷺ dijo, hizo o aprobó en vida.',
      'Importancia: Es la segunda fuente de conocimiento del Islam después del Quran. El Quran nos da la orden general (ejemplo: "estableced la oración"), y el Hadith nos explica el detalle práctico ("rezad de la forma en que me habéis visto rezar").',
      'Los eruditos lo investigaron exhaustivamente durante siglos. Un Hadith catalogado como Sahih (auténtico) significa que su cadena de transmisión es completamente fiable.',
      'Grados del Hadith: Sahih (auténtico), Hasan (bueno), Daif (débil), Mawdu (inventado). Solo los dos primeros sirven como evidencia religiosa.',
    ],
  },
  {
    id: 7,
    category: 'fundamentos',
    title: '¿Qué es la "Niyyah"?',
    subtitle: 'La intención en el corazón',
    icon: Heart,
    reference: 'Hadith de Umar ibn al-Khattab — Sahih al-Bukhari 1 y Sahih Muslim 1907',
    content: [
      'Niyyah significa intención. Es el motor interno de todo acto en el Islam.',
      'El Profeta ﷺ dijo: "Las acciones valen según las intenciones, y cada persona recibirá según lo que haya tenido intención." (Sahih al-Bukhari 1)',
      'Cómo se hace: Es un acto exclusivo del corazón y la mente. Pronunciarla en voz alta es un error común que no pertenece a la práctica auténtica del Profeta ﷺ. Solo necesitas tener claro en tu mente qué vas a hacer y que lo haces por Allah.',
      'Su función: Diferencia un acto cotidiano de un acto de adoración. Por ejemplo, ducharse para refrescarse por el calor versus ducharse con la intención de realizar la purificación ritual (Ghusl).',
      'Incluso comer, dormir o trabajar puede convertirse en adoración si se hace con la intención de obedecer a Allah.',
    ],
  },
  {
    id: 8,
    category: 'fundamentos',
    title: '¿Cómo se convierte alguien al Islam?',
    subtitle: 'Recitando la Shahada con sinceridad',
    icon: Globe,
    reference: 'Sahih al-Bukhari 582 y Sahih Muslim 43',
    content: [
      'Convertirse al Islam es sencillo: basta con pronunciar la Shahada con sinceridad y convicción en el corazón.',
      'La Shahada: "Ashhadu an la ilaha illa Allah wa ashhadu anna Muhammadan rasulullah."',
      'Traducción: "Testifico que no hay más dios que Allah y que Muhammad es Su Mensajero."',
      'Recomendaciones para quien se convierte:',
      '1. Hacer el Ghusl (baño ritual completo) tras la conversión.',
      '2. Aprender las oraciones básicas (Al-Fatiha y Tashahhud) lo antes posible.',
      '3. Conectar con la comunidad musulmana local para apoyo y guía.',
      'El Islam borra todos los pecados anteriores a la conversión. El Profeta ﷺ dijo: "El Islam elimina todo lo que hubo antes de él."',
    ],
  },

  // ── PUREZA ───────────────────────────────────────────────────────────────
  {
    id: 9,
    category: 'pureza',
    title: 'La Ablución (Wudu)',
    subtitle: 'Purificación antes del rezo',
    icon: Waves,
    reference: 'Quran 5:6 — Sahih al-Bukhari 135 y Sahih Muslim 225',
    content: [
      'El Wudu es la purificación que todo musulmán debe realizar antes de cada rezo. Allah dice en el Quran: "¡Oh, creyentes! Cuando os dispongáis a rezar, lavaos el rostro y los brazos hasta los codos, pasaos las manos húmedas por la cabeza y lavaos los pies hasta los tobillos." (5:6)',
      'Pasos del Wudu:',
      '1. Haz la intención (niyah) en el corazón de purificarte.',
      '2. Di "Bismillah" (En el nombre de Dios).',
      '3. Lava tus manos tres veces hasta las muñecas.',
      '4. Enjuaga tu boca tres veces con agua.',
      '5. Aspira agua en tu nariz y luego expúlsala tres veces.',
      '6. Lava tu rostro tres veces, desde la frente hasta la barbilla y de oreja a oreja.',
      '7. Lava tu brazo derecho tres veces hasta el codo, luego el izquierdo.',
      '8. Pasa tus manos húmedas sobre tu cabeza una vez, desde la frente hasta la nuca y de vuelta.',
      '9. Limpia el interior de tus orejas con los dedos índices y la parte externa con los pulgares.',
      '10. Lava tu pie derecho tres veces hasta los tobillos, luego el izquierdo.',
      'El Wudu se rompe al: orinar, defecar, expulsar gases, dormir profundamente, perder el conocimiento o tocar los órganos sexuales sin barrera.',
    ],
  },
  {
    id: 10,
    category: 'pureza',
    title: '¿Qué invalida el Wudu?',
    subtitle: 'Cosas que rompen la ablución',
    icon: Waves,
    reference: 'Hadith de Abu Hurayrah — Sahih al-Bukhari 135 y Sahih Muslim 225',
    content: [
      'El Profeta ﷺ dijo: "No se acepta la oración de quien tiene hadath (impureza) hasta que haga wudu."',
      'Cosas que invalidan el Wudu:',
      '1. Salida de cualquier cosa de las partes íntimas: orina, heces, gases, flujo de la mujer.',
      '2. Dormir profundamente (porque al perder la conciencia, no controla su cuerpo).',
      '3. Perder la consciencia o el conocimiento por cualquier causa.',
      '4. Tocar los genitales directamente con la palma de la mano (opinión de la mayoría de eruditos).',
      'Cosas que NO invalidan el Wudu (errores comunes):',
      '- Tocar a una mujer (el contacto simple sin deseo no rompe el wudu según la opinión más fuerte).',
      '- Comer carne cocinada (aunque hay un hadith débil sobre ello).',
      '- Sangrar de un corte pequeño (la sangre externa no invalida el wudu).',
      '- Vomitar (aunque es recomendable renovarlo por precaución).',
    ],
  },
  {
    id: 11,
    category: 'pureza',
    title: '¿Qué es el Ghusl?',
    subtitle: 'El baño ritual completo',
    icon: Droplets,
    reference: 'Quran 4:43 — Sahih al-Bukhari 248 (Hadith de Aisha)',
    content: [
      'El Ghusl es el baño ritual completo obligatorio tras la impureza mayor (Janaba). Allah dice: "Si estáis en estado de Janaba, purificaos." (Quran 4:43)',
      'Es obligatorio el Ghusl en estas situaciones:',
      '1. Tras las relaciones íntimas (aunque no haya eyaculación).',
      '2. Tras la eyaculación, ya sea dormido o despierto.',
      '3. Al terminar la menstruación (Hayd).',
      '4. Al terminar el sangrado del posparto (Nifas).',
      '5. Al convertirse al Islam (recomendado por la mayoría de eruditos).',
      'Cómo se realiza el Ghusl:',
      '1. Intención en el corazón.',
      '2. Lavar las manos y partes íntimas.',
      '3. Hacer el Wudu completo.',
      '4. Verter agua sobre toda la cabeza tres veces asegurándose que llega a la raíz del cabello.',
      '5. Verter agua sobre todo el cuerpo empezando por el lado derecho.',
      'La Aisha (رضي الله عنها) describió que el Profeta ﷺ comenzaba lavando las manos, luego hacía el Wudu y luego mojaba toda la cabeza.',
    ],
  },
  {
    id: 12,
    category: 'pureza',
    title: '¿Qué es el Istinja?',
    subtitle: 'Limpieza de partes íntimas tras el baño',
    icon: Droplets,
    reference: 'Hadith de Salman al-Farisi — Sahih Muslim 262',
    content: [
      'El Istinja es la limpieza de las partes íntimas después de orinar o defecar. Es obligatorio.',
      'El Profeta ﷺ nos prohibió usar la mano derecha y nos ordenó usar al menos tres piedras (o equivalente como papel higiénico) para limpiarse.',
      'Se puede limpiar con:',
      '1. Agua (lo mejor y más completo).',
      '2. Papel higiénico u objetos sólidos absorbentes que no sean haram (al menos 3 limpiezas).',
      '3. Lo más completo: primero limpiar con papel y luego con agua.',
      'Regla importante: no se debe usar la mano derecha durante el Istinja.',
      'El Profeta ﷺ dijo: "Que nadie de vosotros toque su pene con la mano derecha mientras orina, ni se limpie con la mano derecha." (Sahih al-Bukhari 153)',
    ],
  },
  {
    id: 13,
    category: 'pureza',
    title: 'El peligro de no limpiarse bien al orinar',
    subtitle: 'Una advertencia seria del Profeta ﷺ',
    icon: CircleAlert,
    reference: 'Hadith de Ibn Abbas — Sahih al-Bukhari 216 y Sunan Abi Dawud 20',
    content: [
      'El Profeta ﷺ pasó junto a dos tumbas y dijo: "Están siendo castigados, y no por algo grande. Uno de ellos no se protegía de la orina, y el otro iba con cuentos entre la gente."',
      'El Hadith de Ibn Abbas añade: "La mayor parte del tormento de la tumba es por la orina." (Sahih al-Bukhari 216)',
      'Esto nos enseña que la pureza en el baño es una obligación seria, no un asunto menor.',
      'Consejos prácticos:',
      '1. Asegúrate de terminar completamente de orinar antes de limpiarte.',
      '2. En caso de duda de goteo, puedes hacer wudu y colocar algo absorbente.',
      '3. No te obsesiones en exceso (waswas) — si tienes certeza de haber terminado, eso es suficiente.',
    ],
  },
  {
    id: 14,
    category: 'pureza',
    title: '¿Qué dice el Quran sobre la pureza?',
    subtitle: 'Allah ama a los que se purifican',
    icon: Heart,
    reference: 'Quran 2:222',
    content: [
      'Allah dice en el Quran: "Ciertamente Allah ama a los que siempre se arrepienten y ama a los que se purifican." (2:222)',
      'La pureza en el Islam tiene dos dimensiones: la pureza física (Taharah) y la pureza espiritual (Tazkiyah).',
      'La pureza física incluye el Wudu, el Ghusl, el Istinja y mantener la ropa y el lugar de rezo limpios.',
      'La pureza espiritual incluye limpiar el corazón de la envidia, el odio, la soberbia y los pecados mediante el arrepentimiento (Tawbah) y el recuerdo de Allah (Dhikr).',
      'El Profeta ﷺ dijo: "La pureza es la mitad de la fe." (Sahih Muslim 223)',
    ],
  },
  {
    id: 15,
    category: 'pureza',
    title: 'La saliva del perro: ¿es impura?',
    subtitle: 'Cómo tratar lo que tocó la boca de un perro',
    icon: Dog,
    reference: 'Hadith de Abu Hurayrah — Sahih Muslim 279 y Sahih al-Bukhari 172',
    content: [
      'Sí, la saliva del perro es Najis (impura) según el Islam.',
      'El Profeta ﷺ dijo: "Si un perro lame el recipiente de uno de vosotros, que lo lave siete veces, la primera vez con tierra." (Sahih Muslim 279)',
      'Cómo lavar lo que tocó la saliva de un perro:',
      '1. Lavar siete veces.',
      '2. La primera lavada debe ser con tierra (o en su defecto, un jabón con base de arcilla o tierra).',
      '3. Las seis restantes con agua limpia.',
      'Tocar el cuerpo seco del perro generalmente no requiere este lavado especial. Solo la saliva y la humedad de su hocico son Najis.',
      'Sobre tener un perro en casa: no está permitido salvo para caza, pastoreo o guardia de finca. Quien lo tenga perderá un Qirat de buenas obras cada día. (Sahih al-Bukhari 2322)',
    ],
  },

  // ── ORACIÓN ──────────────────────────────────────────────────────────────
  {
    id: 16,
    category: 'oracion',
    title: 'Condiciones para el Rezo',
    subtitle: 'Requisitos antes de comenzar a rezar',
    icon: Shield,
    reference: 'Quran 5:6 — Sahih al-Bukhari 391 y Sahih Muslim 376',
    content: [
      'Antes de comenzar cualquier rezo (Salat), deben cumplirse estas condiciones esenciales:',
      '1. ESTADO DE PUREZA: Haber realizado el Wudu (o Ghusl si es necesario). Sin purificación, el rezo no es válido.',
      '2. DIRECCIÓN CORRECTA (QIBLA): Debes rezar orientado hacia la Kaaba en La Meca.',
      '3. CUBRIR EL CUERPO (AWRAH): Para los hombres, cubrir desde el ombligo hasta las rodillas. Para las mujeres, cubrir todo el cuerpo excepto el rostro y las manos.',
      '4. LUGAR Y ROPA LIMPIOS: El lugar y la ropa deben estar libres de impurezas.',
      '5. TIEMPO CORRECTO: Cada rezo tiene un tiempo específico. No es válido rezar antes del tiempo establecido.',
      '6. INTENCIÓN (NIYAH): Debes tener la intención en tu corazón de qué rezo vas a realizar.',
      'Recuerda: Si falta alguna de estas condiciones, el rezo no es válido.',
    ],
  },
  {
    id: 17,
    category: 'oracion',
    title: '¿Cuántas oraciones obligatorias hay?',
    subtitle: 'Los cinco rezos del día',
    icon: Moon,
    reference: 'Hadith del Miraj — Sahih al-Bukhari 349 y Sahih Muslim 162',
    content: [
      'Hay cinco oraciones obligatorias al día. Fueron impuestas a los musulmanes durante el Miraj (ascenso del Profeta ﷺ a los cielos), cuando Allah le ordenó originalmente cincuenta oraciones y, por intercesión del Profeta ﷺ, quedaron en cinco.',
      'Las cinco oraciones y sus tiempos:',
      '1. FAJR — Desde el alba hasta el amanecer (2 Rakahs).',
      '2. DHUHR — Desde el mediodía hasta media tarde (4 Rakahs).',
      '3. ASR — Desde media tarde hasta el atardecer (4 Rakahs).',
      '4. MAGHRIB — Desde la puesta del sol hasta que desaparece el crepúsculo (3 Rakahs).',
      '5. ISHA — Desde que oscurece completamente hasta el alba (4 Rakahs).',
      'El Profeta ﷺ dijo: "Entre el hombre y el shirk y la kufr está el abandono de la oración." (Sahih Muslim 82)',
    ],
  },
  {
    id: 18,
    category: 'oracion',
    title: "¿Qué es una Rak'ah?",
    subtitle: 'Una unidad completa del rezo',
    icon: Repeat2,
    reference: 'Hadith de Rifa\'a ibn Rafi\' — Sunan Abi Dawud 856 (Sahih)',
    content: [
      "Una Rak'ah es una unidad o ciclo de movimientos que compone la oración islámica.",
      "Cada rezo tiene un número específico de Rak'ahs: Fajr tiene 2, Dhuhr tiene 4, Asr tiene 4, Maghrib tiene 3 e Isha tiene 4.",
      "El ciclo exacto de una Rak'ah:",
      "1. Ponerse de pie y recitar Al-Fatiha más una Surah adicional.",
      "2. Inclinarse apoyando las manos en las rodillas (Ruku), diciendo 'Subhana Rabbiyal Adhim' al menos tres veces.",
      "3. Volver a levantarse diciendo 'Sami Allahu liman hamidah, Rabbana wa lakal hamd'.",
      "4. Prosternarse con frente, nariz, manos, rodillas y pies en el suelo (Sujud), diciendo 'Subhana Rabbiyal A'la' al menos tres veces.",
      "5. Sentarse brevemente entre las dos prosternaciones.",
      "6. Realizar una segunda prosternación idéntica.",
      "Al levantarse de esa segunda prosternación se ha completado una Rak'ah.",
    ],
  },
  {
    id: 19,
    category: 'oracion',
    title: 'Errores al Rezar',
    subtitle: 'Cómo corregir equivocaciones en el Salat',
    icon: CircleAlert,
    reference: 'Hadith de Abu Hurayrah — Sahih al-Bukhari 793 y Sahih Muslim 397',
    content: [
      'Es normal equivocarse, especialmente cuando estás aprendiendo. El Islam es una religión de facilidad.',
      'ERRORES LEVES (OLVIDOS):',
      "- Si olvidas decir 'Subhana Rabbiyal Adhim' en el Ruku, no pasa nada. Continúa.",
      "- Si olvidas una parte obligatoria (como Al-Fatiha), debes repetir esa Rak'ah completa.",
      'ERRORES EN LA RECITACIÓN:',
      '- Si te equivocas al recitar Al-Fatiha, corrige el error y continúa desde donde lo dejaste.',
      '- Si no recuerdas cómo sigue un verso, puedes saltarlo y continuar.',
      'SUJUD AS-SAHW (PROSTERNACIÓN POR OLVIDO):',
      "- Si olvidas algo importante (como el primer Tashahhud), debes hacer dos Sujud adicionales al final del rezo (antes del Taslim).",
      "- Cómo hacerlo: después del Tashahhud final, di Salam solo a la derecha, luego haz dos Sujud adicionales, luego completa el Taslim.",
      'CONSEJO: Cuando tengas dudas sobre cuántas Rakahs has rezado, asume la menor cantidad y completa. ¡No te angusties! Allah ve tu esfuerzo.',
    ],
  },
  {
    id: 20,
    category: 'oracion',
    title: 'La Vestimenta en el Rezo (Awrah)',
    subtitle: 'Las partes del cuerpo que deben cubrirse',
    icon: Shirt,
    reference: 'Quran 7:31 — Sahih al-Bukhari 372 y Sahih Muslim 516',
    content: [
      'La Awrah define las partes del cuerpo que deben estar cubiertas durante la oración.',
      'EL HOMBRE: Debe cubrir obligatoriamente desde el ombligo hasta la rodilla (ambos inclusive). Es muy recomendable cubrir también los hombros durante el rezo.',
      'LA MUJER: Debe cubrir todo su cuerpo incluyendo el cabello, el cuello y los pies, dejando al descubierto únicamente el rostro y las manos.',
      'Requisitos para ambos:',
      '1. La ropa debe estar limpia de impurezas (Najasah).',
      '2. No debe ser transparente que deje ver la piel.',
      '3. No debe ser tan ceñida que marque el cuerpo.',
      'El Profeta ﷺ dijo: "Allah no acepta la oración de la mujer que ha alcanzado la pubertad sin cubrirse con el Khimar (velo)." (Sunan Abi Dawud 641)',
    ],
  },
  {
    id: 21,
    category: 'oracion',
    title: 'Recompensa de orar en Ramadán (Tarawih)',
    subtitle: 'La oración nocturna voluntaria de Ramadán',
    icon: Moon,
    reference: 'Sahih al-Bukhari 37 y Sahih Muslim 759',
    content: [
      'El Profeta ﷺ dijo: "Quien ore en Ramadán con fe y esperanza de recompensa, se le perdonarán sus pecados anteriores."',
      'La oración Tarawih es la oración nocturna voluntaria que se realiza en el mes de Ramadán, normalmente en la mezquita, en congregación.',
      'El número de rakahs varía: el Profeta ﷺ la realizaba en 11 rakahs (incluyendo el Witr). La práctica de 20 rakahs fue establecida por el Califa Umar ibn al-Khattab y es igualmente válida.',
      'Laylat al-Qadr (la Noche del Decreto) cae en los últimos 10 días de Ramadán, y orar esa noche equivale a más de 1000 meses de adoración. (Quran 97:1-5)',
    ],
  },

  // ── QURAN ────────────────────────────────────────────────────────────────
  {
    id: 22,
    category: 'quran',
    title: '¿Qué es el Quran?',
    subtitle: 'La palabra literal de Allah',
    icon: BookOpen,
    reference: 'Quran 2:185 — Sahih al-Bukhari 4986',
    content: [
      'El Quran es la palabra literal de Allah, revelada al Profeta Muhammad ﷺ a través del ángel Jibril (Gabriel) en un periodo de 23 años.',
      'Es el libro sagrado del Islam y la primera fuente de conocimiento y legislación. Ninguna palabra puede añadirse ni quitarse.',
      'El Profeta ﷺ dijo: "El mejor de vosotros es quien aprende el Quran y lo enseña." (Sahih al-Bukhari 5027)',
      'El Quran fue preservado de dos formas: memorizado en el pecho (Hifz) y escrito. Miles de Sahaba (compañeros) lo memorizaron completo en vida del Profeta ﷺ.',
      'Recitar el Quran es adoración: "Quien recite una letra del Libro de Allah, tendrá una buena obra, y la buena obra se multiplica por diez." (Jami at-Tirmidhi 2910)',
    ],
  },
  {
    id: 23,
    category: 'quran',
    title: '¿Qué es una Surah y una Ayah?',
    subtitle: 'Los capítulos y versículos del Quran',
    icon: BookOpen,
    reference: 'Quran 2:23 — Sahih al-Bukhari 4986 y 4987',
    content: [
      'SURAH: Es un capítulo del Sagrado Quran. El libro está dividido en 114 Surahs de diferentes longitudes.',
      'La Surah más corta es Al-Kawthar (108) con solo 3 ayahs. La más larga es Al-Baqarah (2) con 286 ayahs.',
      'AYAH: Es un versículo o frase dentro de una Surah. Su traducción literal es "señal" o "milagro". El Quran contiene 6.236 ayahs.',
      'Allah dice en el Quran: "Y si estáis en duda de lo que hemos revelado a Nuestro siervo, entonces traed una surah semejante a ella…" (2:23) — Este es el reto eterno del Quran que nadie ha podido cumplir.',
      'La primera Surah revelada fue Al-Alaq (96), y la última ayah revelada fue del Quran 5:3.',
    ],
  },
  {
    id: 24,
    category: 'quran',
    title: '¿Quién reveló el Quran al Profeta ﷺ?',
    subtitle: 'Allah a través del ángel Jibril',
    icon: Scroll,
    reference: 'Quran 2:97',
    content: [
      'Allah reveló el Quran al Profeta Muhammad ﷺ a través del ángel Jibril (Gabriel).',
      'Allah dice: "Di: Quien sea enemigo de Jibril, pues fue él quien lo reveló en tu corazón, con el permiso de Allah, confirmando lo que había antes, como guía y buena nueva para los creyentes." (Quran 2:97)',
      'La primera revelación ocurrió en la Cueva de Hira, cerca de La Meca, cuando el Profeta ﷺ tenía 40 años. El ángel Jibril se le apareció y le dijo: "¡Lee! (Iqra)"',
      'La revelación continuó durante 23 años: 13 en La Meca y 10 en Medina.',
    ],
  },
  {
    id: 25,
    category: 'quran',
    title: '¿Qué es Laylat al-Qadr?',
    subtitle: 'La Noche del Decreto — mejor que mil meses',
    icon: Star,
    reference: 'Quran 97:1-5 — Sahih al-Bukhari 2017',
    content: [
      'Laylat al-Qadr es la noche en que se inició la revelación del Quran, y Allah la describe como "mejor que mil meses" (más de 83 años de adoración).',
      'Allah dice: "En verdad lo hemos revelado en la Noche del Decreto. ¿Y qué te hará saber qué es la Noche del Decreto? La Noche del Decreto es mejor que mil meses." (Quran 97:1-3)',
      'Cuándo buscarla: cae en una de las noches impares de los últimos 10 días de Ramadán (21, 23, 25, 27 o 29).',
      'La mayoría de los eruditos considera que la noche 27 de Ramadán es la más probable.',
      'Qué hacer esa noche: orar, hacer Dhikr, leer Quran y rezar mucho. Aisha preguntó al Profeta ﷺ qué decir esa noche, y él respondió: "Di: Allahumma innaka afuwwun tuhibbul afwa fa\'fu anni" (Oh Allah, Tú eres Perdonador, amas el perdón, así que perdóname). (Jami at-Tirmidhi 3513)',
    ],
  },

  // ── AYUNO ────────────────────────────────────────────────────────────────
  {
    id: 26,
    category: 'ayuno',
    title: '¿En qué mes es obligatorio ayunar?',
    subtitle: 'El mes de Ramadán',
    icon: Moon,
    reference: 'Quran 2:185',
    content: [
      'El ayuno es obligatorio durante el mes de Ramadán, el noveno mes del calendario lunar islámico.',
      'Allah dice: "El mes de Ramadán en el que fue revelado el Quran como guía para la humanidad… quien de vosotros esté presente en ese mes, que ayune." (Quran 2:185)',
      'El Profeta ﷺ dijo: "Quien ayune Ramadán con fe y esperanza de recompensa, se le perdonarán sus pecados anteriores." (Sahih al-Bukhari 38)',
      'Quien no pueda ayunar (por enfermedad o viaje) puede recuperar los días después de Ramadán. Quien no pueda en absoluto (por enfermedad crónica) debe pagar la Fidya (alimentar a un pobre por cada día).',
    ],
  },
  {
    id: 27,
    category: 'ayuno',
    title: 'Horario del ayuno diario',
    subtitle: 'Desde el alba hasta la puesta de sol',
    icon: Sunset,
    reference: 'Quran 2:187',
    content: [
      'El ayuno diario va desde el alba (Fajr) hasta la puesta del sol (Maghrib).',
      'Allah dice: "Comed y bebed hasta que se distinga el hilo blanco del alba del hilo negro de la noche, luego completad el ayuno hasta la noche." (Quran 2:187)',
      'Al romper el ayuno (Iftar): el Profeta ﷺ recomendaba romper el ayuno con dátiles frescos, y si no los hay, con dátiles secos o agua.',
      'El Profeta ﷺ dijo: "Que la gente siga siendo buena mientras apresure el Iftar." (Sahih al-Bukhari 1957)',
      'El Suhoor (comida antes del alba) es muy recomendable: "Comed el Suhoor, pues en el Suhoor hay bendición." (Sahih al-Bukhari 1923)',
    ],
  },
  {
    id: 28,
    category: 'ayuno',
    title: '¿Qué rompe el ayuno?',
    subtitle: 'Acciones que invalidan el Sawm',
    icon: CircleAlert,
    reference: 'Quran 2:187 — Sahih al-Bukhari 1938',
    content: [
      'Cosas que rompen el ayuno intencionalmente y requieren Kaffarah (expiación) o recuperación:',
      '1. Comer o beber intencionalmente.',
      '2. Las relaciones íntimas durante el día de Ramadán (requiere Kaffarah mayor: liberar un esclavo, o ayunar 60 días consecutivos, o alimentar a 60 pobres).',
      '3. La eyaculación intencional.',
      'Cosas que NO rompen el ayuno (errores comunes):',
      '- Comer o beber por olvido (el Profeta ﷺ dijo: "Quien olvide y coma o beba que complete su ayuno, pues Allah le dio de comer y beber." — Sahih al-Bukhari 1933).',
      '- El vómito involuntario.',
      '- Las inyecciones que no nutren.',
      '- Enjuagarse la boca con agua sin tragarla.',
      '- El semen que sale durante el sueño (emisión nocturna).',
    ],
  },
  {
    id: 29,
    category: 'ayuno',
    title: 'Ayunos voluntarios recomendados',
    subtitle: 'Más allá del Ramadán',
    icon: Star,
    reference: 'Sahih Muslim 1162 y 1164',
    content: [
      'Además del Ramadán, existen varios ayunos voluntarios muy recomendados:',
      '1. LUNES Y JUEVES: El Profeta ﷺ dijo: "Las obras son presentadas los lunes y jueves, y me gusta que mis obras sean presentadas mientras ayuno." (Sahih Muslim 1162)',
      '2. SEIS DÍAS DE SHAWWAL: "Quien ayune Ramadán y luego seis días de Shawwal, será como si hubiera ayunado todo el año." (Sahih Muslim 1164)',
      '3. DÍA DE ARAFAH (9 de Dhul Hijjah): "Ayunar el día de Arafah lo considero expiación del año anterior y del año siguiente." (Sahih Muslim 1162)',
      '4. DÍA DE ASHURA (10 de Muharram): "Ayunar el día de Ashura es expiación del año anterior." (Sahih Muslim 1162)',
      '5. TRES DÍAS BLANCOS (13, 14 y 15 de cada mes lunar): El Profeta ﷺ los recomendó y los llamó "los días blancos".',
    ],
  },
  {
    id: 30,
    category: 'ayuno',
    title: 'Recompensa del ayuno de Ramadán',
    subtitle: 'Perdón de pecados anteriores',
    icon: Heart,
    reference: 'Sahih al-Bukhari 38 y Sahih Muslim 760',
    content: [
      'El Profeta ﷺ dijo: "Quien ayune Ramadán con fe (Iman) y esperanza de recompensa (Ihtisab), se le perdonarán sus pecados anteriores."',
      'Esta recompensa tiene condiciones:',
      '1. FE (Iman): ayunar creyendo que es una obligación de Allah, no por costumbre social.',
      '2. ESPERANZA DE RECOMPENSA (Ihtisab): ayunar buscando la recompensa de Allah, no por presión familiar o social.',
      'El Profeta ﷺ también dijo: "El ayuno es un escudo. Así que el que ayune, que no diga palabrotas ni grite. Y si alguien le insulta, que diga: \'Soy de los que ayunan.\'" (Sahih al-Bukhari 1894)',
      'Ramadán es el mes de la generosidad: el Profeta ﷺ era más generoso que el viento fuerte en este mes. (Sahih al-Bukhari 6)',
    ],
  },

  // ── VIDA ─────────────────────────────────────────────────────────────────
  {
    id: 31,
    category: 'vida',
    title: '¿Qué carnes están prohibidas?',
    subtitle: 'Alimentos Haram en el Islam',
    icon: Utensils,
    reference: 'Quran 2:173 y Quran 5:3',
    content: [
      'Allah dice: "Se os ha prohibido la carroña, la sangre, la carne de cerdo y aquello sobre lo cual se haya invocado otro nombre que el de Allah." (Quran 2:173)',
      'Lista completa de lo prohibido (Quran 5:3):',
      '1. La carroña (animal muerto sin sacrificio halal).',
      '2. La sangre derramada.',
      '3. La carne de cerdo (en cualquier forma).',
      '4. Lo sacrificado en nombre de otro que no sea Allah.',
      '5. El animal estrangulado, golpeado, caído, corneado o devorado por fiera (salvo si se lo degüella antes de morir).',
      '6. Lo sacrificado sobre altares (para ídolos).',
      'Todo lo demás es halal por principio, incluyendo mariscos, aves, ganado y aves de caza.',
    ],
  },
  {
    id: 32,
    category: 'vida',
    title: '¿Cómo debe sacrificarse un animal?',
    subtitle: 'Condiciones del sacrificio Halal',
    icon: Utensils,
    reference: 'Quran 5:4 — Hadith de Shaddad ibn Aws, Sahih Muslim 1955',
    content: [
      'Para que un animal sea halal, debe sacrificarse correctamente:',
      '1. Pronunciar el nombre de Allah al degollarlo: "Bismillah, Allahu Akbar."',
      '2. El sacrificador debe ser musulmán, judío o cristiano (Ahl al-Kitab).',
      '3. El animal debe ser degollado cortando la garganta, la tráquea y las dos venas yugulares en un solo corte rápido.',
      '4. El cuchillo debe estar bien afilado para minimizar el sufrimiento.',
      'El Profeta ﷺ dijo: "Allah ha prescrito la excelencia en todo. Así que cuando matéis, matad bien; y cuando degolléis, degollad bien. Que afile bien su cuchillo y alivie a su animal." (Sahih Muslim 1955)',
      'El sacrificio debe ser rápido y sin sufrimiento innecesario. El trato compasivo al animal antes del sacrificio también es obligatorio.',
    ],
  },
  {
    id: 33,
    category: 'vida',
    title: '¿Está prohibido el alcohol?',
    subtitle: 'El Islam y el vino',
    icon: CircleAlert,
    reference: 'Quran 5:90',
    content: [
      'Sí, el alcohol está completamente prohibido en el Islam.',
      'Allah dice: "Oh los que creéis, ciertamente el vino (Khamr), el juego de azar (Maysir), los ídolos y las flechas adivinatorias son una abominación del acto de Shaytan, así que evitadlos para que podáis tener éxito." (Quran 5:90)',
      'La prohibición es total: no solo está prohibido beberlo, sino también producirlo, venderlo, comprarlo, servírselo a otros o transportarlo.',
      'El Profeta ﷺ dijo: "Allah ha maldecido al vino, a quien lo bebe, a quien lo sirve, a quien lo vende, a quien lo compra, a quien lo prensa, a quien lo hace prensar, a quien lo transporta y a quien recibe su precio." (Sunan Abi Dawud 3674)',
      'Cualquier sustancia que intoxique la mente sigue la misma norma que el alcohol: está prohibida.',
    ],
  },
  {
    id: 34,
    category: 'vida',
    title: '¿Es obligatorio el Hijab?',
    subtitle: 'El velo de la mujer musulmana',
    icon: Shirt,
    reference: 'Quran 24:31 y Quran 33:59',
    content: [
      'Sí, el Hijab es obligatorio para la mujer musulmana que ha alcanzado la pubertad.',
      'Allah dice: "Y di a las creyentes que bajen su mirada y guarden su castidad y no muestren sus adornos excepto lo que aparezca de ellos, y que cubran su escote con el Khimar (velo)…" (Quran 24:31)',
      'También dice: "Oh Profeta, di a tus esposas, a tus hijas y a las mujeres de los creyentes que se cubran con sus mantos (Jilbab). Así será más fácil que sean reconocidas y no sean molestadas." (Quran 33:59)',
      'El Hijab no es solo el velo del cabello: implica cubrir todo el cuerpo (excepto cara y manos según la opinión mayoritaria) con ropa holgada, no transparente y no llamativa.',
      'El Hijab es un honor, una protección y una expresión de identidad musulmana, no una restricción.',
    ],
  },
  {
    id: 35,
    category: 'vida',
    title: '¿Puede un hombre casarse con cristiana o judía?',
    subtitle: 'Matrimonio con Ahl al-Kitab',
    icon: Heart,
    reference: 'Quran 5:5',
    content: [
      'Sí, está permitido para el hombre musulmán casarse con una mujer cristiana o judía (Ahl al-Kitab).',
      'Allah dice: "...y las mujeres virtuosas de los creyentes y las mujeres virtuosas de los que recibieron el Libro antes que vosotros, si les dais su dote, casándoos con ellas y no tomándolas como amantes ni en relaciones ilícitas." (Quran 5:5)',
      'Sin embargo, la mayoría de eruditos desaconseja este matrimonio si puede debilitar la práctica religiosa del esposo o la educación islámica de los hijos.',
      'La mujer musulmana no puede casarse con un hombre no musulmán. Esto está prohibido por consenso (Ijma) de los eruditos.',
    ],
  },
  {
    id: 36,
    category: 'vida',
    title: '¿Qué ocurre después de la muerte?',
    subtitle: 'El Barzakh y la vida en la tumba',
    icon: Star,
    reference: 'Quran 23:99-100 — Sahih al-Bukhari 1338',
    content: [
      'Tras la muerte, el alma entra en el Barzakh (una barrera o estado intermedio entre esta vida y el Día del Juicio).',
      'Allah dice: "Hasta que a uno de ellos le llega la muerte, dice: \'Señor, devuélveme…\' Detrás de ellos hay una barrera (Barzakh) hasta el Día en que sean resucitados." (Quran 23:99-100)',
      'En la tumba, el ángel interroga al fallecido sobre tres preguntas: ¿Quién es tu Señor? ¿Cuál es tu religión? ¿Quién es tu Profeta?',
      'Quien responda correctamente con fe, su tumba se expandirá y será iluminada. Quien no pueda responder, su tumba se comprimirá.',
      'Después del Barzakh viene la Resurrección (Qiyamah), el Juicio Final y finalmente el Paraíso (Jannah) o el Infierno (Jahannam).',
    ],
  },
  {
    id: 37,
    category: 'vida',
    title: '¿Qué es el Zakat?',
    subtitle: 'La limosna obligatoria del Islam',
    icon: Heart,
    reference: 'Quran 9:60 — Sahih al-Bukhari 1395 y Sahih Muslim 19',
    content: [
      'El Zakat es el tercer pilar del Islam: una limosna obligatoria del 2,5% de la riqueza acumulada que supere el Nisab (mínimo equivalente a 85 gramos de oro) durante un año lunar completo.',
      'Allah lo ordena junto a la oración numerosas veces en el Quran: "Y estableced la oración y dad el Zakat…"',
      '¿A quién se da el Zakat? Allah especifica ocho categorías en el Quran (9:60):',
      '1. Los pobres (Fuqara).',
      '2. Los necesitados (Masakin).',
      '3. Los encargados de recolectarlo.',
      '4. Los nuevos musulmanes que necesiten apoyo.',
      '5. Para liberar esclavos.',
      '6. Los endeudados que no pueden pagar.',
      '7. En el camino de Allah (Fi sabilillah).',
      '8. Los viajeros que se han quedado sin recursos.',
      'El Zakat purifica la riqueza y el alma del que la da.',
    ],
  },
  {
    id: 38,
    category: 'vida',
    title: '¿Quién debe hacer el Hajj?',
    subtitle: 'La peregrinación a La Meca',
    icon: Globe,
    reference: 'Quran 3:97 — Sahih al-Bukhari 26',
    content: [
      'El Hajj (peregrinación a La Meca) es el quinto pilar del Islam, obligatorio una vez en la vida para quien tenga capacidad.',
      'Allah dice: "Y es obligación de la gente hacia Allah hacer la peregrinación a la Casa (la Kaaba), para quien pueda emprender el camino hasta ella." (Quran 3:97)',
      'Condiciones para que sea obligatorio:',
      '1. Ser musulmán.',
      '2. Ser adulto y sano de mente.',
      '3. Tener capacidad física.',
      '4. Tener capacidad económica (coste del viaje más lo necesario para la familia que deja).',
      '5. Para la mujer: tener Mahram (padre, esposo, hermano u otro pariente masculino) que la acompañe.',
      'El Hajj se realiza en el mes de Dhul Hijjah y dura cinco días.',
      'El Profeta ﷺ dijo: "Quien haga el Hajj sin relaciones íntimas ni desobediencia, regresará como el día en que su madre lo parió." (Sahih al-Bukhari 1521)',
    ],
  },
  {
    id: 39,
    category: 'vida',
    title: '¿Puede un musulmán tener un perro en casa?',
    subtitle: 'Los perros en el Islam',
    icon: Dog,
    reference: 'Sahih al-Bukhari 2322 y Sahih Muslim 1574',
    content: [
      'El Profeta ﷺ dijo: "Quien tenga un perro, se le disminuirá un Qirat de sus buenas obras cada día, excepto el perro de caza, el perro de pastoreo o el perro guardián de la finca."',
      'Por tanto, está permitido tener perros para:',
      '1. La caza.',
      '2. El pastoreo del ganado.',
      '3. La guardia de la finca o propiedad.',
      'No está permitido tener perros simplemente como mascotas dentro de la casa.',
      'Recuerda que la saliva del perro es Najis (impura) y lo que lame requiere lavado especial: siete veces, la primera con tierra. (Sahih Muslim 279)',
    ],
  },
  {
    id: 40,
    category: 'vida',
    title: '¿Qué es el Islam? — Preguntas básicas',
    subtitle: 'HelpCircle frecuentes para nuevos musulmanes',
    icon: HelpCircle,
    reference: 'Sahih al-Bukhari 50 — Hadith de Jibril',
    content: [
      'El famoso Hadith de Jibril resume las bases del Islam en tres niveles:',
      '1. ISLAM (la práctica externa): Los Cinco Pilares — Shahada, Salah, Zakat, Sawm, Hajj.',
      '2. IMAN (la fe interna): Creer en Allah, Sus ángeles, Sus libros, Sus mensajeros, el Día del Juicio y el Qadar (el Destino, bueno y malo).',
      '3. IHSAN (la excelencia): "Que adores a Allah como si Le vieras, pues si tú no Le ves, Él sí te ve." (Sahih al-Bukhari 50)',
      'Estos tres niveles forman la base completa de la vida musulmana.',
      'El ángel Jibril enseñó estas respuestas al Profeta ﷺ delante de los Sahaba, y luego el Profeta ﷺ les dijo: "Este era Jibril, que vino a enseñaros vuestra religión."',
    ],
  },
]

// ── Colores por categoría ──────────────────────────────────────────────────

const CAT_STYLES = {
  fundamentos: { pill: 'bg-violet-100 text-violet-600', icon: 'from-violet-400 to-purple-500' },
  pureza:      { pill: 'bg-blue-100 text-blue-600',    icon: 'from-blue-400 to-cyan-500'    },
  oracion:     { pill: 'bg-amber-100 text-amber-700',  icon: 'from-amber-400 to-orange-500' },
  quran:       { pill: 'bg-emerald-100 text-emerald-700', icon: 'from-emerald-400 to-teal-500' },
  ayuno:       { pill: 'bg-indigo-100 text-indigo-700', icon: 'from-indigo-400 to-violet-500' },
  vida:        { pill: 'bg-rose-100 text-rose-600',    icon: 'from-rose-400 to-pink-500'    },
}

// ── Pantalla de detalle ────────────────────────────────────────────────────

function TopicDetail({ topic, onBack, darkMode, isFav, onToggleFav }) {
  const Icon = topic.icon
  const style = CAT_STYLES[topic.category] || CAT_STYLES.fundamentos

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-8"
    >
      {/* Header */}
      <div className={`flex items-center gap-3 pt-4 pb-3 sticky top-0 z-10 ${
        darkMode ? 'bg-[#121212]' : ''
      }`}
        style={!darkMode ? { background: 'linear-gradient(135deg, #FFF4E0 0%, #FFE8D6 100%)' } : undefined}
      >
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors active:scale-90 ${
            darkMode ? 'text-gray-300 active:bg-[#2a2a2a]' : 'text-gray-600 active:bg-white/60'
          }`}
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-1 ${style.pill}`}>
            {CATEGORIES.find(c => c.id === topic.category)?.label || topic.category}
          </div>
          <h2 className={`text-lg font-black leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {topic.title}
          </h2>
        </div>
        <button
          onClick={onToggleFav}
          className="p-2 rounded-xl active:scale-90 transition-transform flex-shrink-0"
          aria-label={isFav ? 'Quitar de guardados' : 'Guardar'}
        >
          <Star
            size={20}
            className={isFav ? 'text-amber-500' : darkMode ? 'text-gray-500' : 'text-gray-300'}
            fill={isFav ? '#F59E0B' : 'none'}
            strokeWidth={2.2}
          />
        </button>
      </div>

      {/* Icon + subtitle hero */}
      <div
        className="mx-0 rounded-3xl px-5 py-6 mb-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${style.icon.replace('from-', '').replace(' to-', ', ')})` }}
      >
        <div className={`bg-gradient-to-br ${style.icon} absolute inset-0 rounded-3xl`} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/15 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Icon size={26} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-white/80 text-xs font-semibold mb-0.5">{topic.subtitle}</p>
            <p className="text-white font-black text-base leading-tight">{topic.title}</p>
          </div>
        </div>
      </div>

      {/* Referencia */}
      <div className={`rounded-2xl px-4 py-3 mb-5 border ${
        darkMode
          ? 'bg-amber-950/30 border-amber-800/40'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
          Referencia
        </p>
        <p className={`text-xs font-medium leading-relaxed ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
          {topic.reference}
        </p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-3">
        {topic.content.map((line, i) => {
          const isStep = /^\d+\./.test(line)
          const isTitle = line.endsWith(':') && !isStep && line.length > 5 && line.length < 60

          if (isTitle) {
            return (
              <p key={i} className={`text-xs font-black uppercase tracking-widest mt-2 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                {line}
              </p>
            )
          }
          if (isStep) {
            return (
              <div key={i} className={`flex gap-3 rounded-xl px-3 py-2.5 ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-gradient-to-br ${style.icon}`}>
                  <span className="text-[9px] font-black text-white">{line.match(/^(\d+)/)?.[1]}</span>
                </div>
                <p className={`text-sm leading-relaxed flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {line.replace(/^\d+\.\s*/, '')}
                </p>
              </div>
            )
          }
          if (line.startsWith('-')) {
            return (
              <div key={i} className="flex gap-2.5 pl-1">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-gradient-to-br ${style.icon}`} />
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {line.replace(/^-\s*/, '')}
                </p>
              </div>
            )
          }
          return (
            <p key={i} className={`text-sm leading-relaxed ${
              i === 0
                ? darkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'
                : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {line}
            </p>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Tarjeta de lista ───────────────────────────────────────────────────────

function TopicCard({ topic, onOpen, darkMode, index, isFav, onToggleFav }) {
  const Icon = topic.icon
  const style = CAT_STYLES[topic.category] || CAT_STYLES.fundamentos

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(topic)}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl shadow-sm border text-left cursor-pointer transition-colors ${
        darkMode
          ? 'bg-[#1e1e1e]/70 backdrop-blur-md border-[#2a2a2a] active:bg-[#2a2a2a]'
          : 'bg-white/70 backdrop-blur-md border-white/60 active:bg-white/90'
      }`}
    >
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${style.icon} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon size={19} className="text-white" strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {topic.title}
        </p>
        <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {topic.subtitle}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(topic.id) }}
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
        aria-label={isFav ? 'Quitar de guardados' : 'Guardar'}
      >
        <Star
          size={17}
          className={isFav ? 'text-amber-500' : darkMode ? 'text-gray-600' : 'text-gray-300'}
          fill={isFav ? '#F59E0B' : 'none'}
          strokeWidth={2.2}
        />
      </button>
    </motion.div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────

export default function Aprender() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [selected, setSelected] = useState(null)
  const { darkMode, favoriteTopics, toggleFavoriteTopic } = useSettings()

  const filtered = topics.filter((t) => {
    const matchCat =
      activeCat === 'all' ? true :
      activeCat === 'saved' ? favoriteTopics.includes(t.id) :
      t.category === activeCat
    const q = search.toLowerCase()
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  // "Guardados" se inserta como primer filtro solo si hay favoritos
  const catFilters = favoriteTopics.length > 0
    ? [CATEGORIES[0], { id: 'saved', label: '★ Guardados' }, ...CATEGORIES.slice(1)]
    : CATEGORIES

  return (
    <div className="pt-0 pb-2">
      <AnimatePresence mode="wait">
        {selected ? (
          <TopicDetail
            key={`detail-${selected.id}`}
            topic={selected}
            onBack={() => setSelected(null)}
            darkMode={darkMode}
            isFav={favoriteTopics.includes(selected.id)}
            onToggleFav={() => toggleFavoriteTopic(selected.id)}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="pt-4"
          >
            {/* Título */}
            <div className="mb-5 px-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Conocimiento
              </p>
              <h1 className={`text-2xl font-black mt-0.5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Aprender
              </h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {topics.length} temas con referencias del Quran y Hadith
              </p>
            </div>

            {/* Buscador */}
            <div className="relative mb-4">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar temas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-sm outline-none transition-all shadow-sm ${
                  darkMode
                    ? 'bg-[#1e1e1e] border-[#2a2a2a] text-white placeholder-gray-500 focus:border-amber-500'
                    : 'bg-white/70 backdrop-blur-md border-white/60 text-gray-700 placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40'
                }`}
              />
            </div>

            {/* Filtros de categoría */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 mb-5">
              {catFilters.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCat === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : darkMode
                        ? 'bg-[#1e1e1e] text-gray-400 border border-[#2a2a2a]'
                        : 'bg-white/70 text-gray-500 border border-white/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Lista */}
            <div className="flex flex-col gap-2.5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <Search size={22} className="text-amber-400" />
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No se encontraron temas
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    Prueba con otras palabras
                  </p>
                </div>
              ) : (
                filtered.map((t, i) => (
                  <TopicCard
                    key={t.id}
                    topic={t}
                    onOpen={setSelected}
                    darkMode={darkMode}
                    index={i}
                    isFav={favoriteTopics.includes(t.id)}
                    onToggleFav={toggleFavoriteTopic}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
