import pandas as pd
from .base import BaseStrategy

class MovingAverageCrossover(BaseStrategy):
    def __init__(self, short_window: int, long_window: int, ma_type: str = "SMA"):
        self.short_window = short_window
        self.long_window = long_window
        self.ma_type = ma_type.upper()

    def _calculate_ma(self, series: pd.Series, window: int) -> pd.Series:
        if self.ma_type == "EMA":
            return series.ewm(span=window, adjust=False).mean()
        return series.rolling(window=window).mean()

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["fast_ma"] = self._calculate_ma(df["close"], self.short_window)
        df["slow_ma"] = self._calculate_ma(df["close"], self.long_window)

        df["signal"] = 0
        # Crossover: today fast>slow but yesterday fast<=slow = buy
        buy = (df["fast_ma"] > df["slow_ma"]) & (df["fast_ma"].shift(1) <= df["slow_ma"].shift(1))
        sell = (df["fast_ma"] < df["slow_ma"]) & (df["fast_ma"].shift(1) >= df["slow_ma"].shift(1))

        df.loc[buy, "signal"] = 1
        df.loc[sell, "signal"] = -1
        df.dropna(inplace=True)

        return df