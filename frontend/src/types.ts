export type StrategyType = 'ma_crossover' | 'rsi' | 'bollinger_bands' | 'macd'

export interface BacktestRequest {
  symbol: string
  start_date: string
  end_date: string
  strategy: StrategyType
  compare_strategies?: StrategyType[]
  initial_capital: number
  risk_per_trade: number
  commission_pct: number
  stop_loss_pct: number | null
  take_profit_pct: number | null
  short_window: number
  long_window: number
  ma_type: string
  rsi_period: number
  rsi_oversold: number
  rsi_overbought: number
  bb_period: number
  bb_num_std: number
  macd_fast: number
  macd_slow: number
  macd_signal: number
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
  entry_date?: string
  entry_price?: number
  shares?: number
  exit_date?: string
  exit_price?: number
  pnl?: number
  reason?: string
}

export interface BacktestResponse {
  metrics: Metrics
  equity_curve: EquityPoint[]
  trades: Trade[]
  benchmark_return: number | null
  symbol_buyhold_return: number | null
}
