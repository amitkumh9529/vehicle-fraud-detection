import { useState } from 'react'
import { Activity, AlertTriangle, XCircle } from 'lucide-react'
import { usePrediction } from '../hooks/usePrediction'
import { FORM_SECTIONS, DEFAULT_VALUES, HIGH_RISK_PRESET } from '../config/formConfig'
import SectionNav from '../components/ui/SectionNav'
import ProgressBar from '../components/ui/ProgressBar'
import FormSection from '../components/form/FormSection'
import ResultCard from '../components/form/ResultCard'

export default function AnalysePage() {
  const [activeSection, setActiveSection] = useState(FORM_SECTIONS[0].id)

  const {
    formData, result, loading, error, fieldErrors,
    updateField, loadPreset, validateSection,
    isSectionComplete, isAllComplete, submit, reset,
  } = usePrediction()

  const currentIndex   = FORM_SECTIONS.findIndex(s => s.id === activeSection)
  const currentSection = FORM_SECTIONS[currentIndex]

  const handleNext = () => {
    const valid = validateSection(currentSection)
    if (!valid) return
    if (currentIndex < FORM_SECTIONS.length - 1) {
      setActiveSection(FORM_SECTIONS[currentIndex + 1].id)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setActiveSection(FORM_SECTIONS[currentIndex - 1].id)
    }
  }

  const handleReset = () => {
    reset()
    setActiveSection(FORM_SECTIONS[0].id)
  }

  if (result) {
    return <ResultCard result={result} onReset={handleReset} />
  }

  return (
    <div className="space-y-4">
      {/* Section pill nav */}
      <SectionNav
        sections={FORM_SECTIONS}
        active={activeSection}
        onSelect={setActiveSection}
        isSectionComplete={isSectionComplete}
      />

      {/* Active section fields */}
      <FormSection
        section={currentSection}
        sectionIndex={currentIndex}
        totalSections={FORM_SECTIONS.length}
        formData={formData}
        fieldErrors={fieldErrors}
        onFieldChange={updateField}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={submit}
        loading={loading}
        isAllComplete={isAllComplete}
      />

      {/* Section completion progress */}
      <ProgressBar
        activeSection={activeSection}
        isSectionComplete={isSectionComplete}
      />

      {/* Preset loaders */}
      <div className="flex gap-2">
        <button
          onClick={() => { loadPreset(DEFAULT_VALUES); setActiveSection(FORM_SECTIONS[0].id) }}
          className="flex-1 py-2 rounded-lg text-xs text-slate-400 border border-slate-800 hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
        >
          <Activity size={11} /> Load Sample
        </button>
        <button
          onClick={() => { loadPreset(HIGH_RISK_PRESET); setActiveSection(FORM_SECTIONS[0].id) }}
          className="flex-1 py-2 rounded-lg text-xs text-red-400 border border-red-900/40 hover:bg-red-950/30 transition-all flex items-center justify-center gap-1.5"
        >
          <AlertTriangle size={11} /> High-Risk Preset
        </button>
      </div>

      {/* API error banner */}
      {error && (
        <div className="rounded-xl p-3.5 bg-red-950/30 border border-red-500/30 text-sm text-red-400 flex items-start gap-2">
          <XCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
