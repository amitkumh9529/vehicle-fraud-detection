const STROKE_COLORS = {
  red:   '#ff2d55',
  amber: '#ffb300',
  green: '#00e5a0',
}

export default function ProbGauge({ value, color }) {
  const r             = 70
  const cx            = 90
  const cy            = 90
  const circumference = Math.PI * r          // half-circle arc length
  const offset        = circumference * (1 - value / 100)
  const stroke        = STROKE_COLORS[color] || STROKE_COLORS.green

  return (
    <svg viewBox="0 0 180 100" className="w-full max-w-[260px]">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#1e293b"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        filter={`drop-shadow(0 0 6px ${stroke})`}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {/* Percentage label */}
      <text
        x={cx} y={cy - 8}
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill={stroke}
        fontFamily="DM Sans, sans-serif"
      >
        {value}%
      </text>
      {/* Sub-label */}
      <text
        x={cx} y={cy + 10}
        textAnchor="middle"
        fontSize="9"
        fill="#64748b"
        fontFamily="DM Sans, sans-serif"
        letterSpacing="2"
      >
        FRAUD PROB
      </text>
    </svg>
  )
}
