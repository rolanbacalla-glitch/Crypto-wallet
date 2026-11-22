export type WalletMode = 'guardian' | 'sentinel';

export type NetworkId = 'ethereum' | 'base' | 'arbitrum' | 'optimism';

export type CurrencyCode = 'USD' | 'GBP' | 'EUR';

export type NavTab = 'overview' | 'assets' | 'activity' | 'approvals' | 'settings';

export type ActionDrawerTab = 'send' | 'swap' | 'receive';

export type RiskLevel = 'safe' | 'caution' | 'critical';

export type GasSpeed = 'standard' | 'fast' | 'priority';

export type MevRelay = 'flashbots' | 'mev-blocker' | 'public';

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  shortName: string;
  chainId: number;
  baseFeeGwei: number;
  priorityFeeGwei: number;
  explorerBase: string;
  accentHex: string;
}

export interface TokenAsset {
  id: string;
  symbol: string;
  name: string;
  network: NetworkId;
  balance: number;
  priceUsd: number;
  change24hPct: number;
  contractAddress: string;
  verified: boolean;
  stakingApr?: number;
}

export interface BalanceDiff {
  symbol: string;
  name: string;
  delta: number;
  usdValue: number;
  direction: 'out' | 'in';
}

export interface SimulationCheck {
  id: string;
  title: string;
  status: 'pass' | 'warn' | 'fail';
  guardianDetail: string;
  sentinelDetail: string;
}

export interface EvmTraceStep {
  step: number;
  opcode: string;
  target: string;
  detail: string;
  gasUsed: number;
  flagged?: boolean;
}

export interface SimulationResult {
  id: string;
  txType: 'send' | 'swap';
  network: NetworkId;
  summary: string;
  counterpartyLabel: string;
  counterpartyAddress: string;
  riskLevel: RiskLevel;
  verdictTitle: string;
  verdictSubtitle: string;
  balanceDiffs: BalanceDiff[];
  checks: SimulationCheck[];
  gasUnits: number;
  baseFeeGwei: number;
  priorityFeeGwei: number;
  gasCostUsd: number;
  nonce: number;
  mevProtected: boolean;
  mevRelay: MevRelay;
  slippagePct?: number;
  priceImpactPct?: number;
  routeLabel?: string;
  routeHops?: string[];
  calldataMethod: string;
  calldataHex: string;
  traceSteps: EvmTraceStep[];
  requiresRiskAck: boolean;
  // Raw execution parameters for state mutation upon confirm
  sendPayload?: {
    tokenId: string;
    amount: number;
    recipientAddress: string;
    recipientLabel: string;
  };
  swapPayload?: {
    fromTokenId: string;
    toTokenId: string;
    fromAmount: number;
    toAmount: number;
    venue: string;
  };
}

export interface AiRiskExplanation {
  verdictLabel: string;
  guardianSummary: string;
  sentinelFindings: string[];
  recommendedAction: string;
  model: string;
  analyzedAt: string;
}

export interface TransactionRecord {
  id: string;
  type: 'send' | 'swap' | 'receive' | 'revoke';
  status: 'confirmed' | 'blocked';
  timestamp: string;
  network: NetworkId;
  title: string;
  counterparty: string;
  counterpartyAddress: string;
  balanceDiffs: BalanceDiff[];
  riskLevel: RiskLevel;
  riskSummary: string;
  gasCostUsd: number;
  gasGwei: number;
  mevProtected: boolean;
  txHash: string;
  calldataMethod: string;
  calldataHex: string;
}

export interface TokenApproval {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  network: NetworkId;
  spenderName: string;
  spenderAddress: string;
  allowanceLabel: string;
  exposureUsd: number;
  isUnlimited: boolean;
  riskLevel: RiskLevel;
  riskReason: string;
  grantedAt: string;
}

export interface VaultSettings {
  currency: CurrencyCode;
  dailySpendLimitUsd: number;
  defaultMevRelay: MevRelay;
  requireRiskConfirmation: boolean;
  simulateBeforeSign: boolean;
  reduceTransparency: boolean;
  walletAddress: string;
  walletLabel: string;
  ensName: string;
}

export interface ToastItem {
  id: string;
  tone: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  detail?: string;
}

export interface SendPreset {
  id: string;
  label: string;
  address: string;
  category: 'trusted' | 'unverified' | 'threat';
  description: string;
}

export interface SwapScenarioPreset {
  id: string;
  label: string;
  category: 'verified' | 'caution' | 'threat';
  description: string;
  fromTokenId: string;
  toTokenId: string;
  amount: string;
  venue: string;
  forcedPriceImpactPct?: number;
  maliciousContract?: boolean;
}
