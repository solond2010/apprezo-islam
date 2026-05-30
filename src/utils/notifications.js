// Utilidades para notificaciones de horarios de rezo.
//
// Limitaciones honestas:
// - En navegadores de escritorio y Android (Chrome/Edge) se usa la API de
//   "Notification Triggers" (TimestampTrigger) cuando está disponible, que
//   permite avisos programados aunque la pestaña no esté activa.
// - Como respaldo universal se usan setTimeout mientras la app está abierta.
// - En iPhone (Safari/PWA) los avisos en segundo plano son limitados; funcionan
//   mejor con la app añadida a la pantalla de inicio y abierta recientemente.

const PRAYER_LABELS = {
  Fajr: 'Fajr — El alba',
  Dhuhr: 'Dhuhr — El mediodía',
  Asr: 'Asr — La tarde',
  Maghrib: 'Maghrib — El ocaso',
  Isha: 'Isha — La noche',
}

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

// Timeouts en memoria para poder cancelarlos
let scheduledTimeouts = []

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getPermission() {
  if (!notificationsSupported()) return 'unsupported'
  return Notification.permission // 'granted' | 'denied' | 'default'
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported'
  try {
    const result = await Notification.requestPermission()
    return result
  } catch {
    return 'denied'
  }
}

function clearScheduled() {
  scheduledTimeouts.forEach((id) => clearTimeout(id))
  scheduledTimeouts = []
}

async function getSWRegistration() {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.ready
  } catch {
    return null
  }
}

// Lanza una notificación ahora (vía service worker si existe, si no directa).
async function fireNotification(title, body) {
  const reg = await getSWRegistration()
  const options = {
    body,
    icon: '/fotos/logo1.png',
    badge: '/fotos/logo1.png',
    tag: 'mihrab-prayer',
    renotify: true,
  }
  if (reg && reg.showNotification) {
    reg.showNotification(title, options)
  } else if (getPermission() === 'granted') {
    new Notification(title, options)
  }
}

// Programa las notificaciones de los rezos restantes del día.
// timings: { Fajr:'HH:MM', Dhuhr:'HH:MM', ... }
export async function schedulePrayerNotifications(timings) {
  if (!timings || getPermission() !== 'granted') return
  clearScheduled()

  const now = new Date()
  const reg = await getSWRegistration()
  const canTrigger = reg && 'showTrigger' in Notification.prototype && typeof window.TimestampTrigger !== 'undefined'

  for (const name of PRAYER_ORDER) {
    const time = timings[name]
    if (!time) continue
    const [h, m] = time.split(':').map(Number)
    const target = new Date(now)
    target.setHours(h, m, 0, 0)
    if (target <= now) continue // ya pasó hoy

    const title = '🕌 Es hora del rezo'
    const body = `${PRAYER_LABELS[name] || name} · ${time}`

    if (canTrigger) {
      // Aviso programado real (persiste aunque se cierre la pestaña)
      try {
        reg.showNotification(title, {
          body,
          icon: '/fotos/logo1.png',
          badge: '/fotos/logo1.png',
          tag: `mihrab-${name}`,
          showTrigger: new window.TimestampTrigger(target.getTime()),
        })
        continue
      } catch {
        // si falla, caer al setTimeout
      }
    }

    // Respaldo: setTimeout (solo mientras la app sigue abierta)
    const delay = target.getTime() - now.getTime()
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      const id = setTimeout(() => fireNotification(title, body), delay)
      scheduledTimeouts.push(id)
    }
  }
}

export function cancelPrayerNotifications() {
  clearScheduled()
}

// Notificación de prueba inmediata (para el botón "Probar" en Ajustes).
export async function sendTestNotification() {
  await fireNotification('🕌 Mihrab', 'Las notificaciones de rezo están activadas correctamente.')
}
