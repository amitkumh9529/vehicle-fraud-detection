import { CheckCircle2, XCircle, AlertCircle, RotateCcw } from 'lucide-react'
import ProbGauge from '../metrics/ProbGauge'

const TIER_CONFIG = {
  HIGH:   { color: '#ff2d55', bgClass: 'bg-red-950/20',   borderClass: 'border-red-500/30',   pulseClass: 'animate-pulse-fraud', gaugeColor: 'red',   Icon: XCircle       },
  MEDIUM: { color: '#ffb300', bgClass: 'bg-amber-950/20', borderClass: 'border-amber-500/30', pulseClass: 'animate-pulse-safe',  gaugeColor: 'amber', Icon: AlertCircle   },
  LOW:    { color: '#00e5a0', bgClass: 'bg-emerald-950/20',borderClass: 'border-emerald-500/30',pulseClass:'animate-pulse-safe', gaugeColor: 'green', Icon: CheckCircle2  },
}

export default function ResultCard({ result, onReset }) {
  const cfg = TIER_CONFIG[result.risk_tier] || TIER_CONFIG.LOW
  const { color, bgClass, borderClass, pulseClass, gaugeColor, Icon } = cfg

  return (
    <div className={`animate-slide-up rounded-2xl border ${borderClass} ${bgClass} p-6 space-y-5`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${pulseClass}`}
            style={{ backgroundColor: `${color}20`, border: `1.5px solid ${color}` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Verdict</p>
            <h3 className="text-xl font-bold leading-tight" style={{ color }}>
              {result.prediction}
            </h3>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full border"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}12` }}
        >
          {result.risk_tier} RISK
        </span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center py-2">
        <ProbGauge value={result.fraud_probability} color={gaugeColor} />
      </div>

      {/* Probability bars */}
      <div className="space-y-2.5">
        {[
          { label: 'Fraud Probability',      pct: result.fraud_probability,      barColor: color,     textColor: color     },
          { label: 'Legitimate Probability',  pct: result.legitimate_probability, barColor: '#64748b', textColor: '#94a3b8' },
        ].map(({ label, pct, barColor, textColor }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{label}</span>
              <span className="font-semibold" style={{ color: textColor }}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}60` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div
        className="rounded-xl p-4 text-sm leading-relaxed"
        style={{ backgroundColor: `${color}08`, border: `1px solid ${color}25` }}
      >
        {result.recommendation}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} /> Analyse New Claim
      </button>
    </div>
  )
}
