interface Props { current: number; total: number }

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Question {current} of {total}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
