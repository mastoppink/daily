const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TONES = {
  rose: 'text-rose-500',
  emerald: 'text-emerald-500',
};

/** Cincin progres. `progress` = 0..1 (porsi waktu yang sudah berlalu). */
export default function TimerRing({ progress, time, tone = 'rose' }) {
  return (
    <div className="relative h-72 w-72">
      <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
        <circle cx="130" cy="130" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <circle
          cx="130"
          cy="130"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className={`${TONES[tone]} transition-[stroke-dashoffset] duration-300 ease-linear`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold tabular-nums text-slate-900">
        {time}
      </div>
    </div>
  );
}
