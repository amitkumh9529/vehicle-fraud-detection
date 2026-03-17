import { Target } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

export default function PerformanceRadar({ metrics }) {
  const data = [
    { metric: 'Accuracy',  value: Number(metrics.accuracy) },
    { metric: 'Precision', value: Number((metrics.precision * 100).toFixed(1)) },
    { metric: 'Recall',    value: Number((metrics.recall   * 100).toFixed(1)) },
    { metric: 'F1',        value: Number((metrics.f1_score * 100).toFixed(1)) },
    { metric: 'ROC-AUC',   value: Number((metrics.roc_auc  * 100).toFixed(1)) },
  ]

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-1.5">
        <Target size={11} /> Performance Radar
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Model"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 3, fill: '#3b82f6' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
