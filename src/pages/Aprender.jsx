import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Droplets, ShieldCheck, AlertTriangle } from 'lucide-react'

const topics = [
  {
    id: 1,
    title: 'La Ablución (Wudu)',
    subtitle: 'Purificación antes del rezo',
    icon: Droplets,
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
    icon: ShieldCheck,
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
    icon: AlertTriangle,
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
]

function TopicCard({ topic, onOpen }) {
  const Icon = topic.icon
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(topic)}
      className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-left active:bg-slate-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={20} className="text-emerald-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-800">{topic.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{topic.subtitle}</p>
        </div>
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
        className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <topic.icon size={18} className="text-emerald-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 truncate">{topic.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 active:bg-slate-200 transition-colors"
          >
            <X size={16} className="text-slate-500" />
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
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Aprender</h2>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar temas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            No se encontraron temas para "{search}"
          </p>
        ) : (
          filtered.map((t) => (
            <TopicCard key={t.id} topic={t} onOpen={setSelectedTopic} />
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
