import pandas as pd
from .base import BaseStrategy

class RSIStrategy(BaseStrategy):
    def __init__(self, period:int=14,oversold:float=30,overbought:float=70):
        self.period=period
        self.oversold=oversold
        self.overbought=overbought

    def calculate_rsi(self, series:pd.Series) -> pd.Series:
        delta = series.diff()
        gain = delta.where(delta>0,0)
        loss=-delta.where(delta<0,0)
        avg_gain=gain.ewm(span=self.period,adjust=False).mean()
        avg_loss=loss.ewm(span=self.period,adjust=False).mean()
        rs=avg_gain/avg_loss
        return 100-(100/(1+rs))
    
    def generate_signals(self, df:pd.DataFrame) -> pd.DataFrame:
        df=df.copy()
        df['rsi']=self.calculate_rsi(df['close'])
        df['signal']=0
        buy=(df['rsi']<self.oversold)&(df['rsi'].shift(1)>=self.oversold)
        sell=(df['rsi']>self.overbought)&(df['rsi'].shift(1)<=self.overbought)

        df.loc[buy,"signal"]=1
        df.loc[sell,"signal"]=-1
        df.dropna(inplace=True)

        return df 