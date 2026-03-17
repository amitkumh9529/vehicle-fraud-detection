import { FileText, User, Car, AlertTriangle, Shield, ChevronRight, Zap } from 'lucide-react'
import Field from '../ui/Field'

const ICON_MAP = { FileText, User, Car, AlertTriangle, Shield }

export default function FormSection({
  section,
  sectionIndex,
  totalSections,
  formData,
  fieldErrors,
  onFieldChange,
  onNext,
  onBack,
  onSubmit,
  loading,
  isAllComplete,
}) {
  const Icon = ICON_MAP[section.icon]
  const isLast = sectionIndex === totalSections - 1

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 animate-slide-up">

      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-5">
        <Icon size={16} className="text-blue-400" />
        <h3 className="font-semibold text-sm text-slate-200">{section.title}</h3>
        <span className="ml-auto text-xs text-slate-500">
          {sectionIndex + 1} / {totalSections}
        </span>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-2 gap-3">
        {section.fields.map(field => (
          <div
            key={field.name}
            className={field.type === 'select' && field.options?.length > 6 ? 'col-span-2' : ''}
          >
            <Field
              field={field}
              value={formData[field.name] ?? ''}
              onChange={val => onFieldChange(field.name, val)}
              error={fieldErrors[field.name]}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2.5 mt-5">
        {sectionIndex > 0 && (
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:bg-slate-800 transition-all"
          >
            Back
          </button>
        )}

        {!isLast ? (
          <button
            onClick={onNext}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/25"
          >
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={loading || !isAllComplete}
            className={[
              'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
              isAllComplete && !loading
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed',
            ].join(' ')}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Analysing...
              </>
            ) : (
              <><Zap size={14} /> Analyse Claim</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
