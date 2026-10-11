export function HeroNumber({ value, caption }: { value: string; caption: string }) {
  return (
    <div>
      <p className="hero-figure">{value}</p>
      <p className="mt-2 text-lg text-ink-soft">{caption}</p>
    </div>
  );
}
