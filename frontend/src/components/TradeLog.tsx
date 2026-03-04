import { Trade } from '../types'

interface Props {
  trades: Trade[]
}

export default function TradeLog({ trades }: Props) {
  const completedTrades = trades.filter(t => t.exit_price !== undefined)

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-white text-lg font-semibold mb-4">
        Trade Log
        <span className="ml-2 text-sm text-gray-400 font-normal">
          {completedTrades.length} completed trades
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 pr-4">Entry Date</th>
              <th className="text-left py-2 pr-4">Entry Price</th>
              <th className="text-left py-2 pr-4">Exit Date</th>
              <th className="text-left py-2 pr-4">Exit Price</th>
              <th className="text-left py-2 pr-4">PnL</th>
              <th className="text-left py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {completedTrades.map((trade, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="py-2 pr-4 text-gray-300">{trade.entry_date?.slice(0, 10)}</td>
                <td className="py-2 pr-4 text-gray-300">${trade.entry_price?.toFixed(2)}</td>
                <td className="py-2 pr-4 text-gray-300">{trade.exit_date?.slice(0, 10)}</td>
                <td className="py-2 pr-4 text-gray-300">${trade.exit_price?.toFixed(2)}</td>
                <td className={`py-2 pr-4 font-semibold ${(trade.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(trade.pnl ?? 0) >= 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                </td>
                <td className="py-2 text-gray-400 capitalize">{trade.reason}</td>
              </tr>
            ))}
            {completedTrades.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No completed trades
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}