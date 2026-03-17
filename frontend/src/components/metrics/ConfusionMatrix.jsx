const CELLS = [
  { key: 'tn', label: 'True Neg',   sub: 'Correctly cleared',  color: 'emerald' },
  { key: 'fp', label: 'False Pos',  sub: 'Incorrectly flagged', color: 'amber'   },
  { key: 'fn', label: 'False Neg',  sub: 'Missed fraud',        color: 'red'     },
  { key: 'tp', label: 'True Pos',   sub: 'Fraud caught',        color: 'blue'    },
]

const COLOR_CLASSES = {
  emerald: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40',
  amber:   'text-amber-400   bg-amber-950/30   border-amber-800/40',
  red:     'text-red-400     bg-red-950/30     border-red-800/40',
  blue:    'text-blue-400    bg-blue-950/30    border-blue-800/40',
}

export default function ConfusionMatrix({ cm }) {
  const total = cm.tn + cm.fp + cm.fn + cm.tp

  return (
    <div className="grid grid-cols-2 gap-2 text-center text-xs">
      {CELLS.map(({ key, label, sub, color }) => (
        <div key={key} className={`rounded-xl p-3 border ${COLOR_CLASSES[color]}`}>
          <p className="text-xl font-bold tabular-nums">{cm[key]}</p>
          <p className="font-semibold mt-0.5">{label}</p>
          <p className="text-slate-500 text-[10px] mt-0.5">{sub}</p>
          <p className="text-[10px] mt-1 opacity-60">
            {((cm[key] / total) * 100).toFixed(1)}%
          </p>
        </div>
      ))}
    </div>
  )
}
