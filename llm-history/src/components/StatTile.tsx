export default function StatTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-card px-4 py-5 text-center sm:text-left">
      <p className="text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-ink-secondary">{label}</p>
    </div>
  );
}
