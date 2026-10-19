# Menambah modul baru

Setiap modul adalah satu folder di `src/modules/`. Modul ditemukan **otomatis** — tidak perlu mengubah `App.jsx`, `registry.js`, atau navigasi.

## Langkah

1. Buat folder `src/modules/<nama>/` dengan struktur bebas, misalnya:

   ```
   src/modules/habit/
   ├── index.jsx        # manifest (wajib)
   ├── db.js            # database Dexie milik modul (opsional)
   ├── pages/
   ├── components/
   └── lib/
   ```

2. Tulis `index.jsx` yang meng-export default manifest:

   ```jsx
   import HabitPage from './pages/HabitPage';
   import StatsPage from './pages/StatsPage';

   export default {
     id: 'habit',                    // unik; dipakai di URL: /m/habit
     order: 4,                       // urutan di beranda
     name: 'Habit Tracker',
     description: 'Lacak kebiasaan harian.',
     icon: '✅',
     accent: 'text-emerald-600',     // kelas Tailwind untuk warna aktif (tulis literal)
     maxWidth: 'max-w-xl',           // opsional
     Provider: null,                 // opsional: context global, mis. TimerProvider
     routes: [
       { index: true, label: 'Hari Ini', icon: '📅', Component: HabitPage },
       { path: 'statistik', label: 'Statistik', icon: '📊', Component: StatsPage },
     ],
   };
   ```

3. Jalankan `npm run dev`. Modul langsung muncul di beranda dan di `/m/habit`.

## Aturan

- **Database per modul.** Setiap modul membuat `new Dexie('nama-unik')` sendiri. Dengan begitu menambah modul tidak memicu migrasi skema modul lain. Setelah skema berubah, naikkan `db.version(n)`.
- **Modul tidak saling impor.** Kalau dua modul butuh kode yang sama, pindahkan ke `src/shared/` (belum dibuat; buat saat dibutuhkan).
- **Kelas warna harus literal** (`'text-emerald-600'`), bukan dirangkai dari variabel, agar Tailwind tetap mengenalinya.
- **`Provider`** hanya untuk state yang harus hidup walau pengguna berpindah modul (seperti timer). Hindari untuk data biasa.
- Pindah antar halaman modul memakai URL absolut, mis. `navigate('/m/habit/statistik')`.
