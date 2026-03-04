import { useState } from 'react'
import ConfigForm from './components/ConfigForm'
import EquityChart from './components/EquityChart'
import MetricsCard from './components/MetricsCard'
import TradeLog from './components/TradeLog'
import { runBacktest } from './api'
import { BacktestRequest, BacktestResponse } from './types'

export default function App() {
  const [result, setResult] = useState<BacktestResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSymbol, setCurrentSymbol] = useState<string>('NVDA')

  const handleSubmit = async (req: BacktestRequest) => {
    setLoading(true)
    setError(null)
    setCurrentSymbol(req.symbol)
    try {
      const data = await runBacktest(req)
      setResult(data)
    } catch (e: any) {
      const detail = e.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(JSON.stringify(detail, null, 2))
      } else {
        setError(detail || 'Something went wrong. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Algo Backtest Engine</h1>
          <p className="text-gray-400 mt-1">Test your trading strategies against historical data</p>
        </div>

        <ConfigForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 rounded-xl p-4 mb-8 whitespace-pre-wrap">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-400 animate-pulse">
            Running backtest...
          </div>
        )}

        {result && !loading && (
          <>
            <MetricsCard
              metrics={result.metrics}
              benchmarkReturn={result.benchmark_return}
              symbolBuyholdReturn={result.symbol_buyhold_return}
              symbol={currentSymbol}
            />
            <EquityChart data={result.equity_curve} />
            <TradeLog trades={result.trades} />
          </>
        )}
      </div>
    </div>
  )
}