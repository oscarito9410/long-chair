export function ThemeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full wash-wisteria px-4 py-2 text-lg font-bold text-ink">
      {label}
    </span>
  );
}
