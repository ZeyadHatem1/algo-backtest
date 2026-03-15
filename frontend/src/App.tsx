import { useState } from 'react'
import ConfigForm from './components/ConfigForm'
import EquityChart from './components/EquityChart'
import MetricsCard from './components/MetricsCard'
import TradeLog from './components/TradeLog'
import StrategyComparison from './components/StrategyComparison'
import { runBacktest } from './api'
import { BacktestRequest, BacktestResponse, StrategyType } from './types'

const strategyLabels: Record<StrategyType, string> = {
  ma_crossover: 'Moving Average Crossover',
  rsi: 'RSI',
  bollinger_bands: 'Bollinger Bands',
  macd: 'MACD',
}

interface StrategyRun {
  strategy: StrategyType
  result: BacktestResponse
}

export default function App() {
  const [result, setResult] = useState<BacktestResponse | null>(null)
  const [comparisonRuns, setComparisonRuns] = useState<StrategyRun[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSymbol, setCurrentSymbol] = useState<string>('NVDA')
  const [initialCapital, setInitialCapital] = useState<number>(10000)

  const handleSubmit = async (req: BacktestRequest) => {
    setLoading(true)
    setError(null)
    setCurrentSymbol(req.symbol)
    setInitialCapital(req.initial_capital)

    const selected = req.compare_strategies && req.compare_strategies.length > 0
      ? req.compare_strategies
      : [req.strategy]

    const orderedStrategies = [
      req.strategy,
      ...selected.filter(s => s !== req.strategy),
    ]

    try {
      const responses = await Promise.all(
        orderedStrategies.map(async (strategy) => ({
          strategy,
          result: await runBacktest({ ...req, strategy }),
        }))
      )

      setComparisonRuns(responses)
      setResult(responses[0].result)
    } catch (e: any) {
      const status = e.response?.status
      const detail = e.response?.data?.detail
      if (!e.response) {
        setError('Cannot connect to backend. Make sure the server is running on port 8000.')
      } else if (status === 422 && Array.isArray(detail)) {
        setError(JSON.stringify(detail, null, 2))
      } else if (detail?.includes('No data') || detail?.includes('date')) {
        setError(`Date error: No data returned for ${req.symbol} in the selected date range. Try a wider range or check the dates.`)
      } else {
        setError(detail || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09080a' }}>
      <div style={{ borderBottom: '1px solid #2a2010', padding: '16px 24px', marginBottom: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 'clamp(12px, 3.4vw, 14px)', color: '#fbbf24', letterSpacing: '0.15em' }}>
              ALGO BACKTEST ENGINE
            </span>
          </div>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3vw, 12px)', color: '#2a2010' }}>v1.0.0</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 64px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: '2.5rem', fontWeight: 300, color: '#fef9f0', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
            Strategy<br />
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Backtester</span>
          </h1>
          <p style={{ marginTop: 12, fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3.2vw, 12px)', color: '#78716c', letterSpacing: '0.1em' }}>
            TEST STRATEGIES AGAINST HISTORICAL MARKET DATA
          </p>
        </div>

        <ConfigForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div style={{
            background: '#100a0a', border: '1px solid #3a1a1a', borderRadius: 8,
            padding: 16, marginBottom: 24, fontFamily: 'IBM Plex Mono',
            fontSize: 'clamp(12px, 3.2vw, 13px)', color: '#f87171', whiteSpace: 'pre-wrap', letterSpacing: '0.02em'
          }}>
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 'clamp(11px, 3.2vw, 12px)', color: '#fbbf24', letterSpacing: '0.2em' }}>
              RUNNING BACKTEST
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  width: 3, height: 24, background: '#fbbf24', borderRadius: 2,
                  animation: `bar 1s ease-in-out ${i * 0.12}s infinite alternate`
                }} />
              ))}
            </div>
            <style>{`@keyframes bar { from { opacity: 0.15; transform: scaleY(0.4); } to { opacity: 1; transform: scaleY(1); } }`}</style>
          </div>
        )}

        {result && !loading && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          {result.date_adjusted && result.requested_start && result.requested_end && result.actual_start && result.actual_end && (
            <div style={{
              background: '#1a1200',
              border: '1px solid #3a2a00',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16,
              fontFamily: 'IBM Plex Mono',
              fontSize: 'clamp(12px, 3.2vw, 13px)',
              color: '#fbbf24',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <span style={{ fontWeight: 600, letterSpacing: '0.1em' }}>⚠ DATE RANGE ADJUSTED</span>
              <span style={{ color: '#d4a96a', fontSize: 'clamp(11px, 3.2vw, 12px)' }}>
                You requested {result.requested_start} → {result.requested_end}
              </span>
              <span style={{ color: '#d4a96a', fontSize: 'clamp(11px, 3.2vw, 12px)' }}>
                Data available for {currentSymbol}: <span style={{ color: '#fbbf24' }}>{result.actual_start} → {result.actual_end}</span>
              </span>
              <span style={{ color: '#78716c', fontSize: 'clamp(10px, 3vw, 11px)', marginTop: 2 }}>
                Returns are calculated from the first available trading day for this symbol.
              </span>
            </div>
          )}

          <StrategyComparison runs={comparisonRuns} labels={strategyLabels} />
          <MetricsCard
            metrics={result.metrics}
            benchmarkReturn={result.benchmark_return}
            symbolBuyholdReturn={result.symbol_buyhold_return}
            symbol={currentSymbol}
          />
          <EquityChart data={result.equity_curve} initialCapital={initialCapital} />
          <TradeLog trades={result.trades} />
        </div>
      )}
      </div>
    </div>
  )
}
