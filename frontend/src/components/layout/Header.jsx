import { useEffect, useState } from 'react'
import { ShieldCheck, Activity, BarChart3 } from 'lucide-react'
import { getModelInfo } from '../../api'

export default function Header() {
  const [stats, setStats] = useState({
    model: '...',
    accuracy: '...',
    roc_auc: '...',
  })

  useEffect(() => {
    getModelInfo()
      .then(data => setStats({
        model:    data.best_model.replace('Classifier', '').replace('Regression', ' Regression'),
        accuracy: data.metrics.accuracy + '%',
        roc_auc:  data.metrics.roc_auc.toFixed(2),
      }))
      .catch(() => {})
  }, [])

  const STATS = [
    { label: 'Model',    value: stats.model,    icon: Activity    },
    { label: 'Accuracy', value: stats.accuracy, icon: ShieldCheck  },
    { label: 'ROC-AUC',  value: stats.roc_auc,  icon: BarChart3   },
  ]

  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600
          flex items-center justify-center shadow-lg shadow-blue-600/30">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h1
            className="text-xl font-bold tracking-tight text-white leading-tight"
            style={{ fontFamily: '"Syne", sans-serif' }}
          >
            FraudGuard AI
          </h1>
          <p className="text-xs text-slate-500 leading-tight">
            Vehicle Insurance Fraud Detection
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full
          bg-emerald-950/40 border border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2.5 flex items-center gap-2.5"
          >
            <Icon size={13} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-200 leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  )
}