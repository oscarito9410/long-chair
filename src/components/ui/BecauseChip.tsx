export function BecauseChip({ name }: { name: string }) {
  return (
    <span className="glass inline-flex items-center rounded-full px-4 py-2 text-lg font-bold text-ink">
      Because of {name}
    </span>
  );
}
