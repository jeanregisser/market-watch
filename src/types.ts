export interface AssetPair {
  id: string;
  title: string;
  quote: string;
}

export interface Ticker {
  id: string;
  price: string;
}

export interface Trade {
  price: string;
  volume: string;
  time: number;
}

export interface Spread {
  bidPrice: string;
  askPrice: string;
  time: number;
}
