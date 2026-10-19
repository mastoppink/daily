let audioCtx;

/** Bunyi "ding-ding-ding" sederhana tanpa file audio eksternal. */
export function playChime() {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;

    [880, 1100, 1320].forEach((freq, i) => {
      const start = now + i * 0.25;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

      osc.start(start);
      osc.stop(start + 0.45);
    });
  } catch {
    // Browser tanpa Web Audio: abaikan, notifikasi tetap tampil.
  }
}
