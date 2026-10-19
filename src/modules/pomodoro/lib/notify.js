/** Minta izin notifikasi. Di iOS hanya berfungsi jika app sudah di-install ke layar utama. */
export const requestNotifications = () =>
  'Notification' in window ? Notification.requestPermission() : Promise.resolve('unsupported');

/**
 * Tampilkan notifikasi lewat Service Worker (berfungsi di Android & desktop PWA),
 * dengan fallback ke Notification biasa.
 */
export async function notify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const options = { body, icon: '/pwa-192x192.png', badge: '/pwa-192x192.png', tag: 'focuspomodoro' };
  const registration = await navigator.serviceWorker?.getRegistration();

  if (registration) {
    registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
}
