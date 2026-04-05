// ─── ProgressBar ─────────────────────────────────────────────
export function ProgressBar({ value = 0, color = 'bg-brand-500', height = 'h-2', className = '' }) {
  return (
    <div className={`progress-track ${height} ${className}`}>
      <div
        className={`progress-fill ${color} ${height}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, color = 'brand', progress }) {
  const colors = {
    brand:   { bg: 'bg-brand-50 dark:bg-brand-900/20',     text: 'text-brand-600 dark:text-brand-400',   icon: 'bg-brand-100 dark:bg-brand-900/40',   bar: 'bg-brand-500' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', icon: 'bg-emerald-100 dark:bg-emerald-900/40', bar: 'bg-emerald-500' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',     text: 'text-amber-600 dark:text-amber-400',   icon: 'bg-amber-100 dark:bg-amber-900/40',   bar: 'bg-amber-500' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-900/20',       text: 'text-rose-600 dark:text-rose-400',     icon: 'bg-rose-100 dark:bg-rose-900/40',     bar: 'bg-rose-500' },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-900/20',   text: 'text-violet-600 dark:text-violet-400', icon: 'bg-violet-100 dark:bg-violet-900/40', bar: 'bg-violet-500' },
  }
  const c = colors[color] || colors.brand
  return (
    <div className="card p-5 fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
            <Icon size={18} className={c.text} />
          </div>
        )}
      </div>
      {progress !== undefined && <ProgressBar value={progress} color={c.bar} />}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ children, variant = 'todo' }) {
  const map = {
    Easy:        'badge badge-easy',
    Medium:      'badge badge-medium',
    Hard:        'badge badge-hard',
    Done:        'badge badge-done',
    Todo:        'badge badge-todo',
    'In Progress':'badge badge-progress',
  }
  return <span className={map[variant] || map[children] || 'badge badge-todo'}>{children}</span>
}

// ─── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" width={size} height={size}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ─── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={36} className="text-gray-300 dark:text-gray-600 mb-3" />}
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────
export function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── TopicChecklist ───────────────────────────────────────────
export function TopicChecklist({ items = [], onToggle }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2.5">
          <input
            type="checkbox"
            className="custom-check"
            checked={item.completed || false}
            onChange={(e) => onToggle?.(i, e.target.checked)}
          />
          <span className={`text-sm ${item.completed ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-xl ${className}`} />
}
