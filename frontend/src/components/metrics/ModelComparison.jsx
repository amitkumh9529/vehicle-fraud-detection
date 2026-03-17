import { BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import ChartTooltip from '../ui/ChartTooltip'

export default function ModelComparison({ models }) {
  if (!models?.length) return null

  const data = models.map(m => ({
    name: m.model.replace(' ', '\n'),
    Accuracy: Number(m.accuracy),
    'ROC-AUC': Number((m.roc_auc * 100).toFixed(1)),
  }))

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-1.5">
        <BarChart3 size={11} /> Model Comparison
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={14}>
          <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9 }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="Accuracy" radius={[3, 3, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 1 ? '#6d28d9' : '#1d4ed8'} />
            ))}
          </Bar>
          <Bar dataKey="ROC-AUC" fill="#10b981" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
