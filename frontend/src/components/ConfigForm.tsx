import { useState, useEffect } from 'react'
import { BacktestRequest, StrategyType } from '../types'

interface Props {
  onSubmit: (req: BacktestRequest) => void
  loading: boolean
}

const defaultForm: BacktestRequest = {
  symbol: 'NVDA',
  start_date: '2020-01-01',
  end_date: '2024-01-01',
  strategy: 'ma_crossover',
  compare_strategies: ['ma_crossover', 'rsi', 'bollinger_bands', 'macd'],
  initial_capital: 10000,
  risk_per_trade: 100,
  commission_pct: 0.1,
  stop_loss_pct: null,
  take_profit_pct: null,
  short_window: 20,
  long_window: 50,
  ma_type: 'SMA',
  rsi_period: 14,
  rsi_oversold: 30,
  rsi_overbought: 70,
  bb_period: 20,
  bb_num_std: 2.0,
  macd_fast: 12,
  macd_slow: 26,
  macd_signal: 9,
}

const strategyLabels: Record<StrategyType, string> = {
  ma_crossover: 'Moving Average Crossover',
  rsi: 'RSI',
  bollinger_bands: 'Bollinger Bands',
  macd: 'MACD',
}

const SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
  'NVDA', 'TSLA', 'AMD', 'INTC', 'NFLX',
  'SPY', 'QQQ', 'DIA', 'IWM',
  'JPM', 'BAC', 'GS', 'V', 'MA',
  'BRK-B', 'JNJ', 'PFE', 'UNH',
  'XOM', 'CVX', 'COP'
]

const STORAGE_KEY = 'backtest_form'

function loadForm(): BacktestRequest {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...defaultForm,
        ...parsed,
        compare_strategies: parsed.compare_strategies ?? defaultForm.compare_strategies,
      }
    }
  } catch {}
  return defaultForm
}

export default function ConfigForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<BacktestRequest>(loadForm)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {}
  }, [form])

  const update = (key: keyof BacktestRequest, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const resetForm = () => {
    setForm(defaultForm)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const toggleCompareStrategy = (strategy: StrategyType) => {
    const selected = form.compare_strategies ?? []
    const next = selected.includes(strategy)
      ? selected.filter(s => s !== strategy)
      : [...selected, strategy]

    if (next.length === 0) {
      return
    }

    update('compare_strategies', next)
  }

  const numInput = (label: string, key: keyof BacktestRequest, optional = false) => (
    <div key={key}>
      <label className="text-gray-400 text-sm block mb-1">
        {label}{optional && <span className="text-gray-600 ml-1">(optional)</span>}
      </label>
      <input
        type="number"
        value={(form[key] as number) ?? ''}
        onChange={e => update(key, e.target.value === '' ? null : Number(e.target.value))}
        className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  )

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Strategy Configuration</h2>
        <button
          onClick={resetForm}
          className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-gray-400 text-sm block mb-1">Symbol</label>
          <select
            value={form.symbol}
            onChange={e => update('symbol', e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            {SYMBOLS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm block mb-1">Start Date</label>
          <input
            type="date"
            value={form.start_date}
            onChange={e => update('start_date', e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm block mb-1">End Date</label>
          <input
            type="date"
            value={form.end_date}
            onChange={e => update('end_date', e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm block mb-1">Primary Strategy (details)</label>
          <select
            value={form.strategy}
            onChange={e => update('strategy', e.target.value as StrategyType)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            {(Object.keys(strategyLabels) as StrategyType[]).map(s => (
              <option key={s} value={s}>{strategyLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 mb-4">
        <p className="text-gray-300 text-sm mb-3">Compare Strategies Side by Side</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(Object.keys(strategyLabels) as StrategyType[]).map((strategy) => {
            const selected = (form.compare_strategies ?? []).includes(strategy)
            return (
              <label
                key={strategy}
                className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer ${
                  selected
                    ? 'bg-blue-900/25 border-blue-700 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleCompareStrategy(strategy)}
                  className="accent-blue-500"
                />
                <span className="text-sm">{strategyLabels[strategy]}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {form.strategy === 'ma_crossover' && <>
          {numInput('Short Window', 'short_window')}
          {numInput('Long Window', 'long_window')}
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
        </>}
        {form.strategy === 'rsi' && <>
          {numInput('RSI Period', 'rsi_period')}
          {numInput('Oversold', 'rsi_oversold')}
          {numInput('Overbought', 'rsi_overbought')}
        </>}
        {form.strategy === 'bollinger_bands' && <>
          {numInput('Period', 'bb_period')}
          {numInput('Std Deviations', 'bb_num_std')}
        </>}
        {form.strategy === 'macd' && <>
          {numInput('Fast Period', 'macd_fast')}
          {numInput('Slow Period', 'macd_slow')}
          {numInput('Signal Period', 'macd_signal')}
        </>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {numInput('Initial Capital ($)', 'initial_capital')}
        {numInput('Risk Per Trade (%)', 'risk_per_trade')}
      </div>

      <details className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 mb-6 group">
        <summary className="text-gray-300 text-sm cursor-pointer select-none group-open:mb-4">
          Advanced Risk & Execution
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {numInput('Commission (%)', 'commission_pct')}
          {numInput('Stop Loss (%)', 'stop_loss_pct', true)}
          {numInput('Take Profit (%)', 'take_profit_pct', true)}
        </div>
      </details>

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
