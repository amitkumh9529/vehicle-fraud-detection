const COLOR_MAP = {
  blue:   'text-blue-400   bg-blue-950/40   border-blue-800/50',
  violet: 'text-violet-400 bg-violet-950/40 border-violet-800/50',
  green:  'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
  amber:  'text-amber-400  bg-amber-950/40  border-amber-800/50',
  sky:    'text-sky-400    bg-sky-950/40    border-sky-800/50',
}

export default function MetricBadge({ label, value, color = 'blue', suffix = '%' }) {
  const classes = COLOR_MAP[color] || COLOR_MAP.blue

  return (
    <div className={`rounded-xl p-3.5 border ${classes} text-center`}>
      <p className="text-2xl font-bold tabular-nums">
        {value}{suffix}
      </p>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
    </div>
  )
}
