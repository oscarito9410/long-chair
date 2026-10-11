import { durationChoices } from "@long-chair/core";
import { cn } from "../../lib/cn.ts";
import { glassClass } from "../glass/glass-styles.ts";

const radius = 92;
const sweep = 270;
const start = 135;
const circumference = 2 * Math.PI * radius;
const full = circumference * (sweep / 360);
const minMinutes = 60;
const maxMinutes = 240;

const lengths = durationChoices.map((choice) => ({
  minutes: choice.minutes,
  label: `${choice.minutes / 60}h`,
}));

function point(hour: number): { x: number; y: number } {
  const angle = ((start + (hour / 4) * sweep) * Math.PI) / 180;
  return { x: 120 + radius * Math.cos(angle), y: 120 + radius * Math.sin(angle) };
}

function hourFigure(minutes: number): string {
  const hours = minutes / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

export function Dial({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (minutes: number) => void;
}) {
  const value = Math.min(maxMinutes, Math.max(minMinutes, minutes));
  const dash = full * (value / maxMinutes);
  const figure = hourFigure(value);
  const valueText = `${figure} hours. This chair.`;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="dial">
        <div
          className={glassClass({ thickness: "thin", shape: "disc", className: "dial-ring" })}
          aria-hidden="true"
        />
        <svg viewBox="0 0 240 240" className="dial-svg" aria-hidden="true">
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--lc-card) 55%, transparent)"
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
            const selected = hour * 60 === value;
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
        <div
          className={glassClass({
            thickness: "regular",
            shape: "disc",
            className: "dial-readout",
          })}
        >
          <p className="hero-figure">{figure}</p>
          <p className="text-lg font-bold">hours</p>
          <p className="text-lg font-bold">This chair</p>
        </div>
        <input
          className="dial-input"
          type="range"
          min={minMinutes}
          max={maxMinutes}
          step={30}
          value={value}
          role="slider"
          aria-valuemin={minMinutes}
          aria-valuemax={maxMinutes}
          aria-valuenow={value}
          aria-valuetext={valueText}
          aria-label="Hours in the chair"
          onChange={(event) => {
            onChange(Number(event.target.value));
          }}
        />
      </div>
      <div className="length-pills" role="group" aria-label="Chair length">
        {lengths.map((length) => {
          const selected = value === length.minutes;
          return (
            <button
              key={length.minutes}
              type="button"
              className={cn(
                glassClass({ thickness: "thin", shape: "pill", press: true }),
                "length-pill",
                selected && "is-selected",
              )}
              aria-pressed={selected}
              onClick={() => {
                onChange(length.minutes);
              }}
            >
              {length.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
