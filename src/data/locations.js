export const LOCATIONS = [
  // ESPAÑA
  { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { name: 'Barcelona', lat: 41.3874, lon: 2.1686 },
  { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
  { name: 'Sevilla', lat: 37.3886, lon: -5.9823 },
  { name: 'Bilbao', lat: 43.2627, lon: -2.9253 },
  { name: 'Málaga', lat: 36.7201, lon: -4.4203 },
  { name: 'Alicante', lat: 38.3452, lon: -0.4810 },
  { name: 'Córdoba', lat: 37.8882, lon: -4.7794 },
  { name: 'Murcia', lat: 37.9922, lon: -1.1307 },
  { name: 'Palma de Mallorca', lat: 39.5696, lon: 2.6502 },
  { name: 'Granada', lat: 37.1769, lon: -3.5979 },
  { name: 'Toledo', lat: 39.8562, lon: -4.0273 },
  { name: 'Salamanca', lat: 40.9701, lon: -5.6635 },
  { name: 'Zaragoza', lat: 41.6488, lon: -0.8891 },
  { name: 'Las Palmas', lat: 28.1235, lon: -15.4363 },
  { name: 'Santa Cruz de Tenerife', lat: 28.4636, lon: -16.2518 },
  { name: 'Oviedo', lat: 43.3614, lon: -5.8402 },
  { name: 'Pamplona', lat: 42.8125, lon: -1.6458 },

  // MÉXICO
  { name: 'Ciudad de México', lat: 19.4326, lon: -99.1332 },
  { name: 'Guadalajara', lat: 20.6595, lon: -103.3494 },
  { name: 'Monterrey', lat: 25.6866, lon: -100.3161 },
  { name: 'Puebla', lat: 19.0413, lon: -98.2062 },
  { name: 'Tijuana', lat: 32.5149, lon: -117.0382 },
  { name: 'Cancún', lat: 21.1619, lon: -86.8515 },

  // COLOMBIA
  { name: 'Bogotá', lat: 4.7110, lon: -74.0721 },
  { name: 'Medellín', lat: 6.2442, lon: -75.5812 },
  { name: 'Cali', lat: 3.4372, lon: -76.5197 },
  { name: 'Barranquilla', lat: 10.9639, lon: -74.7964 },
  { name: 'Cartagena', lat: 10.3910, lon: -75.4794 },

  // ARGENTINA
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { name: 'Córdoba (Argentina)', lat: -31.4135, lon: -64.1889 },
  { name: 'Rosario', lat: -32.9468, lon: -60.6393 },
  { name: 'Mendoza', lat: -32.8895, lon: -68.8458 },
  { name: 'La Plata', lat: -34.9215, lon: -57.9545 },

  // PERÚ
  { name: 'Lima', lat: -12.0464, lon: -77.0428 },
  { name: 'Arequipa', lat: -16.4090, lon: -71.5375 },
  { name: 'Cusco', lat: -13.5319, lon: -71.9675 },
  { name: 'Trujillo', lat: -8.1116, lon: -79.0288 },

  // VENEZUELA
  { name: 'Caracas', lat: 10.4806, lon: -66.9036 },
  { name: 'Maracaibo', lat: 10.6427, lon: -71.6125 },
  { name: 'Valencia (Venezuela)', lat: 10.1620, lon: -68.0077 },

  // CHILE
  { name: 'Santiago de Chile', lat: -33.4489, lon: -70.6693 },
  { name: 'Valparaíso', lat: -33.0472, lon: -71.6127 },
  { name: 'Concepción', lat: -36.8201, lon: -73.0445 },

  // ECUADOR
  { name: 'Quito', lat: -0.1807, lon: -78.4678 },
  { name: 'Guayaquil', lat: -2.1709, lon: -79.9224 },

  // BOLIVIA
  { name: 'La Paz', lat: -16.4897, lon: -68.1193 },
  { name: 'Santa Cruz de la Sierra', lat: -17.7833, lon: -63.1822 },
  { name: 'Cochabamba', lat: -17.3895, lon: -66.1568 },

  // GUATEMALA
  { name: 'Ciudad de Guatemala', lat: 14.6349, lon: -90.5069 },

  // CUBA
  { name: 'La Habana', lat: 23.1136, lon: -82.3666 },
  { name: 'Santiago de Cuba', lat: 20.0247, lon: -75.8219 },

  // HONDURAS
  { name: 'Tegucigalpa', lat: 14.0723, lon: -87.1921 },
  { name: 'San Pedro Sula', lat: 15.5042, lon: -88.0250 },

  // PARAGUAY
  { name: 'Asunción', lat: -25.2637, lon: -57.5759 },

  // EL SALVADOR
  { name: 'San Salvador', lat: 13.6929, lon: -89.2182 },

  // NICARAGUA
  { name: 'Managua', lat: 12.1150, lon: -86.2362 },

  // COSTA RICA
  { name: 'San José (Costa Rica)', lat: 9.9281, lon: -84.0907 },

  // PANAMÁ
  { name: 'Ciudad de Panamá', lat: 8.9824, lon: -79.5199 },

  // PUERTO RICO
  { name: 'San Juan (Puerto Rico)', lat: 18.4655, lon: -66.1057 },

  // REPÚBLICA DOMINICANA
  { name: 'Santo Domingo', lat: 18.4861, lon: -69.9312 },

  // URUGUAY
  { name: 'Montevideo', lat: -34.9011, lon: -56.1645 },

  // GUINEA ECUATORIAL
  { name: 'Malabo', lat: 3.7523, lon: 8.7741 },
]

export const getLocationByName = (name) => {
  return LOCATIONS.find(loc => loc.name === name)
}

export const getLocationByCoords = (lat, lon) => {
  return LOCATIONS.find(loc => loc.lat === lat && loc.lon === lon)
}
