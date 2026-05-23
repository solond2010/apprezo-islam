export default function QiblaCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#FFFBF2] rounded-2xl border border-[#EDE3D3] shadow-sm mb-5 flex items-center gap-3 px-5 py-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">
        🧭
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Brújula Qibla</span>
          <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold tracking-wide">
            NUEVO
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Dirección hacia La Meca</p>
      </div>
      <span className="text-gray-300 text-lg">›</span>
    </div>
  )
}
