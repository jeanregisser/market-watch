export interface AssetPair {
  id: string;
  title: string;
  quote: string;
}

export interface Ticker {
  id: string;
  price: string;
}

enum TradeOrder {
  Buy = 'b',
  Sell = 's',
}

export interface Trade {
  price: string;
  volume: string;
  time: number;
  order: TradeOrder;
}

export interface Spread {
  bidPrice: string;
  askPrice: string;
  time: number;
}
