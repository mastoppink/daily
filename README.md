# Focus Suite

Kumpulan alat produktivitas fokus dalam **satu** PWA offline-first. Semua data tersimpan di IndexedDB (Dexie.js) di perangkat pengguna; tidak ada backend.

## Modul saat ini

| Modul | URL | Fitur |
|---|---|---|
| 🙋 FocusGuard | `/m/guard` | Catat gangguan dengan kategori cepat, riwayat, statistik 7 hari |
| 🍅 FocusPomodoro | `/m/pomodoro` | Timer fokus/istirahat, tugas, sesi per tugas, notifikasi |
| 🟪 FocusMatrix | `/m/matrix` | Matriks Eisenhower dengan drag & drop, filter, ringkasan |

Menambah modul baru: lihat [src/modules/README.md](src/modules/README.md).

## Struktur

```
focus-suite/
├── src/
│   ├── App.jsx              # rute utama + Provider global
│   ├── core/                # shell: beranda, kerangka modul, registry
│   └── modules/
│       ├── guard/           # FocusGuard
│       ├── pomodoro/        # FocusPomodoro
│       └── matrix/          # FocusMatrix
├── public/                  # ikon & favicon
└── vite.config.js           # vite-plugin-pwa + manifest
```

## Menjalankan

```bash
npm install
npm run dev        # development
npm run build      # build produksi ke dist/
npm run preview    # uji build produksi — wajib untuk menguji PWA & offline
```

## Instal sebagai PWA

- **Android (Chrome):** ⋮ → *Install app*.
- **iPhone (Safari):** Share → *Add to Home Screen*. Notifikasi di iOS hanya untuk app yang sudah di-install.
- **Desktop (Chrome/Edge):** ikon instal di address bar.

Satu instalasi berarti semua modul ikut ter-install.
