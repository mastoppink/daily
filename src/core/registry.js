/**
 * Menemukan semua modul secara otomatis: setiap folder `src/modules/<nama>/index.jsx`
 * yang meng-export default manifest modul akan terdaftar. Tidak perlu edit file lain.
 */
const modules = import.meta.glob('../modules/*/index.jsx', { eager: true });

export const MODULES = Object.entries(modules)
  .map(([path, mod]) => {
    if (!mod.default?.id) {
      throw new Error(`Modul di ${path} harus meng-export default objek dengan "id".`);
    }
    return mod.default;
  })
  .sort((a, b) => a.order - b.order);
