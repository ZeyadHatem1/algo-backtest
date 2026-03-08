import { BacktestResponse, StrategyType } from '../types'

interface StrategyRun {
  strategy: StrategyType
  result: BacktestResponse
}

interface Props {
  runs: StrategyRun[]
  labels: Record<StrategyType, string>
}

export default function StrategyComparison({ runs, labels }: Props) {
  if (runs.length <= 1) return null

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
      <h2 className="text-white text-lg font-semibold mb-4">Side-by-Side Strategy Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="text-left py-2 pr-4">Strategy</th>
              <th className="text-left py-2 pr-4">Total Return</th>
              <th className="text-left py-2 pr-4">Sharpe Ratio</th>
              <th className="text-left py-2 pr-4">Max Drawdown</th>
              <th className="text-left py-2 pr-4">Final Value</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(({ strategy, result }) => {
              const m = result.metrics
              return (
                <tr key={strategy} className="border-b border-gray-800 text-gray-200">
                  <td className="py-3 pr-4 font-medium text-white">{labels[strategy]}</td>
                  <td className={`py-3 pr-4 ${m.total_return_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {m.total_return_pct}%
                  </td>
                  <td className="py-3 pr-4">{m.sharpe_ratio.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-red-400">{m.max_drawdown_pct}%</td>
                  <td className="py-3 pr-4">${m.final_value.toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
