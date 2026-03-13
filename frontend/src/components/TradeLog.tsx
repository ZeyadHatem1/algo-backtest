import { Trade } from '../types'

const C = {
  accent: '#fbbf24',
  card: '#120f08',
  border: '#2a2010',
  label: '#d4a96a',
  positive: '#fbbf24',
  negative: '#f87171',
  text: '#fef9f0',
  muted: '#78716c',
  rowHover: '#1a1208',
}

interface Props {
  trades: Trade[]
}

export default function TradeLog({ trades }: Props) {
  const completed = trades.filter(t => t.exit_price !== undefined)
  const winners = completed.filter(t => (t.pnl ?? 0) > 0).length
  const winRate = completed.length > 0 ? ((winners / completed.length) * 100).toFixed(0) : '0'
  const totalPnl = completed.reduce((sum, t) => sum + (t.pnl ?? 0), 0)

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: C.accent, letterSpacing: '0.15em' }}>TRADE LOG</span>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: C.label }}>
            TRADES <span style={{ color: C.text }}>{completed.length}</span>
          </span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: C.label }}>
            WIN RATE <span style={{ color: C.accent }}>{winRate}%</span>
          </span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: C.label }}>
            NET P&L <span style={{ color: totalPnl >= 0 ? C.positive : C.negative }}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)}
            </span>
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['ENTRY DATE', 'ENTRY $', 'EXIT DATE', 'EXIT $', 'P&L', 'REASON'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: C.label, fontSize: 10, letterSpacing: '0.1em', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completed.map((trade, i) => {
              const pnl = trade.pnl ?? 0
              return (
                <tr key={i} style={{ borderBottom: `1px solid #120f08`, transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.rowHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <td style={{ padding: '10px 12px', color: C.muted }}>{trade.entry_date?.slice(0, 10)}</td>
                  <td style={{ padding: '10px 12px', color: C.text }}>${trade.entry_price?.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px', color: C.muted }}>{trade.exit_date?.slice(0, 10)}</td>
                  <td style={{ padding: '10px 12px', color: C.text }}>${trade.exit_price?.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px', color: pnl >= 0 ? C.positive : C.negative, fontWeight: 600 }}>
                    {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px 12px', color: C.label, textTransform: 'uppercase', fontSize: 10 }}>{trade.reason}</td>
                </tr>
              )
            })}
            {completed.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: C.border, fontSize: 11, letterSpacing: '0.1em' }}>
                  NO COMPLETED TRADES
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}