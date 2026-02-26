import { Metrics } from '../types'

interface Props {
  metrics: Metrics
}

export default function MetricsCard({ metrics }: Props) {
  const cards = [
    { label: "Total Return", value: `${metrics.total_return_pct}%`, color: metrics.total_return_pct >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Sharpe Ratio", value: metrics.sharpe_ratio.toFixed(2), color: "text-blue-400" },
    { label: "Max Drawdown", value: `${metrics.max_drawdown_pct}%`, color: "text-red-400" },
    { label: "Final Value", value: `$${metrics.final_value.toLocaleString()}`, color: "text-white" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}