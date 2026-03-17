import { Cpu, RefreshCw, AlertTriangle } from 'lucide-react'
import { useModelMetrics } from '../hooks/useModelMetrics'
import MetricBadge from '../components/ui/MetricBadge'
import PerformanceRadar from '../components/metrics/PerformanceRadar'
import ModelComparison from '../components/metrics/ModelComparison'
import ConfusionMatrix from '../components/metrics/ConfusionMatrix'
import FeatureImportance from '../components/metrics/FeatureImportance'

function SkeletonLoader() {
  return (
    <div className="space-y-3">
      {[72, 48, 200, 160].map(h => (
        <div key={h} className="rounded-xl shimmer" style={{ height: h }} />
      ))}
    </div>
  )
}

export default function MetricsPage() {
  const { info, loading, retraining, error, retrain } = useModelMetrics()

  if (loading) return <SkeletonLoader />

  if (error) {
    return (
      <div className="rounded-xl p-4 bg-amber-950/20 border border-amber-800/40 text-sm text-amber-400 flex items-start gap-2">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        {error}
      </div>
    )
  }

  const { best_model, metrics, confusion_matrix, all_models, feature_importance } = info

  return (
    <div className="space-y-4 animate-slide-up">

      {/* Active model header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-950/60 border border-violet-700/40 flex items-center justify-center">
            <Cpu size={14} className="text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Active Model</p>
            <p className="text-sm font-semibold text-slate-200 leading-tight">{best_model}</p>
          </div>
        </div>

        <button
          onClick={retrain}
          disabled={retraining}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
            retraining
              ? 'text-slate-500 border-slate-700 cursor-not-allowed'
              : 'text-slate-300 border-slate-700 hover:bg-slate-800',
          ].join(' ')}
        >
          <RefreshCw size={11} className={retraining ? 'animate-spin-slow' : ''} />
          {retraining ? 'Training...' : 'Retrain'}
        </button>
      </div>

      {/* Core metric tiles */}
      <div className="grid grid-cols-2 gap-2">
        <MetricBadge label="Accuracy"  value={metrics.accuracy}                         color="blue"   />
        <MetricBadge label="ROC-AUC"   value={(metrics.roc_auc  * 100).toFixed(1)}      color="violet" />
        <MetricBadge label="Precision" value={(metrics.precision * 100).toFixed(1)}      color="green"  />
        <MetricBadge label="Recall"    value={(metrics.recall    * 100).toFixed(1)}      color="amber"  />
      </div>

      {/* Performance radar */}
      <PerformanceRadar metrics={metrics} />

      {/* Model comparison bar chart */}
      <ModelComparison models={all_models} />

      {/* Confusion matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-xs font-medium text-slate-400 mb-3">Confusion Matrix</p>
        <ConfusionMatrix cm={confusion_matrix} />
      </div>

      {/* Feature importance (collapsible) */}
      <FeatureImportance features={feature_importance} />
    </div>
  )
}
