from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from data.fetcher import fetch_ohlcv
from strategies.moving_average import MovingAverageCrossover
from strategies.rsi import RSIStrategy
from strategies.bollinger_bands import BollingerBandsStrategy
from strategies.macd import MACDStrategy
from engine.backtester import run_backtest
from engine.metrics import calculate_metrics

router = APIRouter()

class BacktestRequest(BaseModel):
    symbol: str
    start_date: str
    end_date: str
    strategy: str = "ma_crossover"
    initial_capital: float = 10000
    risk_per_trade: float = 100
    commission_pct: float = 0.1
    stop_loss_pct: Optional[float] = None
    take_profit_pct: Optional[float] = None
    short_window: Optional[int] = 20
    long_window: Optional[int] = 50
    ma_type: Optional[str] = "SMA"
    rsi_period: Optional[int] = 14
    rsi_oversold: Optional[float] = 30
    rsi_overbought: Optional[float] = 70
    bb_period: Optional[int] = 20
    bb_num_std: Optional[float] = 2.0
    macd_fast: Optional[int] = 12
    macd_slow: Optional[int] = 26
    macd_signal: Optional[int] = 9


def get_strategy(req: BacktestRequest):
    if req.strategy == "ma_crossover":
        return MovingAverageCrossover(req.short_window, req.long_window, req.ma_type)
    elif req.strategy == "rsi":
        return RSIStrategy(req.rsi_period, req.rsi_oversold, req.rsi_overbought)
    elif req.strategy == "bollinger_bands":
        return BollingerBandsStrategy(req.bb_period, req.bb_num_std)
    elif req.strategy == "macd":
        return MACDStrategy(req.macd_fast, req.macd_slow, req.macd_signal)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown strategy: {req.strategy}")


@router.post("/backtest")
def backtest(req: BacktestRequest):
    df = fetch_ohlcv(req.symbol, req.start_date, req.end_date)
    strategy = get_strategy(req)
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

    benchmark_return = None
    symbol_buyhold_return = None

    try:
        bdf = fetch_ohlcv("SPY", req.start_date, req.end_date)
        benchmark_return = round((bdf["close"].iloc[-1] - bdf["close"].iloc[0]) / bdf["close"].iloc[0] * 100, 2)
    except Exception:
        pass

    try:
        sdf = fetch_ohlcv(req.symbol, req.start_date, req.end_date)
        symbol_buyhold_return = round((sdf["close"].iloc[-1] - sdf["close"].iloc[0]) / sdf["close"].iloc[0] * 100, 2)
    except Exception:
        pass

    return {
        "metrics": metrics,
        "equity_curve": result["equity_curve"],
        "trades": result["trades"],
        "benchmark_return": benchmark_return,
        "symbol_buyhold_return": symbol_buyhold_return
    }