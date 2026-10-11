const radius = 92;
const sweep = 270;
const start = 135;
const circumference = 2 * Math.PI * radius;
const full = circumference * (sweep / 360);

function point(hour: number): { x: number; y: number } {
  const angle = ((start + (hour / 4) * sweep) * Math.PI) / 180;
  return { x: 120 + radius * Math.cos(angle), y: 120 + radius * Math.sin(angle) };
}

export function Dial({ hours, onChange }: { hours: number; onChange: (hours: number) => void }) {
  const dash = full * (hours / 4);
  return (
    <div className="dial">
      <svg viewBox="0 0 240 240" className="dial-svg" aria-hidden="true">
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="var(--lc-line)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${full} ${circumference}`}
          transform="rotate(135 120 120)"
        />
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="var(--lc-seaglass-deep)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(135 120 120)"
        />
        {[1, 2, 3, 4].map((hour) => {
          const spot = point(hour);
          const selected = hour === hours;
          return (
            <circle
              key={hour}
              cx={spot.x}
              cy={spot.y}
              r={selected ? 8 : 5}
              fill={selected ? "var(--lc-ink)" : "var(--lc-card)"}
              stroke="var(--lc-ink)"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="dial-readout">
        <p className="hero-figure">{hours}</p>
        <p className="text-lg font-bold">hours</p>
        <p className="text-lg font-bold">This chair</p>
      </div>
      <input
        className="dial-input"
        type="range"
        min={1}
        max={4}
        step={1}
        value={hours}
        aria-valuetext={`${hours} hours. This chair.`}
        aria-label="Hours in the chair"
        onChange={(event) => {
          onChange(Number(event.target.value));
        }}
      />
    </div>
  );
}
