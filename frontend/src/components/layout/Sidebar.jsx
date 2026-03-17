const HOW_IT_WORKS = [
  { n: '01', title: 'Fill Claim Form',  desc: 'Enter all incident, vehicle, and policy details.' },
  { n: '02', title: 'ML Inference',     desc: 'Random Forest model evaluates 28 features.' },
  { n: '03', title: 'Risk Score',       desc: 'Get probability score and risk tier instantly.' },
  { n: '04', title: 'Action',           desc: 'Follow AI recommendation for claim processing.' },
]

const RISK_TIERS = [
  { tier: 'HIGH',   range: '≥ 75%',  color: '#ff2d55', bg: 'rgba(255,45,85,0.1)',   action: 'Immediate investigation' },
  { tier: 'MEDIUM', range: '45–74%', color: '#ffb300', bg: 'rgba(255,179,0,0.1)',   action: 'Manual review required'  },
  { tier: 'LOW',    range: '< 45%',  color: '#00e5a0', bg: 'rgba(0,229,160,0.1)',   action: 'Standard processing'     },
]

const FRAUD_SIGNALS = [
  'New policy, early claim',
  'No police report filed',
  'No witness present',
  'Multiple prior claims',
  'Recent address change',
  'High supplement count',
  'Rural accident area',
  'Third party at fault',
]

const TECH_STACK = [
  'FastAPI', 'scikit-learn', 'Python', 'React 19', 'Tailwind v4', 'Recharts', 'Vite',
]

function Panel({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="lg:w-64 xl:w-72 space-y-4">

      <Panel title="How It Works">
        <ol className="space-y-3">
          {HOW_IT_WORKS.map(({ n, title, desc }) => (
            <li key={n} className="flex gap-3">
              <span className="text-xs font-bold text-blue-500 tabular-nums w-5 shrink-0 mt-0.5">
                {n}
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-300">{title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Risk Tiers">
        <div className="space-y-2.5">
          {RISK_TIERS.map(({ tier, range, color, bg, action }) => (
            <div
              key={tier}
              className="flex items-center gap-2.5 rounded-lg p-2.5"
              style={{ backgroundColor: bg, border: `1px solid ${color}25` }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color }}>{tier}</span>
                  <span className="text-[10px] text-slate-500 tabular-nums">{range}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{action}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Key Fraud Signals">
        <ul className="space-y-2">
          {FRAUD_SIGNALS.map(s => (
            <li key={s} className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Tech Stack">
        <div className="flex flex-wrap gap-1.5">
          {TECH_STACK.map(t => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
      </Panel>

    </aside>
  )
}
