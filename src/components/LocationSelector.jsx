import { motion, AnimatePresence } from 'framer-motion'
import { LOCATIONS } from '../data/locations'
import { useState } from 'react'
import { X, Check, Search } from 'lucide-react'

export default function LocationSelector({ isOpen, onClose, currentLocation, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (location) => {
    onSelect(location)
    setSearchQuery('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col pointer-events-auto border border-white/60">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Seleccionar Ubicación</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar ciudad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Location List */}
              <div className="flex-1 overflow-y-auto">
                {filteredLocations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredLocations.map((location) => {
                      const isSelected = currentLocation.lat === location.lat && currentLocation.lon === location.lon
                      return (
                        <button
                          key={`${location.lat}-${location.lon}`}
                          onClick={() => handleSelect(location)}
                          className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between hover:bg-amber-50 ${
                            isSelected ? 'bg-amber-50' : ''
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? 'text-amber-700' : 'text-gray-800'}`}>
                            {location.name}
                          </span>
                          {isSelected && <Check size={18} className="text-amber-600" strokeWidth={2.5} />}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <p className="text-sm">No se encontraron ciudades</p>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 rounded-b-3xl">
                <p>Se mostrarán los horarios de rezo para la ubicación seleccionada</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
