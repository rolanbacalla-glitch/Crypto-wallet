import type {
  CurrencyCode,
  NetworkConfig,
  NetworkId,
  SendPreset,
  SwapScenarioPreset,
  TokenApproval,
  TokenAsset,
  TransactionRecord,
  VaultSettings,
} from '../types/wallet';

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    chainId: 1,
    baseFeeGwei: 14.2,
    priorityFeeGwei: 1.5,
    explorerBase: 'https://etherscan.io/tx/',
    accentHex: '#627EEA',
  },
  base: {
    id: 'base',
    name: 'Base',
    shortName: 'Base',
    chainId: 8453,
    baseFeeGwei: 0.04,
    priorityFeeGwei: 0.01,
    explorerBase: 'https://basescan.org/tx/',
    accentHex: '#2563EB',
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chainId: 42161,
    baseFeeGwei: 0.1,
    priorityFeeGwei: 0.02,
    explorerBase: 'https://arbiscan.io/tx/',
    accentHex: '#38BDF8',
  },
  optimism: {
    id: 'optimism',
    name: 'OP Mainnet',
    shortName: 'Optimism',
    chainId: 10,
    baseFeeGwei: 0.05,
    priorityFeeGwei: 0.01,
    explorerBase: 'https://optimistic.etherscan.io/tx/',
    accentHex: '#EF4444',
  },
};

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  GBP: { symbol: '£', rate: 0.79 },
  EUR: { symbol: '€', rate: 0.92 },
};

export const INITIAL_SETTINGS: VaultSettings = {
  currency: 'USD',
  dailySpendLimitUsd: 15000,
  defaultMevRelay: 'flashbots',
  requireRiskConfirmation: true,
  simulateBeforeSign: true,
  walletAddress: '0x7a2F94c8B13E4409d3812A1b299C88D73a1B8fE3',
  walletLabel: 'Primary Vault',
  ensName: 'rolan.nest.eth',
};

export const INITIAL_ASSETS: TokenAsset[] = [
  {
    id: 'eth-mainnet',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ethereum',
    balance: 18.45,
    priceUsd: 3240.0,
    change24hPct: 2.84,
    contractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    verified: true,
  },
  {
    id: 'usdc-mainnet',
    symbol: 'USDC',
    name: 'USD Coin',
    network: 'ethereum',
    balance: 24850.0,
    priceUsd: 1.0,
    change24hPct: 0.01,
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    verified: true,
  },
  {
    id: 'reth-mainnet',
    symbol: 'rETH',
    name: 'Rocket Pool ETH',
    network: 'ethereum',
    balance: 4.6,
    priceUsd: 3588.5,
    change24hPct: 2.91,
    contractAddress: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    verified: true,
    stakingApr: 3.4,
  },
  {
    id: 'wbtc-mainnet',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    network: 'ethereum',
    balance: 0.32,
    priceUsd: 91450.0,
    change24hPct: 1.42,
    contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    verified: true,
  },
  {
    id: 'usdc-base',
    symbol: 'USDC',
    name: 'USD Coin',
    network: 'base',
    balance: 8420.5,
    priceUsd: 1.0,
    change24hPct: 0.0,
    contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    verified: true,
  },
  {
    id: 'eth-base',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'base',
    balance: 2.15,
    priceUsd: 3240.0,
    change24hPct: 2.84,
    contractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    verified: true,
  },
  {
    id: 'arb-arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum',
    network: 'arbitrum',
    balance: 6200.0,
    priceUsd: 1.08,
    change24hPct: -1.65,
    contractAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    verified: true,
  },
  {
    id: 'uni-optimism',
    symbol: 'UNI',
    name: 'Uniswap',
    network: 'optimism',
    balance: 410.0,
    priceUsd: 11.45,
    change24hPct: 4.18,
    contractAddress: '0x6fd9d7AD17242c41f7131d257212c54A0e816691',
    verified: true,
  },
];

export const INITIAL_APPROVALS: TokenApproval[] = [
  {
    id: 'apr-1',
    tokenSymbol: 'USDC',
    tokenName: 'USD Coin',
    network: 'ethereum',
    spenderName: 'Legacy Yield Bridge v1',
    spenderAddress: '0x0000dEaD8819a2B4C914F7311eC9a2887bA4991F',
    allowanceLabel: 'Unlimited',
    exposureUsd: 24850.0,
    isUnlimited: true,
    riskLevel: 'critical',
    riskReason: 'Unverified proxy contract flagged in community exploit feed with unlimited USDC spend rights.',
    grantedAt: '41 days ago',
  },
  {
    id: 'apr-2',
    tokenSymbol: 'WBTC',
    tokenName: 'Wrapped Bitcoin',
    network: 'ethereum',
    spenderName: 'Uniswap Universal Router',
    spenderAddress: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    allowanceLabel: 'Unlimited',
    exposureUsd: 29264.0,
    isUnlimited: true,
    riskLevel: 'caution',
    riskReason: 'Verified Uniswap router, but allowance exceeds your typical swap size. Consider tightening or revoking.',
    grantedAt: '19 days ago',
  },
  {
    id: 'apr-3',
    tokenSymbol: 'USDC',
    tokenName: 'USD Coin',
    network: 'base',
    spenderName: 'Aerodrome Finance Router',
    spenderAddress: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
    allowanceLabel: '2,500.00 USDC',
    exposureUsd: 2500.0,
    isUnlimited: false,
    riskLevel: 'safe',
    riskReason: 'Exact capped allowance on audited router contract.',
    grantedAt: '4 days ago',
  },
  {
    id: 'apr-4',
    tokenSymbol: 'rETH',
    tokenName: 'Rocket Pool ETH',
    network: 'ethereum',
    spenderName: 'Aave V3 Pool',
    spenderAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    allowanceLabel: '4.60 rETH',
    exposureUsd: 16507.1,
    isUnlimited: false,
    riskLevel: 'safe',
    riskReason: 'Verified Aave V3 lending pool with bounded allowance.',
    grantedAt: '11 days ago',
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1001',
    type: 'swap',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    network: 'ethereum',
    title: 'Swapped USDC for ETH via Uniswap V3',
    counterparty: 'Uniswap V3 Router',
    counterpartyAddress: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    balanceDiffs: [
      { symbol: 'USDC', name: 'USD Coin', delta: -6480, usdValue: 6480, direction: 'out' },
      { symbol: 'ETH', name: 'Ethereum', delta: 2.0, usdValue: 6480, direction: 'in' },
    ],
    riskLevel: 'safe',
    riskSummary: 'Verified pool route · MEV protected via Flashbots Protect · 0.08% price impact.',
    gasCostUsd: 4.18,
    gasGwei: 15.7,
    mevProtected: true,
    txHash: '0x8c4f9b21d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f491a2',
    calldataMethod: 'exactInputSingle(ExactInputSingleParams)',
    calldataHex: '0x414bf389000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    id: 'tx-1002',
    type: 'send',
    status: 'blocked',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    network: 'ethereum',
    title: 'Blocked Address Poisoning Transfer',
    counterparty: 'Flagged Lookalike Address',
    counterpartyAddress: '0x7a2F000000000000000000000000000000008fE3',
    balanceDiffs: [
      { symbol: 'USDC', name: 'USD Coin', delta: -4200, usdValue: 4200, direction: 'out' },
    ],
    riskLevel: 'critical',
    riskSummary: 'Intercepted zero-value spoofing lookalike matching prefix 0x7a2F and suffix 8fE3.',
    gasCostUsd: 0,
    gasGwei: 14.5,
    mevProtected: true,
    txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    calldataMethod: 'transfer(address,uint256)',
    calldataHex: '0xa9059cbb0000000000000000000000007a2f000000000000000000000000000000008fe3',
  },
  {
    id: 'tx-1003',
    type: 'receive',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    network: 'base',
    title: 'Received USDC on Base',
    counterparty: 'Coinbase Settlement',
    counterpartyAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
    balanceDiffs: [
      { symbol: 'USDC', name: 'USD Coin', delta: 3500, usdValue: 3500, direction: 'in' },
    ],
    riskLevel: 'safe',
    riskSummary: 'Verified institutional sender on Base mainnet.',
    gasCostUsd: 0.01,
    gasGwei: 0.04,
    mevProtected: false,
    txHash: '0x3b71e9a4c8d1f2e3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d588e1',
    calldataMethod: 'transfer(address,uint256)',
    calldataHex: '0xa9059cbb0000000000000000000000007a2f94c8b13e4409d3812a1b299c88d73a1b8fe3',
  },
  {
    id: 'tx-1004',
    type: 'send',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    network: 'ethereum',
    title: 'Sent ETH to elena.eth',
    counterparty: 'elena.eth',
    counterpartyAddress: '0x51C72848c68a965f66FA7a88855F9f7784502a7F',
    balanceDiffs: [
      { symbol: 'ETH', name: 'Ethereum', delta: -0.75, usdValue: 2430, direction: 'out' },
    ],
    riskLevel: 'safe',
    riskSummary: 'Saved contact · Reverse ENS record verified · Within daily spend limit.',
    gasCostUsd: 1.92,
    gasGwei: 13.8,
    mevProtected: true,
    txHash: '0x7d12f4c890a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a512bc',
    calldataMethod: 'nativeTransfer()',
    calldataHex: '0x',
  },
];

export const SEND_PRESETS: SendPreset[] = [
  {
    id: 'preset-elena',
    label: 'elena.eth (Trusted Contact)',
    address: '0x51C72848c68a965f66FA7a88855F9f7784502a7F',
    category: 'trusted',
    description: 'Verified ENS contact with prior transfer history.',
  },
  {
    id: 'preset-cold',
    label: 'Hardware Cold Vault',
    address: '0x94c8E219a0B13490D772F38A102C441B99E18A12',
    category: 'trusted',
    description: 'Your saved 2-of-3 hardware cold storage address.',
  },
  {
    id: 'preset-new',
    label: 'New Unverified Recipient',
    address: '0x4B2190cA8712F3aE0091cB54d29910eA77129F04',
    category: 'unverified',
    description: 'Zero prior interactions; triggers first-time recipient caution.',
  },
  {
    id: 'preset-poison',
    label: 'Test Threat: Lookalike Poisoning',
    address: '0x7a2F000000000000000000000000000000008fE3',
    category: 'threat',
    description: 'Spoofs your vault prefix (0x7a2F) & suffix (8fE3) from dust logs.',
  },
  {
    id: 'preset-drainer',
    label: 'Test Threat: Known Drainer Contract',
    address: '0x0000dEaD8819a2B4C914F7311eC9a2887bA4991F',
    category: 'threat',
    description: 'Flagged contract linked to wallet-draining exploits.',
  },
];

export const SWAP_SCENARIOS: SwapScenarioPreset[] = [
  {
    id: 'swap-verified',
    label: 'Verified Uniswap V3 Swap',
    category: 'verified',
    description: 'Standard ETH to USDC swap routed with MEV protection.',
    fromTokenId: 'eth-mainnet',
    toTokenId: 'usdc-mainnet',
    amount: '1.5',
    venue: 'Uniswap V3 · 0.05% Pool',
  },
  {
    id: 'swap-high-impact',
    label: 'Test Caution: High Price Impact',
    category: 'caution',
    description: 'Thin liquidity route causing elevated 6.4% slippage risk.',
    fromTokenId: 'usdc-mainnet',
    toTokenId: 'reth-mainnet',
    amount: '18500',
    venue: 'Thin Liquidity Pool · 1.0% Fee',
    forcedPriceImpactPct: 6.42,
  },
  {
    id: 'swap-drainer',
    label: 'Test Threat: Unlimited Permit Trap',
    category: 'threat',
    description: 'Malicious router requesting hidden Permit2 sweep of all USDC.',
    fromTokenId: 'usdc-mainnet',
    toTokenId: 'eth-mainnet',
    amount: '2500',
    venue: 'Unverified Aggregator Proxy',
    maliciousContract: true,
  },
];

export const PORTFOLIO_HISTORY_SERIES: Record<'7D' | '30D' | '90D', number[]> = {
  '7D': [139400, 141250, 140800, 143900, 145100, 146800, 148200],
  '30D': [128500, 131200, 129800, 134400, 138100, 136900, 141500, 144200, 146900, 148200],
  '90D': [114200, 118900, 122400, 119800, 126500, 131000, 135400, 139800, 144500, 148200],
};

export function formatFiat(usdAmount: number, currency: CurrencyCode, compact = false): string {
  const { symbol, rate } = CURRENCY_RATES[currency];
  const converted = usdAmount * rate;
  const abs = Math.abs(converted);
  const sign = converted < 0 ? '-' : '';

  if (compact && abs >= 1_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (compact && abs >= 100_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(1)}k`;
  }
  return `${sign}${symbol}${abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatTokenAmount(amount: number, maxDecimals = 4): string {
  if (Math.abs(amount) >= 1000) {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}
