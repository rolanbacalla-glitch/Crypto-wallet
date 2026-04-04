export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  logo: string;
}

export const TOP_10_ASSETS: Asset[] = [
  { 
    id: 'bitcoin', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    price: 66324.50, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png' 
  },
  { 
    id: 'ethereum', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    price: 3542.12, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' 
  },
  { 
    id: 'tether', 
    name: 'Tether USD', 
    symbol: 'USDT', 
    price: 1.00, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' 
  },
  { 
    id: 'bnb', 
    name: 'BNB', 
    symbol: 'BNB', 
    price: 585.34, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png' 
  },
  { 
    id: 'solana', 
    name: 'Solana', 
    symbol: 'SOL', 
    price: 145.67, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' 
  },
  { 
    id: 'usdc', 
    name: 'USDC Coin', 
    symbol: 'USDC', 
    price: 1.00, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' 
  },
  { 
    id: 'xrp', 
    name: 'XRP', 
    symbol: 'XRP', 
    price: 0.528, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xrp/info/logo.png' 
  },
  { 
    id: 'dogecoin', 
    name: 'Dogecoin', 
    symbol: 'DOGE', 
    price: 0.154, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png' 
  },
  { 
    id: 'cardano', 
    name: 'Cardano', 
    symbol: 'ADA', 
    price: 0.457, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png' 
  },
  { 
    id: 'avalanche', 
    name: 'Avalanche', 
    symbol: 'AVAX', 
    price: 36.89, 
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png' 
  }
];
