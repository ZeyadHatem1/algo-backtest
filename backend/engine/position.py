class Position:
    def __init__(self, entry_price: float, shares: float, stop_loss_pct: float = None, take_profit_pct: float = None):
        self.entry_price = entry_price
        self.shares = shares
        self.stop_loss = entry_price * (1 - stop_loss_pct / 100) if stop_loss_pct else None
        self.take_profit = entry_price * (1 + take_profit_pct / 100) if take_profit_pct else None

    def current_value(self, price: float) -> float:
        return self.shares * price

    def should_stop_loss(self, price: float) -> bool:
        return self.stop_loss is not None and price <= self.stop_loss

    def should_take_profit(self, price: float) -> bool:
        return self.take_profit is not None and price >= self.take_profit