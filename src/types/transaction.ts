export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  asset: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  txHash: string;
}
