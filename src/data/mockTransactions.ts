export interface TransactionData {
  id: string;
  name: string;
  type: 'swap' | 'transfer' | 'approval' | 'nft_approval' | 'bridge_transfer';
  asset: string;
  amount: string;
  recipient: string;
  contractAddress?: string;
  calldata?: string;
  value?: string;
  simulationResult: 'success' | 'failure';
  isUnlimitedApproval?: boolean;
  isNewAddress?: boolean;
  nftDetails?: {
    name: string;
    imageUrl: string;
    collection: string;
  };
  bridgeDetails?: {
    destinationChain: string;
    estimatedTime: string;
  };
}


export const mockTransactions: TransactionData[] = [
  {
    id: 'tx-1',
    name: 'Safe Swap (Uniswap)',
    type: 'swap',
    asset: 'ETH',
    amount: '1.2',
    recipient: 'Uniswap V3 Router',
    contractAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    calldata: '0x3593564c0000000000000000000000000000000000000000000000000000000000000001',
    value: '0xde0b6b3a7640000', // 1 ETH
    simulationResult: 'success',
  },
  {
    id: 'tx-2',
    name: 'Unlimited Approval (USDC)',
    type: 'approval',
    asset: 'USDC',
    amount: 'Unlimited',
    recipient: 'Unknown DApp',
    contractAddress: '0xMaliciousContract123...',
    calldata: '0x095ea7b3000000000000000000000000MaliciousContract123ffffffffffffffffffff',
    simulationResult: 'success',
    isUnlimitedApproval: true,
  },
  {
    id: 'tx-3',
    name: 'Transfer to New Address',
    type: 'transfer',
    asset: 'WBTC',
    amount: '0.05',
    recipient: '0xNewAccount...',
    simulationResult: 'success',
    isNewAddress: true,
  },
  {
    id: 'tx-4',
    name: 'Malicious Swap (Reverts)',
    type: 'swap',
    asset: 'ETH',
    amount: '10.0',
    recipient: 'Suspicious Router',
    contractAddress: '0xBadF00d...',
    calldata: '0x5f575529000000000000000000000000000000000000000000000000000000000000000a',
    simulationResult: 'failure',
  },
  {
    id: 'tx-5',
    name: 'Address Poisoning Attempt',
    type: 'transfer',
    asset: 'ETH',
    amount: '0.1',
    recipient: '0xd8dA6BF26964aFAAAAAe03E53415D37aA96045', // Poisoning: matching start/end of Vitalik's address
    simulationResult: 'success',
  },
  {
    id: 'tx-6',
    name: 'Verified Uniswap Add Liquidity',
    type: 'swap',
    asset: 'ETH/USDC',
    amount: 'Pool Share',
    recipient: 'Uniswap V3 Router',
    contractAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    simulationResult: 'success',
  },
  {
    id: 'tx-7',
    name: 'Transfer to Phishing Scammer',
    type: 'transfer',
    asset: 'ETH',
    amount: '1.5',
    recipient: 'Phishing Scammer',
    contractAddress: '0xBadF00d000000000000000000000000000000000',
    simulationResult: 'success',
  },
  {
    id: 'tx-high-slippage',
    name: 'High Slippage Swap (Expert)',
    type: 'swap',
    asset: 'USDC/PEPE',
    amount: '12,500 USDC',
    recipient: 'Uniswap V3 Router',
    contractAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    simulationResult: 'success',
  },
  {
    id: 'tx-unaudited',
    name: 'New Farm (Unaudited)',
    type: 'swap',
    asset: 'ETH',
    amount: '2.5',
    recipient: 'Mysterious Farm Router',
    contractAddress: '0xUnknownFarm123...',
    simulationResult: 'success',
  }
];



