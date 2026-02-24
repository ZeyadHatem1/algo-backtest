from abc import ABC, abstractmethod
import pandas as pd

class BaseStrategy(ABC):
    @abstractmethod
    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Takes OHLCV dataframe, returns same dataframe
        with a 'signal' column: 1=buy, -1=sell, 0=hold
        """
        pass