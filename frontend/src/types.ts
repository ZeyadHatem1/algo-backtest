export interface BacktestRequest {
  symbol: string
  start_date: string
  end_date: string
  short_window: number
  long_window: number
  ma_type: string
  initial_capital: number
  risk_per_trade: number
  commission_pct: number
  stop_loss_pct: number | null
  take_profit_pct: number | null
}

export interface Metrics {
  total_return_pct: number
  sharpe_ratio: number
  max_drawdown_pct: number
  final_value: number
}

export interface EquityPoint {
  date: string
  value: number
}

export interface Trade {
  entry_date: string
  entry_price: number
  shares: number
  exit_date?: string
  exit_price?: number
  pnl?: number
  reason?: string
}

export interface BacktestResponse {
  metrics: Metrics
  equity_curve: EquityPoint[]
  trades: Trade[]
}