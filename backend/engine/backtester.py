import pandas as pd
from engine.position import Position

def run_backtest(df: pd.DataFrame, initial_capital: float, risk_per_trade: float,
                 commission_pct: float = 0.1, stop_loss_pct: float = None,
                 take_profit_pct: float = None) -> dict:

    capital = initial_capital
    position = None
    trades = []
    equity_curve = []

    for i, (date, row) in enumerate(df.iterrows()):
        price = row["close"]
        signal = row["signal"]

        # Check exit conditions if in a trade
        if position:
            exit_reason = None
            if position.should_stop_loss(price):
                exit_reason = "stop loss"
            elif position.should_take_profit(price):
                exit_reason = "take profit"
            elif signal == -1:
                exit_reason = "signal"

            if exit_reason:
                proceeds = position.current_value(price)
                commission = proceeds * (commission_pct / 100)
                capital += proceeds - commission
                trades.append({
                    "exit date": str(date),
                    "exit price": price,
                    "pnl": proceeds - (position.entry_price * position.shares),
                    "reason": exit_reason
                })
                position = None

        
        if signal == 1 and position is None:
            amount_to_invest = capital * (risk_per_trade / 100)
            commission = amount_to_invest * (commission_pct / 100)
            amount_after_commission = amount_to_invest - commission
            shares = amount_after_commission / price
            capital -= amount_to_invest
            position = Position(price, shares, stop_loss_pct, take_profit_pct)
            trades[-1 if trades else 0] if trades else None
            trades.append({"entry_date": str(date), "entry_price": price, "shares": shares})

        portfolio_value = capital + (position.current_value(price) if position else 0)
        equity_curve.append({"date": str(date), "value": portfolio_value})

    return {"trades": trades, "equity curve": equity_curve, "final capital": capital}