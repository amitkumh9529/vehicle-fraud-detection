import { FORM_SECTIONS } from '../../config/formConfig'

export default function ProgressBar({ activeSection, isSectionComplete }) {
  return (
    <div className="flex gap-1.5">
      {FORM_SECTIONS.map(section => (
        <div key={section.id} className="flex-1 h-1 rounded-full overflow-hidden bg-slate-800">
          <div
            className={[
              'h-full rounded-full transition-all duration-500',
              isSectionComplete(section.id)
                ? 'bg-blue-500 w-full'
                : activeSection === section.id
                  ? 'bg-blue-900 w-1/2'
                  : 'w-0',
            ].join(' ')}
          />
        </div>
      ))}
    </div>
  )
}
