import pandas as pd
from .base import BaseStrategy

class BollingerBandsStrategy(BaseStrategy):
    def __init__(self, period: int = 20, num_std: float = 2.0):
        self.period = period
        self.num_std = num_std

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["mid"] = df["close"].rolling(window=self.period).mean()
        df["std"] = df["close"].rolling(window=self.period).std()
        df["upper"] = df["mid"] + self.num_std * df["std"]
        df["lower"] = df["mid"] - self.num_std * df["std"]

        df["signal"] = 0
        buy = (df["close"] < df["lower"]) & (df["close"].shift(1) >= df["lower"].shift(1))
        sell = (df["close"] > df["upper"]) & (df["close"].shift(1) <= df["upper"].shift(1))

        df.loc[buy, "signal"] = 1
        df.loc[sell, "signal"] = -1
        df.dropna(inplace=True)

        return df