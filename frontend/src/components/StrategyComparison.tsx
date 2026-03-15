import { BacktestResponse, StrategyType } from '../types'

interface StrategyRun {
  strategy: StrategyType
  result: BacktestResponse
}

interface Props {
  runs: StrategyRun[]
  labels: Record<StrategyType, string>
}

const C = {
  accent: '#fbbf24',
  card: '#120f08',
  border: '#2a2010',
  label: '#d4a96a',
  text: '#fef9f0',
  muted: '#78716c',
  good: '#4ade80',
  bad: '#f87171',
}

export default function StrategyComparison({ runs, labels }: Props) {
  if (runs.length <= 1) return null

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: C.accent, letterSpacing: '0.15em', marginBottom: 16 }}>
        STRATEGY COMPARISON
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 640 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 12,
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: 8,
            marginBottom: 8,
            fontFamily: 'IBM Plex Mono',
            fontSize: 10,
            letterSpacing: '0.12em',
            color: C.label,
          }}>
            <div>STRATEGY</div>
            <div>TOTAL RETURN</div>
            <div>SHARPE</div>
            <div>MAX DD</div>
            <div>FINAL VALUE</div>
          </div>
          {runs.map(({ strategy, result }) => {
            const m = result.metrics
            return (
              <div
                key={strategy}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: `1px solid ${C.border}`,
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 12,
                  color: C.text,
                }}
              >
                <div style={{ fontWeight: 600 }}>{labels[strategy]}</div>
                <div style={{ color: m.total_return_pct >= 0 ? C.good : C.bad }}>{m.total_return_pct}%</div>
                <div>{m.sharpe_ratio.toFixed(2)}</div>
                <div style={{ color: C.bad }}>{m.max_drawdown_pct}%</div>
                <div>${m.final_value.toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ marginTop: 8, fontFamily: 'IBM Plex Mono', fontSize: 10, color: C.muted, letterSpacing: '0.08em' }}>
        COMPARING SELECTED STRATEGIES ON THE SAME SYMBOL AND DATE RANGE
      </div>
    </div>
  )
}
