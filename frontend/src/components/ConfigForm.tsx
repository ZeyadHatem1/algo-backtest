import { useState } from 'react'
import { BacktestRequest } from '../types'

interface Props {
  onSubmit: (req: BacktestRequest) => void
  loading: boolean
}

export default function ConfigForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<BacktestRequest>({
    symbol: 'NVDA',
    start_date: '2020-01-01',
    end_date: '2024-01-01',
    short_window: 20,
    long_window: 50,
    ma_type: 'SMA',
    initial_capital: 10000,
    risk_per_trade: 100,
    commission_pct: 0.1,
    stop_loss_pct: null,
    take_profit_pct: null,
  })

  const update = (key: keyof BacktestRequest, value: string | number | null) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const fields = [
    { label: "Symbol", key: "symbol", type: "text" },
    { label: "Start Date", key: "start_date", type: "date" },
    { label: "End Date", key: "end_date", type: "date" },
    { label: "Short Window", key: "short_window", type: "number" },
    { label: "Long Window", key: "long_window", type: "number" },
    { label: "Initial Capital ($)", key: "initial_capital", type: "number" },
    { label: "Risk Per Trade (%)", key: "risk_per_trade", type: "number" },
    { label: "Commission (%)", key: "commission_pct", type: "number" },
    { label: "Stop Loss (%) — optional", key: "stop_loss_pct", type: "number" },
    { label: "Take Profit (%) — optional", key: "take_profit_pct", type: "number" },
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
      <h2 className="text-white text-lg font-semibold mb-4">Strategy Configuration</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {fields.map(({ label, key, type }) => (
          <div key={key}>
            <label className="text-gray-400 text-sm block mb-1">{label}</label>
            <input
              type={type}
              value={(form[key as keyof BacktestRequest] as string | number) ?? ''}
              onChange={e => update(key as keyof BacktestRequest, type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="text-gray-400 text-sm block mb-1">MA Type</label>
          <select
            value={form.ma_type}
            onChange={e => update('ma_type', e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="SMA">SMA</option>
            <option value="EMA">EMA</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? 'Running Backtest...' : 'Run Backtest'}
      </button>
    </div>
  )
}