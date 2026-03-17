import { useState } from 'react'
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

export default function FeatureImportance({ features }) {
  const [open, setOpen] = useState(false)

  if (!features?.length) return null

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between text-xs font-medium text-slate-400"
      >
        <span className="flex items-center gap-1.5">
          <TrendingUp size={11} /> Top Feature Importance
        </span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {features.slice(0, 8).map(({ feature, importance }) => (
            <div key={feature}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-slate-400 font-medium">{feature}</span>
                <span className="text-blue-400 tabular-nums">
                  {(importance * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-700"
                  style={{ width: `${Math.min(importance * 100 * 5, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
