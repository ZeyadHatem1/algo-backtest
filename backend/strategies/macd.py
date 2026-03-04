import pandas as pd
from .base import BaseStrategy

class MACDStrategy(BaseStrategy):
    def __init__(self, fast_period: int = 12, slow_period: int = 26, signal_period: int = 9):
        self.fast_period = fast_period
        self.slow_period = slow_period
        self.signal_period = signal_period

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        fast_ema = df["close"].ewm(span=self.fast_period, adjust=False).mean()
        slow_ema = df["close"].ewm(span=self.slow_period, adjust=False).mean()

        df["macd"] = fast_ema - slow_ema
        df["signal_line"] = df["macd"].ewm(span=self.signal_period, adjust=False).mean()
        df["histogram"] = df["macd"] - df["signal_line"]

        df["signal"] = 0
        buy = (df["macd"] > df["signal_line"]) & (df["macd"].shift(1) <= df["signal_line"].shift(1))
        sell = (df["macd"] < df["signal_line"]) & (df["macd"].shift(1) >= df["signal_line"].shift(1))

        df.loc[buy, "signal"] = 1
        df.loc[sell, "signal"] = -1
        df.dropna(inplace=True)

        return df