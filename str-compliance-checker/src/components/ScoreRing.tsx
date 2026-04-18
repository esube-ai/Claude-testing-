interface Props { score: number; size?: number }

export function ScoreRing({ score, size = 100 }: Props) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';

  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`Compliance score: ${score}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
      />
      <text x={size / 2} y={size / 2} fill={color} textAnchor="middle"
        dominantBaseline="middle" className="rotate-90"
        style={{ transform: `rotate(90deg) translateX(0)`, transformOrigin: `${size/2}px ${size/2}px` }}
        fontSize={size * 0.22} fontWeight="700">
        {score}
      </text>
    </svg>
  );
}
