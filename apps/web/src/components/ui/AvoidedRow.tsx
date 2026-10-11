import { ThemeBadge } from "./ThemeBadge.tsx";

export function AvoidedRow({ labels }: { labels: readonly string[] }) {
  if (labels.length === 0) {
    return <p className="text-lg text-ink-soft">No themes were set aside.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">Left out</p>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {labels.map((label) => (
          <li key={label}>
            <ThemeBadge label={label} />
          </li>
        ))}
      </ul>
    </div>
  );
}
