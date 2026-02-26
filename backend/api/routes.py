from fastapi import APIRouter
from pydantic import BaseModel
from data.fetcher import fetch_ohlcv
from strategies.moving_average import MovingAverageCrossover
from engine.backtester import run_backtest
from engine.metrics import calculate_metrics

router = APIRouter()

class BacktestRequest(BaseModel):
    symbol: str
    start_date: str
    end_date: str
    short_window: int
    long_window: int
    ma_type: str = "SMA"
    initial_capital: float = 10000
    risk_per_trade: float = 100
    commission_pct: float = 0.1
    stop_loss_pct: float | None = None
    take_profit_pct: float | None = None

@router.post("/backtest")
def backtest(req: BacktestRequest):
    df = fetch_ohlcv(req.symbol, req.start_date, req.end_date)
    
    strategy = MovingAverageCrossover(req.short_window, req.long_window, req.ma_type)
    df = strategy.generate_signals(df)
    
    result = run_backtest(
        df,
        initial_capital=req.initial_capital,
        risk_per_trade=req.risk_per_trade,
        commission_pct=req.commission_pct,
        stop_loss_pct=req.stop_loss_pct,
        take_profit_pct=req.take_profit_pct
    )
    
    metrics = calculate_metrics(result["equity_curve"], req.initial_capital)
    
    return {
        "metrics": metrics,
        "equity_curve": result["equity_curve"],
        "trades": result["trades"]
    }