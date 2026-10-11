import { ThemeBadge } from "./ThemeBadge.tsx";

function checkedLine(count: number): string {
  if (count === 0) {
    return "No themes were set aside.";
  }
  if (count === 1) {
    return "Checked against your 1 theme.";
  }
  return `Checked against your ${count} themes.`;
}

export function ThemeCheck({
  count,
  exceptions,
}: {
  count: number;
  exceptions: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg text-ink-soft">{checkedLine(count)}</p>
      {exceptions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold">Not cleared</p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {exceptions.map((label) => (
              <li key={label}>
                <ThemeBadge label={label} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
