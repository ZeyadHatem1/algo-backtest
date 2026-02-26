import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { EquityPoint } from '../types'

interface Props {
  data: EquityPoint[]
}

export default function EquityChart({ data }: Props) {
  const formatted = data.filter((_, i) => i % 5 === 0).map(d => ({
    date: d.date.slice(0, 10),
    value: Math.round(d.value)
  }))

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
      <h2 className="text-white text-lg font-semibold mb-4">Equity Curve</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}