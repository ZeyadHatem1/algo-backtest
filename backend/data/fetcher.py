import yfinance as yf
import pandas as pd

def fetch_ohlcv(symbol: str, start: str, end: str) -> pd.DataFrame:
    df = yf.download(symbol, start=start, end=end, auto_adjust=True)
    
    if df.empty:
        raise ValueError(f"No data returned for {symbol}")
    
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df[["Open", "High", "Low", "Close", "Volume"]]
    df.columns = ["open", "high", "low", "close", "volume"]
    df.index.name = "date"
    df.dropna(inplace=True)
    
    return df

if __name__ == "__main__":
    data = fetch_ohlcv("NVDA", "2022-01-01", "2024-01-01")
    print(data.head())
    print(f"Shape: {data.shape}")