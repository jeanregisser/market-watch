import { AssetPair } from 'src/types';

const CURRENCY_SYMBOLS: Record<string, string> = {
  XETH: 'Ξ',
  XXBT: '₿',
  ZCAD: 'C$',
  ZEUR: '€',
  ZGBP: '£',
  ZJPY: '¥',
  ZUSD: '$',
};

export function formatPrice(price: string | number, assetPair: AssetPair) {
  const currencySymbol = CURRENCY_SYMBOLS[assetPair.quote] || '';
  return `${currencySymbol}${price}`;
}
