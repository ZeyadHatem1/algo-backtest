import pandas as pd
from engine.position import Position

def run_backtest(df: pd.DataFrame, initial_capital: float, risk_per_trade: float,
                 commission_pct: float = 0.1, stop_loss_pct: float = None,
                 take_profit_pct: float = None) -> dict:

    capital = initial_capital
    position = None
    current_trade = None
    trades = []
    equity_curve = []

    for date, row in df.iterrows():
        price = row["close"]
        signal = row["signal"]

        # Check exit conditions if in a trade
        if position and current_trade:
            exit_reason = None
            if position.should_stop_loss(price):
                exit_reason = "stop_loss"
            elif position.should_take_profit(price):
                exit_reason = "take_profit"
            elif signal == -1:
                exit_reason = "signal"

            if exit_reason:
                proceeds = position.current_value(price)
                commission = proceeds * (commission_pct / 100)
                capital += proceeds - commission
                current_trade["exit_date"] = str(date)
                current_trade["exit_price"] = round(price, 2)
                current_trade["pnl"] = round(proceeds - (position.entry_price * position.shares), 2)
                current_trade["reason"] = exit_reason
                trades.append(current_trade)
                position = None
                current_trade = None

        # Check entry condition
        if signal == 1 and position is None:
            amount_to_invest = capital * (risk_per_trade / 100)
            commission = amount_to_invest * (commission_pct / 100)
            amount_after_commission = amount_to_invest - commission
            shares = amount_after_commission / price
            capital -= amount_to_invest
            position = Position(price, shares, stop_loss_pct, take_profit_pct)
            current_trade = {
                "entry_date": str(date),
                "entry_price": round(price, 2),
                "shares": round(shares, 4)
            }

        portfolio_value = capital + (position.current_value(price) if position else 0)
        equity_curve.append({"date": str(date), "value": round(portfolio_value, 2)})

    return {"trades": trades, "equity_curve": equity_curve, "final_capital": round(capital, 2)}