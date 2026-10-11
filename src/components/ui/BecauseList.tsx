import { BecauseChip } from "./BecauseChip.tsx";

export function BecauseList({ names }: { names: readonly string[] }) {
  if (names.length === 0) {
    return null;
  }
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {names.map((name) => (
        <li key={name}>
          <BecauseChip name={name} />
        </li>
      ))}
    </ul>
  );
}
