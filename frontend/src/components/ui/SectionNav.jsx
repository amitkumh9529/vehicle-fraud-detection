import { FileText, User, Car, AlertTriangle, Shield } from 'lucide-react'

const ICON_MAP = { FileText, User, Car, AlertTriangle, Shield }

export default function SectionNav({ sections, active, onSelect, isSectionComplete }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {sections.map(section => {
        const Icon = ICON_MAP[section.icon]
        const done = isSectionComplete(section.id)
        const isActive = active === section.id

        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={[
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : done
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600',
            ].join(' ')}
          >
            <Icon size={12} />
            {section.title}
            {done && !isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        )
      })}
    </div>
  )
}
