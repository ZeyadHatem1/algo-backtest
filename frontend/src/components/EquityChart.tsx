import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'
import { EquityPoint } from '../types'

interface Props {
  data: EquityPoint[]
  initialCapital?: number
}

const C = {
  accent: '#fbbf24',
  card: '#120f08',
  border: '#2a2010',
  grid: '#1a1208',
  label: '#d4a96a',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#09080a', border: `1px solid ${C.border}`,
        borderRadius: 6, padding: '10px 14px',
        fontFamily: 'IBM Plex Mono', fontSize: 12
      }}>
        <div style={{ color: C.label, marginBottom: 4, fontSize: 10 }}>{label}</div>
        <div style={{ color: C.accent, fontWeight: 600 }}>${Number(payload[0].value).toLocaleString()}</div>
      </div>
    )
  }
  return null
}

export default function EquityChart({ data, initialCapital = 10000 }: Props) {
  const formatted = data.filter((_, i) => i % 3 === 0).map(d => ({
    date: d.date.slice(0, 10),
    value: Math.round(d.value)
  }))

  const values = formatted.map(d => d.value)
  const maxVal = Math.max(...values)
  const minVal = Math.min(...values)
  const padding = (maxVal - minVal) * 0.1

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: C.accent, letterSpacing: '0.15em', marginBottom: 20 }}>
        EQUITY CURVE
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={formatted} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="1 4" stroke={C.grid} vertical={false} />
          <XAxis dataKey="date"
            tick={{ fill: C.label, fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis
            tick={{ fill: C.label, fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            domain={[minVal - padding, maxVal + padding]}
            width={50} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={initialCapital} stroke="#2a2010" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="value"
            stroke="#fbbf24" strokeWidth={1.5}
            fill="url(#goldGrad)" dot={false}
            activeDot={{ r: 4, fill: '#fbbf24', stroke: '#09080a', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}