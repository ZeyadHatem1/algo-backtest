import { Metrics } from '../types'

interface Props {
  metrics: Metrics
  benchmarkReturn: number | null
  symbolBuyholdReturn: number | null
  symbol: string
}

export default function MetricsCard({ metrics, benchmarkReturn, symbolBuyholdReturn, symbol }: Props) {
  const cards = [
    {
      label: "Total Return",
      value: `${metrics.total_return_pct}%`,
      sub: null,
      color: metrics.total_return_pct >= 0 ? "text-green-400" : "text-red-400"
    },
    {
      label: "vs SPY (Buy & Hold)",
      value: benchmarkReturn != null ? `${benchmarkReturn}%` : "N/A",
      sub: benchmarkReturn != null
        ? metrics.total_return_pct >= benchmarkReturn
          ? `+${(metrics.total_return_pct - benchmarkReturn).toFixed(2)}% outperformance`
          : `${(metrics.total_return_pct - benchmarkReturn).toFixed(2)}% underperformance`
        : null,
      color: benchmarkReturn != null && metrics.total_return_pct >= benchmarkReturn
        ? "text-green-400" : "text-red-400"
    },
    {
      label: `vs ${symbol} (Buy & Hold)`,
      value: symbolBuyholdReturn != null ? `${symbolBuyholdReturn}%` : "N/A",
      sub: symbolBuyholdReturn != null
        ? metrics.total_return_pct >= symbolBuyholdReturn
          ? `+${(metrics.total_return_pct - symbolBuyholdReturn).toFixed(2)}% outperformance`
          : `${(metrics.total_return_pct - symbolBuyholdReturn).toFixed(2)}% underperformance`
        : null,
      color: symbolBuyholdReturn != null && metrics.total_return_pct >= symbolBuyholdReturn
        ? "text-green-400" : "text-red-400"
    },
    {
      label: "Sharpe Ratio",
      value: metrics.sharpe_ratio.toFixed(2),
      sub: null,
      color: metrics.sharpe_ratio >= 1 ? "text-green-400" : metrics.sharpe_ratio >= 0 ? "text-yellow-400" : "text-red-400"
    },
    {
      label: "Max Drawdown",
      value: `${metrics.max_drawdown_pct}%`,
      sub: null,
      color: "text-red-400"
    },
    {
      label: "Final Value",
      value: `$${metrics.final_value.toLocaleString()}`,
      sub: null,
      color: "text-white"
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          {card.sub && (
            <p className={`text-xs mt-1 ${card.color}`}>{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}