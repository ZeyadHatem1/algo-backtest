import { Metrics } from '../types'

interface Props {
  metrics: Metrics
  benchmarkReturn: number | null
  symbolBuyholdReturn: number | null
  symbol: string
}

const C = {
  accent: '#fbbf24',
  positive: '#fbbf24',
  negative: '#f87171',
  card: '#120f08',
  border: '#2a2010',
  label: '#d4a96a',
  text: '#fef9f0',
}

function valueFontSize(value: string) {
  if (value.length >= 16) return 16
  if (value.length >= 13) return 18
  return 22
}

export default function MetricsCard({ metrics, benchmarkReturn, symbolBuyholdReturn, symbol }: Props) {
  const cards = [
    {
      label: 'TOTAL RETURN',
      value: `${metrics.total_return_pct}%`,
      sub: null,
      positive: metrics.total_return_pct >= 0
    },
    {
      label: 'VS SPY B&H',
      value: benchmarkReturn != null ? `${benchmarkReturn}%` : 'N/A',
      sub: benchmarkReturn != null
        ? `${metrics.total_return_pct >= benchmarkReturn ? '+' : ''}${(metrics.total_return_pct - benchmarkReturn).toFixed(2)}% ${metrics.total_return_pct >= benchmarkReturn ? 'OUTPERFORM' : 'UNDERPERFORM'}`
        : null,
      positive: benchmarkReturn != null && metrics.total_return_pct >= benchmarkReturn
    },
    {
      label: `VS ${symbol} B&H`,
      value: symbolBuyholdReturn != null ? `${symbolBuyholdReturn}%` : 'N/A',
      sub: symbolBuyholdReturn != null
        ? `${metrics.total_return_pct >= symbolBuyholdReturn ? '+' : ''}${(metrics.total_return_pct - symbolBuyholdReturn).toFixed(2)}% ${metrics.total_return_pct >= symbolBuyholdReturn ? 'OUTPERFORM' : 'UNDERPERFORM'}`
        : null,
      positive: symbolBuyholdReturn != null && metrics.total_return_pct >= symbolBuyholdReturn
    },
    {
      label: 'SHARPE RATIO',
      value: metrics.sharpe_ratio.toFixed(2),
      sub: metrics.sharpe_ratio >= 1 ? 'GOOD' : metrics.sharpe_ratio >= 0 ? 'FAIR' : 'POOR',
      positive: metrics.sharpe_ratio >= 1
    },
    {
      label: 'MAX DRAWDOWN',
      value: `${metrics.max_drawdown_pct}%`,
      sub: null,
      positive: false
    },
    {
      label: 'FINAL VALUE',
      value: `$${metrics.final_value.toLocaleString()}`,
      sub: null,
      positive: true,
      valueStyle: { fontSize: valueFontSize(`$${metrics.final_value.toLocaleString()}`), wordBreak: 'break-word' as const }
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
      {cards.map((card) => (
        <div key={card.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 'clamp(10px, 3vw, 11px)', color: C.label, letterSpacing: '0.12em', marginBottom: 8 }}>
            {card.label}
          </div>
          <div style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: card.valueStyle?.fontSize ?? 22,
            fontWeight: 600,
            color: card.positive ? C.positive : C.negative,
            lineHeight: 1,
            wordBreak: card.valueStyle?.wordBreak,
          }}>
            {card.value}
          </div>
          {card.sub && (
            <div style={{
              fontFamily: 'IBM Plex Mono', fontSize: 'clamp(10px, 3vw, 11px)',
              color: card.positive ? '#92610a' : '#7a2d2d',
              background: card.positive ? 'rgba(41,33,0,0.6)' : 'rgba(58,26,26,0.6)',
              borderRadius: 3, padding: '3px 6px', marginTop: 8,
              letterSpacing: '0.05em', display: 'inline-block'
            }}>
              {card.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
