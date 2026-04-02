export interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  price: string;
  score: number;
  icon: string;
  contractAddress?: string;
  isCustom?: boolean;
}
