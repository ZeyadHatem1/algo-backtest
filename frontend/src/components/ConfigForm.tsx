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
  compare_strategies: ['ma_crossover'],
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

const C = {
  accent: '#fbbf24',
  accentDim: '#292100',
  bg: '#09080a',
  card: '#120f08',
  border: '#2a2010',
  label: '#d4a96a',
  text: '#fef9f0',
  muted: '#78716c',
}

const inputStyle: React.CSSProperties = {
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  color: C.text,
  padding: '8px 12px',
  fontSize: 'clamp(13px, 3.2vw, 14px)',
  width: '100%',
  outline: 'none',
  fontFamily: 'IBM Plex Mono, monospace',
  transition: 'border-color 0.15s',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  background: `linear-gradient(180deg, ${C.card}, ${C.bg})`,
  paddingRight: 36,
  cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  color: C.label,
  fontSize: 'clamp(10px, 3vw, 11px)',
  letterSpacing: '0.12em',
  marginBottom: 6,
  display: 'block',
  fontFamily: 'IBM Plex Mono, monospace',
}

function validateDates(start: string, end: string): string | null {
  if (!start || !end) return 'Please select both start and end dates.'
  const s = new Date(start)
  const e = new Date(end)
  const today = new Date()
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Invalid date format.'
  if (s >= e) return 'Start date must be before end date.'
  if (e > today) return 'End date cannot be in the future.'
  if (s > today) return 'Start date cannot be in the future.'
  const diffDays = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays < 60) return 'Date range must be at least 60 days for meaningful results.'
  return null
}

export default function ConfigForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<BacktestRequest>(loadForm)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch {}
  }, [form])

  const update = (key: keyof BacktestRequest, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'start_date' || key === 'end_date') {
      const newForm = { ...form, [key]: value }
      setDateError(validateDates(newForm.start_date, newForm.end_date))
    }
  }

  const resetForm = () => {
    setForm(defaultForm)
    setDateError(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const toggleCompareStrategy = (strategy: StrategyType) => {
    const selected = form.compare_strategies ?? []
    const next = selected.includes(strategy)
      ? selected.filter(s => s !== strategy)
      : [...selected, strategy]
    update('compare_strategies', next)
  }

  const handleSubmit = () => {
    const err = validateDates(form.start_date, form.end_date)
    if (err) { setDateError(err); return }
    setDateError(null)
    onSubmit(form)
  }

  const numInput = (label: string, key: keyof BacktestRequest, optional = false) => (
    <div key={key}>
      <label style={labelStyle}>{label}{optional ? ' (OPT)' : ''}</label>
      <input
        type="number"
        value={(form[key] as number) ?? ''}
        onChange={e => update(key, e.target.value === '' ? null : Number(e.target.value))}
        style={inputStyle}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent}
        onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border}
      />
    </div>
  )

  const hasAdvancedChanges = form.commission_pct !== 0.1 || form.stop_loss_pct !== null || form.take_profit_pct !== null

  const selectWrapStyle: React.CSSProperties = {
    position: 'relative',
  }

  const selectCaretStyle: React.CSSProperties = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 'clamp(10px, 3vw, 11px)',
    letterSpacing: '0.12em',
    color: C.label,
    pointerEvents: 'none',
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3.2vw, 12px)', color: C.accent, letterSpacing: '0.15em' }}>CONFIGURATION</span>
        <button onClick={resetForm} style={{
          fontFamily: 'IBM Plex Mono', fontSize: 'clamp(10px, 3vw, 11px)', color: C.muted,
          background: 'none', border: `1px solid ${C.border}`,
          borderRadius: 4, padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.08em'
        }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = C.accent}
          onMouseLeave={e => (e.target as HTMLElement).style.color = C.muted}
        >RESET</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>SYMBOL</label>
          <div style={selectWrapStyle}>
            <select value={form.symbol} onChange={e => update('symbol', e.target.value)} style={selectStyle as any}
              onFocus={e => (e.target as HTMLElement).style.borderColor = C.accent}
              onBlur={e => (e.target as HTMLElement).style.borderColor = C.border}>
              {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={selectCaretStyle}>▼</span>
          </div>
        </div>
        <div>
          <label style={labelStyle}>START DATE</label>
          <input type="date" value={form.start_date} onChange={e => update('start_date', e.target.value)}
            style={{ ...inputStyle, borderColor: dateError ? '#4a1a1a' : C.border } as React.CSSProperties}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = dateError ? '#4a1a1a' : C.border} />
        </div>
        <div>
          <label style={labelStyle}>END DATE</label>
          <input type="date" value={form.end_date} onChange={e => update('end_date', e.target.value)}
            style={{ ...inputStyle, borderColor: dateError ? '#4a1a1a' : C.border } as React.CSSProperties}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = dateError ? '#4a1a1a' : C.border} />
        </div>
        <div>
          <label style={labelStyle}>PRIMARY STRATEGY</label>
          <div style={selectWrapStyle}>
            <select value={form.strategy} onChange={e => update('strategy', e.target.value as StrategyType)} style={selectStyle as any}
              onFocus={e => (e.target as HTMLElement).style.borderColor = C.accent}
              onBlur={e => (e.target as HTMLElement).style.borderColor = C.border}>
              {(Object.keys(strategyLabels) as StrategyType[]).map(s => (
                <option key={s} value={s}>{strategyLabels[s]}</option>
              ))}
            </select>
            <span style={selectCaretStyle}>▼</span>
          </div>
        </div>
      </div>

      {dateError && (
        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3.2vw, 12px)', color: '#f87171',
          marginBottom: 12, padding: '8px 12px',
          background: '#100a0a', border: '1px solid #3a1a1a', borderRadius: 6
        }}>⚠ {dateError}</div>
      )}

      <div style={{
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 'clamp(10px, 3vw, 11px)', color: C.label, letterSpacing: '0.12em', marginBottom: 12 }}>
          COMPARE STRATEGIES (SIDE BY SIDE)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {(Object.keys(strategyLabels) as StrategyType[]).map((strategy) => {
            const selected = (form.compare_strategies ?? []).includes(strategy)
            return (
              <label key={strategy} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                border: `1px solid ${selected ? C.accent : C.border}`,
                background: selected ? '#1a1406' : 'transparent',
                cursor: 'pointer', fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3.2vw, 12px)', color: C.text
              }}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleCompareStrategy(strategy)}
                  style={{ accentColor: C.accent }}
                />
                {strategyLabels[strategy]}
              </label>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 16 }}>
        {form.strategy === 'ma_crossover' && <>
          {numInput('SHORT WINDOW', 'short_window')}
          {numInput('LONG WINDOW', 'long_window')}
          <div>
            <label style={labelStyle}>MA TYPE</label>
            <div style={selectWrapStyle}>
              <select value={form.ma_type} onChange={e => update('ma_type', e.target.value)} style={selectStyle as any}
                onFocus={e => (e.target as HTMLElement).style.borderColor = C.accent}
                onBlur={e => (e.target as HTMLElement).style.borderColor = C.border}>
                <option value="SMA">SMA</option>
                <option value="EMA">EMA</option>
              </select>
              <span style={selectCaretStyle}>▼</span>
            </div>
          </div>
        </>}
        {form.strategy === 'rsi' && <>
          {numInput('RSI PERIOD', 'rsi_period')}
          {numInput('OVERSOLD', 'rsi_oversold')}
          {numInput('OVERBOUGHT', 'rsi_overbought')}
        </>}
        {form.strategy === 'bollinger_bands' && <>
          {numInput('PERIOD', 'bb_period')}
          {numInput('STD DEVIATIONS', 'bb_num_std')}
        </>}
        {form.strategy === 'macd' && <>
          {numInput('FAST PERIOD', 'macd_fast')}
          {numInput('SLOW PERIOD', 'macd_slow')}
          {numInput('SIGNAL PERIOD', 'macd_signal')}
        </>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {numInput('INITIAL CAPITAL ($)', 'initial_capital')}
        {numInput('RISK PER TRADE (%)', 'risk_per_trade')}
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setShowAdvanced(p => !p)} style={{
          fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3.2vw, 12px)',
          color: hasAdvancedChanges ? C.accent : C.muted,
          background: 'none', border: 'none', cursor: 'pointer',
          letterSpacing: '0.1em', padding: 0,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span>{showAdvanced ? '▾' : '▸'}</span>
          ADVANCED SETTINGS
          {hasAdvancedChanges && <span style={{ color: C.accent, fontSize: 8 }}>●</span>}
        </button>
        {showAdvanced && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16, marginTop: 16, padding: 16,
            background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`
          }}>
            {numInput('COMMISSION (%)', 'commission_pct')}
            {numInput('STOP LOSS (%)', 'stop_loss_pct', true)}
            {numInput('TAKE PROFIT (%)', 'take_profit_pct', true)}
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading || !!dateError} style={{
        width: '100%',
        background: loading || dateError ? C.accentDim : C.accent,
        color: loading || dateError ? C.muted : '#09080a',
        border: 'none', borderRadius: 8, padding: '14px',
        fontFamily: 'IBM Plex Mono', fontSize: 'clamp(13px, 3.4vw, 14px)', fontWeight: 600,
        letterSpacing: '0.15em', cursor: loading || dateError ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s'
      }}>
        {loading ? 'RUNNING...' : 'RUN BACKTEST'}
      </button>
    </div>
  )
}
