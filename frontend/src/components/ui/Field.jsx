export default function Field({ field, value, onChange, error }) {
  const base = [
    'w-full rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 border text-slate-100',
    'focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600',
    error
      ? 'border-red-500/60 focus:border-red-400 focus:ring-red-500/30'
      : 'border-slate-700/60 focus:border-blue-500/60 focus:ring-blue-500/20',
  ].join(' ')

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 tracking-wide block">
        {field.label}
      </label>

      {field.type === 'select' ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={base + ' cursor-pointer'}
        >
          {field.options.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          className={base}
        />
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
