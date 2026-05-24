export const LOCATIONS = [
  // Spain
  { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { name: 'Barcelona', lat: 41.3874, lon: 2.1686 },
  { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
  { name: 'Sevilla', lat: 37.3886, lon: -5.9823 },
  { name: 'Bilbao', lat: 43.2627, lon: -2.9253 },
  { name: 'Málaga', lat: 36.7201, lon: -4.4203 },
  { name: 'Alicante', lat: 38.3452, lon: -0.4810 },
  { name: 'Córdoba', lat: 37.8882, lon: -4.7794 },
  { name: 'Murcia', lat: 37.9922, lon: -1.1307 },
  { name: 'Palma', lat: 39.5696, lon: 2.6502 },
  { name: 'Granada', lat: 37.1769, lon: -3.5979 },
  { name: 'Toledo', lat: 39.8562, lon: -4.0273 },
  { name: 'Salamanca', lat: 40.9701, lon: -5.6635 },
  { name: 'Santiago de Compostela', lat: 42.8805, lon: -8.5456 },
  { name: 'Oviedo', lat: 43.3614, lon: -5.8402 },
  { name: 'Pamplona', lat: 42.8125, lon: -1.6458 },

  // International
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Brussels', lat: 50.8503, lon: 4.3517 },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Rome', lat: 41.9028, lon: 12.4964 },
  { name: 'Athens', lat: 37.9838, lon: 23.7275 },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Riyadh', lat: 24.7136, lon: 46.6753 },
  { name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
  { name: 'Marrakech', lat: 31.6295, lon: -8.0088 },
]

export const getLocationByName = (name) => {
  return LOCATIONS.find(loc => loc.name === name)
}

export const getLocationByCoords = (lat, lon) => {
  return LOCATIONS.find(loc => loc.lat === lat && loc.lon === lon)
}
