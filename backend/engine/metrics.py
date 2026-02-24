import pandas as pd
import numpy as np

def calculate_metrics(equity_curve: list, initial_capital: float) -> dict:
    values = pd.Series([e["value"] for e in equity_curve])
    
    total_return = (values.iloc[-1] - initial_capital) / initial_capital * 100
    
    daily_returns = values.pct_change().dropna()
    sharpe = (daily_returns.mean() / daily_returns.std()) * np.sqrt(252) if daily_returns.std() != 0 else 0
    
    rolling_max = values.cummax()
    drawdown = (values - rolling_max) / rolling_max
    max_drawdown = drawdown.min() * 100

    return {
        "total_return_pct": round(total_return, 2),
        "sharpe_ratio": round(sharpe, 2),
        "max_drawdown_pct": round(max_drawdown, 2),
        "final_value": round(values.iloc[-1], 2)
    }