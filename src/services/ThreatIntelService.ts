export interface ThreatAlert {
  id: string;
  type: 'phishing' | 'exploit' | 'scam' | 'slippage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  network: string;
  impactScore: number;
}

const MOCK_THREATS: ThreatAlert[] = [
  {
    id: '1',
    type: 'phishing',
    severity: 'critical',
    title: 'Uniswap Approval Phishing',
    description: 'A new malicious site is mimicking Uniswap to drain USDC approvals.',
    timestamp: '2 mins ago',
    network: 'Ethereum',
    impactScore: 95
  },
  {
    id: '2',
    type: 'exploit',
    severity: 'high',
    title: 'Curve Pool Imbalance',
    description: 'High volatility detected in CRV/ETH pool. Price manipulation risk.',
    timestamp: '15 mins ago',
    network: 'Ethereum',
    impactScore: 82
  },
  {
    id: '3',
    type: 'scam',
    severity: 'medium',
    title: 'ApeCoin Airdrop Scam',
    description: 'Fake claim portal asking for seed phrases. Do not interact.',
    timestamp: '1 hour ago',
    network: 'Polygon',
    impactScore: 64
  },
  {
    id: '4',
    type: 'slippage',
    severity: 'low',
    title: 'Network Congestion',
    description: 'Gas prices spiking on Base chain. High slippage expected.',
    timestamp: '3 hours ago',
    network: 'Base',
    impactScore: 35
  }
];

export const getLiveThreats = async (): Promise<ThreatAlert[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_THREATS;
};
