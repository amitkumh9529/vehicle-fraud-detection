import { FileSearch, BarChart3 } from 'lucide-react'

const TABS = [
  { id: 'analyse', label: 'Analyse Claim', icon: FileSearch },
  { id: 'metrics', label: 'Model Metrics', icon: BarChart3  },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-800 mb-4">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={[
            'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all',
            active === id
              ? 'bg-slate-700 text-white shadow'
              : 'text-slate-500 hover:text-slate-300',
          ].join(' ')}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}
