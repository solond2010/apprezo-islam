import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Waves, Shield, CircleAlert, ChevronRight, Star, BookMarked, MessageSquare, BookOpen, Heart, Shirt, Repeat2 } from 'lucide-react'

const topics = [
  {
    id: 1,
    title: 'La Ablución (Wudu)',
    subtitle: 'Purificación antes del rezo',
    icon: Waves,
    content: [
      'El Wudu es la purificación que todo musulmán debe realizar antes de cada rezo. Allah dice en el Corán: "¡Oh, creyentes! Cuando os dispongáis a rezar, lavaos el rostro y los brazos hasta los codos, pasaos las manos húmedas por la cabeza y lavaos los pies hasta los tobillos" (5:6).',
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
    id: 2,
    title: 'Condiciones para el Rezo',
    subtitle: 'Requisitos antes de comenzar a rezar',
    icon: Shield,
    content: [
      'Antes de comenzar cualquier rezo (Salat), deben cumplirse estas condiciones esenciales:',
      '1. ESTAR EN ESTADO DE PUREZA: Haber realizado el Wudu (o Ghusl si es necesario). Sin purificación, el rezo no es válido.',
      '2. DIRECCIÓN CORRECTA (QIBLA): Debes rezar orientado hacia la Kaaba en La Meca. Puedes usar una brújula o aplicaciones móviles para encontrarla.',
      '3. CUBRIR EL CUERPO (AWRAH): Para los hombres, cubrir desde el ombligo hasta las rodillas. Para las mujeres, cubrir todo el cuerpo excepto el rostro y las manos. La ropa debe ser limpia y holgada.',
      '4. LUGAR Y ROPA LIMPIOS: El lugar donde rezas debe estar limpio, así como tu ropa. Si tienes dudas, puedes rezar sobre un tapiz o superficie limpia.',
      '5. TIEMPO CORRECTO: Cada rezo tiene un tiempo específico. No es válido rezar antes ni después del tiempo establecido para cada oración.',
      '6. INTENCIÓN (NIYAH): Debes tener la intención en tu corazón de qué rezo vas a realizar. No hace falta decirla en voz alta.',
      'Recuerda: Si falta alguna de estas condiciones, el rezo no es aceptado. Tómate tu tiempo para verificarlas antes de empezar.',
    ],
  },
  {
    id: 3,
    title: 'Errores al Rezar',
    subtitle: 'Cómo corregir equivocaciones en el Salat',
    icon: CircleAlert,
    content: [
      'Es normal equivocarse, especialmente cuando estás aprendiendo. El Islam es una religión de facilidad. Aquí te explicamos qué hacer:',
      'ERRORES LEVES (OLVIDOS):',
      '- Si olvidas decir "Subhana Rabbiyal Adhim" en el Ruku o "Subhana Rabbiyal A\'la" en el Sujud, no pasa nada. Continúa con normalidad.',
      '- Si olvidas una parte obligatoria (como Al-Fatiha), debes repetir esa Rak\'ah completa.',
      'ERRORES EN LA RECITACIÓN:',
      '- Si te equivocas al recitar Al-Fatiha, corrige el error y continúa desde donde lo dejaste.',
      '- Si no recuerdas cómo sigue un verso, puedes saltarlo y continuar con el siguiente.',
      '- Si repites un verso sin querer, no hay problema, sigue adelante.',
      'SUYUD AS-SA HW (PROSTERNACIÓN POR OLVIDO):',
      '- Si olvidas algo importante (como el primer Tashahhud), debes hacer dos Sujud adicionales al final del rezo (antes del Taslim).',
      '- Cómo hacerlo: después del Tashahhud final, di Salam solo a la derecha, luego haz dos Sujud adicionales repitiendo "Subhana Rabbiyal A\'la" en cada uno, luego completa el Taslim.',
      'CONSEJO IMPORTANTE:',
      'Cuando tengas dudas, elige la opción más segura. Si no estás seguro de cuántas Rak\'ahs has rezado, asume la menor cantidad y completa. ¡No te angusties! Allah ve tu esfuerzo y te recompensará por ello.',
    ],
  },
  {
    id: 4,
    title: '¿Qué es "Fard"?',
    subtitle: 'Lo obligatorio en el Islam',
    icon: Star,
    content: [
      'Fard (o Farz) significa obligatorio. Son los mandamientos directos e innegociables dictados por Allah.',
      'La regla: Si lo haces, recibes recompensa divina. Si lo omites intencionadamente, cometes un pecado grave.',
      'Ejemplos: Realizar los 5 rezos diarios, ayunar en el mes de Ramadán o pagar la caridad obligatoria (Zakat).',
    ],
  },
  {
    id: 5,
    title: '¿Qué es "Sunnah"?',
    subtitle: 'Las enseñanzas del Profeta',
    icon: BookMarked,
    content: [
      'Sunnah engloba las enseñanzas, acciones, hábitos y aprobaciones del Profeta Muhammad. En términos de práctica diaria, se refiere a lo recomendado.',
      'La regla: Si lo haces, ganas una inmensa recompensa adicional y sigues el ejemplo del Profeta. Si no lo haces, no cometes pecado, pero te pierdes esa bendición.',
      'Ejemplos: Rezar oraciones voluntarias, sonreír a los demás, o romper el ayuno con dátiles.',
    ],
  },
  {
    id: 6,
    title: '¿Qué es un "Hadith"?',
    subtitle: 'Las narraciones del Profeta Muhammad',
    icon: MessageSquare,
    content: [
      'Un Hadith (Hadiz) es un relato o narración registrada que documenta exactamente lo que el Profeta Muhammad dijo, hizo o aprobó en vida.',
      'Importancia: Es la segunda fuente de conocimiento del Islam después del Corán. El Corán nos da la orden general (ejemplo: "estableced la oración"), y el Hadith nos explica el detalle práctico ("rezad de la forma en que me habéis visto rezar").',
      'Grados: Los eruditos los investigaron exhaustivamente. Un Hadith catalogado como Sahih significa que es auténtico y 100% fiable.',
    ],
  },
  {
    id: 7,
    title: '¿Qué es una "Surah" y una "Ayah"?',
    subtitle: 'Los capítulos y versículos del Corán',
    icon: BookOpen,
    content: [
      'Surah: Es un capítulo del Sagrado Corán. El libro está dividido en 114 Surahs de diferentes longitudes (la más corta tiene 3 frases, la más larga casi 300).',
      'Ayah: Es un versículo o frase dentro de una Surah. Su traducción literal es "señal" o "milagro".',
      'Ejemplo: La primera Surah del Corán se llama Al-Fatiha (La Apertura) y contiene 7 Ayahs. Es obligatorio recitarla en cada unidad de rezo.',
    ],
  },
  {
    id: 8,
    title: '¿Qué es la "Niyyah"?',
    subtitle: 'La intención en el corazón',
    icon: Heart,
    content: [
      'Niyyah significa intención. Es el motor interno de todo acto en el Islam, ya que "las acciones valen según sus intenciones".',
      'Cómo se hace: Es un acto exclusivo del corazón y la mente. Pronunciarla en voz alta es un error común que no pertenece a la práctica auténtica. Solo necesitas tener claro en tu mente qué vas a hacer y que lo haces por Allah.',
      'Su función: Diferencia un acto cotidiano de un acto de adoración. (Por ejemplo, ducharse para refrescarse por el calor vs. ducharse con la intención de realizar la purificación ritual).',
    ],
  },
  {
    id: 9,
    title: 'La Vestimenta (Awrah)',
    subtitle: 'Las partes del cuerpo que deben cubrirse',
    icon: Shirt,
    content: [
      'La Awrah define las partes del cuerpo que deben estar cubiertas de forma obligatoria para presentarse ante Dios en oración (y en público).',
      'El Hombre: Debe cubrir obligatoriamente desde el ombligo hasta la rodilla (ambos inclusive). Por respeto, es altamente necesario cubrir también los hombros durante el rezo (evitar rezar sin camiseta).',
      'La Mujer: Debe cubrir todo su cuerpo, incluyendo el cabello, el cuello y los pies, dejando al descubierto únicamente el rostro y las manos.',
      'Requisito universal: Para ambos, la ropa de rezo debe estar limpia de impurezas, no debe ser transparente ni excesivamente ceñida al cuerpo.',
    ],
  },
  {
    id: 10,
    title: "¿Qué es una \"Rak'ah\"?",
    subtitle: 'Una unidad completa del rezo',
    icon: Repeat2,
    content: [
      "Una Rak'ah es una unidad o ciclo de movimientos que compone la oración islámica.",
      "Cada rezo tiene un número específico de Rak'ahs (Fajr tiene 2, Maghrib tiene 3, etc.).",
      "El ciclo exacto: Una Rak'ah siempre consiste en: ponerse de pie y recitar el Corán, inclinarse apoyando las manos en las rodillas (Ruku), volver a levantarse, postrarse en el suelo apoyando la frente (Sujud), sentarse brevemente y hacer una segunda postración. Al levantarse de esa segunda postración, se ha completado una Rak'ah.",
    ],
  },
]

const TOPIC_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-500' },
  { bg: 'bg-emerald-50', text: 'text-emerald-500' },
  { bg: 'bg-rose-50', text: 'text-rose-500' },
  { bg: 'bg-violet-50', text: 'text-violet-500' },
]

function TopicCard({ topic, onOpen, colorIdx = 0 }) {
  const Icon = topic.icon
  const colors = TOPIC_COLORS[colorIdx % TOPIC_COLORS.length]
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(topic)}
      className="w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 p-4 text-left active:bg-white/90 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon size={20} className={colors.text} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-gray-800">{topic.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{topic.subtitle}</p>
        </div>
        <ChevronRight size={18} className="text-gray-300 mt-2" />
      </div>
    </motion.button>
  )
}

function Modal({ topic, onClose }) {
  if (!topic) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <topic.icon size={18} className="text-amber-600" strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-bold text-gray-800 truncate">{topic.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          {topic.content.map((line, i) => {
            const isFirst = i === 0
            const isStep = line.match(/^\d+\./)
            const isTitle = line.endsWith(':') && !isStep && line.length > 5

            if (isStep) {
              return (
                <p key={i} className="text-sm text-slate-700 leading-relaxed mb-2 pl-2">{line}</p>
              )
            }
            if (isTitle) {
              return (
                <p key={i} className="text-sm font-semibold text-slate-800 mt-4 mb-2">{line}</p>
              )
            }
            return (
              <p key={i} className={`text-sm leading-relaxed mb-3 ${isFirst ? 'text-slate-600' : 'text-slate-600'}`}>
                {line}
              </p>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Aprender() {
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)

  const filtered = topics.filter((t) => {
    const q = search.toLowerCase()
    return t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pt-4 pb-2"
    >
      <div className="mb-5 px-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Conocimiento
        </p>
        <h1 className="text-2xl font-black text-gray-800 mt-0.5">Aprender</h1>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar temas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40 transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No se encontraron temas para "{search}"
          </p>
        ) : (
          filtered.map((t, i) => (
            <TopicCard key={t.id} topic={t} onOpen={setSelectedTopic} colorIdx={i} />
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedTopic && (
          <Modal topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
