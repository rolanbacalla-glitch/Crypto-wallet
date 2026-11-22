import { NETWORKS, SEND_PRESETS, shortenAddress } from '../data/initialWalletData';
import type {
  EvmTraceStep,
  GasSpeed,
  MevRelay,
  RiskLevel,
  SimulationCheck,
  SimulationResult,
  TokenAsset,
  VaultSettings,
} from '../types/wallet';

const FLAGGED_DRAINERS = new Set([
  '0x0000dead8819a2b4c914f7311ec9a2887ba4991f',
  '0xdead00000000000000000000000000000000beef',
]);

const KNOWN_TRUSTED: Record<string, string> = {
  '0x51c72848c68a965f66fa7a88855f9f7784502a7f': 'elena.eth',
  '0x94c8e219a0b13490d772f38a102c441b99e18a12': 'Hardware Cold Vault',
};

const GAS_SPEED_MULTIPLIER: Record<GasSpeed, number> = {
  standard: 1,
  fast: 1.25,
  priority: 1.6,
};

function generateHexSuffix(seed: string, length: number): string {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const chars = '0123456789abcdef';
  let out = '';
  let state = Math.abs(hash);
  for (let i = 0; i < length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    out += chars[state % 16];
  }
  return out;
}

export function generateTxHash(seed: string): string {
  return `0x${generateHexSuffix(seed + Date.now().toString(), 64)}`;
}

export function isValidRecipientInput(input: string): boolean {
  const trimmed = input.trim();
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return true;
  if (/^[a-zA-Z0-9-]+\.eth$/i.test(trimmed)) return true;
  return false;
}

export function resolveRecipientAddress(input: string): { address: string; label: string } {
  const trimmed = input.trim();
  const preset = SEND_PRESETS.find(
    (p) => p.address.toLowerCase() === trimmed.toLowerCase() || p.label.toLowerCase().startsWith(trimmed.toLowerCase())
  );
  if (preset) {
    return {
      address: preset.address,
      label: KNOWN_TRUSTED[preset.address.toLowerCase()] || preset.label.replace(/^Test Threat:\s*/i, ''),
    };
  }
  if (trimmed.toLowerCase() === 'elena.eth') {
    return { address: '0x51C72848c68a965f66FA7a88855F9f7784502a7F', label: 'elena.eth' };
  }
  if (/^[a-zA-Z0-9-]+\.eth$/i.test(trimmed)) {
    const derived = `0x${generateHexSuffix(trimmed.toLowerCase(), 40)}`;
    return { address: derived, label: trimmed.toLowerCase() };
  }
  const knownLabel = KNOWN_TRUSTED[trimmed.toLowerCase()];
  return {
    address: trimmed,
    label: knownLabel || shortenAddress(trimmed),
  };
}

function isAddressPoisoningLookalike(candidate: string, ownWallet: string): boolean {
  const a = candidate.toLowerCase();
  const b = ownWallet.toLowerCase();
  if (a === b) return false;
  if (!a.startsWith('0x') || a.length !== 42) return false;
  const samePrefix = a.slice(0, 6) === b.slice(0, 6);
  const sameSuffix = a.slice(-4) === b.slice(-4);
  return samePrefix && sameSuffix;
}

export function simulateSendTransaction(params: {
  token: TokenAsset;
  amount: number;
  recipientInput: string;
  gasSpeed: GasSpeed;
  mevRelay: MevRelay;
  settings: VaultSettings;
  todaySpentUsd: number;
  nonce: number;
}): SimulationResult {
  const { token, amount, recipientInput, gasSpeed, mevRelay, settings, todaySpentUsd, nonce } = params;
  const net = NETWORKS[token.network];
  const { address, label } = resolveRecipientAddress(recipientInput);
  const lowerAddr = address.toLowerCase();

  const usdValue = amount * token.priceUsd;
  const isNative = token.symbol === 'ETH';
  const gasUnits = isNative ? 21000 : 65240;
  const baseFeeGwei = net.baseFeeGwei;
  const priorityFeeGwei = Number((net.priorityFeeGwei * GAS_SPEED_MULTIPLIER[gasSpeed]).toFixed(2));
  const totalGwei = baseFeeGwei + priorityFeeGwei;
  const ethPriceUsd = 3240;
  const gasCostUsd = Number((((gasUnits * totalGwei) / 1e9) * ethPriceUsd).toFixed(4));

  const checks: SimulationCheck[] = [];
  let riskLevel: RiskLevel = 'safe';

  // 1. Drainer / Blacklist Check
  const isDrainer = FLAGGED_DRAINERS.has(lowerAddr);
  if (isDrainer) {
    riskLevel = 'critical';
    checks.push({
      id: 'drainer-check',
      title: 'Counterparty Threat Intelligence',
      status: 'fail',
      guardianDetail: 'This destination is linked to confirmed wallet-draining exploits. Do not send funds here.',
      sentinelDetail: `Address ${shortenAddress(address)} matches high-confidence exploit signature registry (Blockaid/ScamSniffer heuristics).`,
    });
  } else {
    checks.push({
      id: 'drainer-check',
      title: 'Counterparty Threat Intelligence',
      status: 'pass',
      guardianDetail: 'No exploit reports or phishing flags found for this address.',
      sentinelDetail: `Zero hits across known drainer registries and OFAC/scam bytecode fingerprints.`,
    });
  }

  // 2. Address Poisoning Lookalike Check
  const isPoisoning = isAddressPoisoningLookalike(address, settings.walletAddress);
  if (isPoisoning) {
    riskLevel = 'critical';
    checks.push({
      id: 'poison-check',
      title: 'Address Poisoning Guard',
      status: 'fail',
      guardianDetail:
        'Lookalike scam detected! This address copies the start and end of your own wallet to trick copy-paste.',
      sentinelDetail: `Vanity collision detected: prefix ${address.slice(0, 6)} and suffix ${address.slice(-4)} match owner EOA while middle 32 bytes diverge.`,
    });
  } else {
    checks.push({
      id: 'poison-check',
      title: 'Address Poisoning Guard',
      status: 'pass',
      guardianDetail: 'Address does not mimic any of your recent spoofed dust transfers.',
      sentinelDetail: 'Prefix/suffix entropy check passed with zero vanity spoofing overlap.',
    });
  }

  // 3. Recipient Trust / First-Time Interaction
  const isTrusted = Boolean(KNOWN_TRUSTED[lowerAddr]);
  if (!isDrainer && !isPoisoning && !isTrusted) {
    if (riskLevel === 'safe') riskLevel = 'caution';
    checks.push({
      id: 'trust-check',
      title: 'Recipient History',
      status: 'warn',
      guardianDetail: 'First time sending to this address. Double-check the full address before signing.',
      sentinelDetail: `Zero prior outbound nonces to ${shortenAddress(address)}. No verified reverse ENS record.`,
    });
  } else if (isTrusted) {
    checks.push({
      id: 'trust-check',
      title: 'Recipient History',
      status: 'pass',
      guardianDetail: `Recognized trusted destination (${label}).`,
      sentinelDetail: `Allowlisted contact match (${label}) with verified prior settlement history.`,
    });
  }

  // 4. Daily Spend Limit Guardrail
  const projectedDailySpend = todaySpentUsd + usdValue;
  if (projectedDailySpend > settings.dailySpendLimitUsd) {
    if (riskLevel === 'safe') riskLevel = 'caution';
    checks.push({
      id: 'spend-limit',
      title: 'Daily Spend Guardrail',
      status: 'warn',
      guardianDetail: `This transfer exceeds your daily limit of $${settings.dailySpendLimitUsd.toLocaleString()}.`,
      sentinelDetail: `Projected 24h outflow $${projectedDailySpend.toFixed(2)} > configured guardrail $${settings.dailySpendLimitUsd.toLocaleString()}.`,
    });
  } else {
    checks.push({
      id: 'spend-limit',
      title: 'Daily Spend Guardrail',
      status: 'pass',
      guardianDetail: 'Transfer stays within your configured daily safety limit.',
      sentinelDetail: `24h cumulative outflow remains within $${settings.dailySpendLimitUsd.toLocaleString()} policy cap.`,
    });
  }

  const calldataMethod = isNative ? 'nativeTransfer()' : 'transfer(address,uint256)';
  const calldataHex = isNative
    ? '0x'
    : `0xa9059cbb000000000000000000000000${lowerAddr.replace('0x', '')}${generateHexSuffix(String(amount), 64)}`;

  const traceSteps: EvmTraceStep[] = isNative
    ? [
        {
          step: 1,
          opcode: 'CALL',
          target: shortenAddress(address),
          detail: `Transfer ${amount} ETH (${net.shortName})`,
          gasUsed: 21000,
          flagged: isDrainer || isPoisoning,
        },
      ]
    : [
        {
          step: 1,
          opcode: 'CALL',
          target: `${token.symbol} (${shortenAddress(token.contractAddress)})`,
          detail: `transfer(${shortenAddress(address)}, ${amount} ${token.symbol})`,
          gasUsed: 48120,
          flagged: isDrainer || isPoisoning,
        },
        {
          step: 2,
          opcode: 'LOG3',
          target: 'ERC20.Transfer',
          detail: `Emit Transfer(from=Vault, to=${shortenAddress(address)}, value=${amount})`,
          gasUsed: 17120,
        },
      ];

  const verdictTitle =
    riskLevel === 'critical'
      ? 'High Risk Detected — Signing Blocked by Default'
      : riskLevel === 'caution'
        ? 'Review Carefully Before Signing'
        : 'Simulation Passed — Safe to Sign';

  const verdictSubtitle =
    riskLevel === 'critical'
      ? isPoisoning
        ? 'Nest caught an address-poisoning lookalike before your funds left the vault.'
        : 'Destination matches a known exploit contract. Canceling protects your assets.'
      : riskLevel === 'caution'
        ? 'No malicious code found, but a policy or first-time recipient warning was triggered.'
        : `Exact balance change verified on ${net.shortName}. No hidden approvals or side effects.`;

  return {
    id: `sim-send-${Date.now()}`,
    txType: 'send',
    network: token.network,
    summary: `Send ${amount} ${token.symbol} to ${label}`,
    counterpartyLabel: label,
    counterpartyAddress: address,
    riskLevel,
    verdictTitle,
    verdictSubtitle,
    balanceDiffs: [
      {
        symbol: token.symbol,
        name: token.name,
        delta: -amount,
        usdValue,
        direction: 'out',
      },
    ],
    checks,
    gasUnits,
    baseFeeGwei,
    priorityFeeGwei,
    gasCostUsd: Math.max(0.01, gasCostUsd),
    nonce,
    mevProtected: mevRelay !== 'public',
    mevRelay,
    calldataMethod,
    calldataHex,
    traceSteps,
    requiresRiskAck: riskLevel === 'critical' && settings.requireRiskConfirmation,
    sendPayload: {
      tokenId: token.id,
      amount,
      recipientAddress: address,
      recipientLabel: label,
    },
  };
}

export function simulateSwapTransaction(params: {
  fromToken: TokenAsset;
  toToken: TokenAsset;
  fromAmount: number;
  slippagePct: number;
  gasSpeed: GasSpeed;
  mevRelay: MevRelay;
  venue: string;
  forcedPriceImpactPct?: number;
  maliciousContract?: boolean;
  settings: VaultSettings;
  nonce: number;
}): SimulationResult {
  const {
    fromToken,
    toToken,
    fromAmount,
    slippagePct,
    gasSpeed,
    mevRelay,
    venue,
    forcedPriceImpactPct,
    maliciousContract,
    settings,
    nonce,
  } = params;

  const net = NETWORKS[fromToken.network];
  const inputUsd = fromAmount * fromToken.priceUsd;

  const computedImpact =
    forcedPriceImpactPct !== undefined
      ? forcedPriceImpactPct
      : Number(Math.min(1.85, Math.max(0.04, (inputUsd / 450_000) * 1.4)).toFixed(2));

  const effectiveOutUsd = inputUsd * (1 - computedImpact / 100 - 0.0005);
  const toAmount = Number((effectiveOutUsd / toToken.priceUsd).toFixed(6));

  const gasUnits = maliciousContract ? 188420 : 142650;
  const baseFeeGwei = net.baseFeeGwei;
  const priorityFeeGwei = Number((net.priorityFeeGwei * GAS_SPEED_MULTIPLIER[gasSpeed]).toFixed(2));
  const gasCostUsd = Number((((gasUnits * (baseFeeGwei + priorityFeeGwei)) / 1e9) * 3240).toFixed(2));

  const routerAddress = maliciousContract
    ? '0x0000dEaD8819a2B4C914F7311eC9a2887bA4991F'
    : '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';

  const checks: SimulationCheck[] = [];
  let riskLevel: RiskLevel = 'safe';

  // 1. Malicious Contract / Permit Drain Check
  if (maliciousContract) {
    riskLevel = 'critical';
    checks.push({
      id: 'permit-trap',
      title: 'Contract & Approval Simulation',
      status: 'fail',
      guardianDetail:
        'Dangerous trap detected: this swap secretly asks for unlimited access to drain your entire USDC balance.',
      sentinelDetail:
        'Calldata invokes unverified proxy with Permit2 MAX_UINT256 allowance and outbound transferFrom() to attacker EOA.',
    });
  } else {
    checks.push({
      id: 'permit-trap',
      title: 'Contract & Approval Simulation',
      status: 'pass',
      guardianDetail: `Verified smart contract (${venue}) with no hidden wallet-draining approvals.`,
      sentinelDetail: `Router bytecode verified on ${net.shortName}; exact input transfer bounded to ${fromAmount} ${fromToken.symbol}.`,
    });
  }

  // 2. Price Impact Check
  if (computedImpact >= 3.0) {
    if (riskLevel === 'safe') riskLevel = 'caution';
    checks.push({
      id: 'price-impact',
      title: 'Price Impact & Slippage',
      status: 'warn',
      guardianDetail: `High price impact (${computedImpact.toFixed(2)}%). You would lose roughly $${((inputUsd * computedImpact) / 100).toFixed(0)} to poor pool liquidity.`,
      sentinelDetail: `Simulated execution price deviates -${computedImpact.toFixed(2)}% from oracle spot; exceeds 3.00% warning threshold.`,
    });
  } else {
    checks.push({
      id: 'price-impact',
      title: 'Price Impact & Slippage',
      status: 'pass',
      guardianDetail: `Fair market rate with low price impact (${computedImpact.toFixed(2)}%) and ${slippagePct}% max slippage.`,
      sentinelDetail: `Oracle spread within tolerance (${computedImpact.toFixed(2)}%); minAmountOut enforced on-chain.`,
    });
  }

  // 3. MEV Sandwich Protection Check
  const isMevProtected = mevRelay !== 'public';
  if (!isMevProtected && inputUsd >= 2500) {
    if (riskLevel === 'safe') riskLevel = 'caution';
    checks.push({
      id: 'mev-check',
      title: 'MEV Front-Run Protection',
      status: 'warn',
      guardianDetail: 'Public mempool routing is enabled. Switch to Flashbots Protect to shield this trade from sandwich bots.',
      sentinelDetail: `Trade size ($${inputUsd.toFixed(0)}) routed via public mempool is profitable for searcher sandwich extraction.`,
    });
  } else {
    checks.push({
      id: 'mev-check',
      title: 'MEV Front-Run Protection',
      status: 'pass',
      guardianDetail: isMevProtected
        ? 'Private RPC shielding keeps this trade hidden from sandwich bots.'
        : 'Trade size below typical MEV sandwich extraction threshold.',
      sentinelDetail: isMevProtected
        ? `Private orderflow relay active (${mevRelay === 'flashbots' ? 'Flashbots Protect' : 'MEV Blocker'}).`
        : 'Public RPC selected; low sandwich profitability.',
    });
  }

  const routeHops =
    fromToken.symbol !== 'ETH' && toToken.symbol !== 'ETH'
      ? [fromToken.symbol, 'WETH', toToken.symbol]
      : [fromToken.symbol, toToken.symbol];

  const balanceDiffs = maliciousContract
    ? [
        {
          symbol: fromToken.symbol,
          name: fromToken.name,
          delta: -fromToken.balance,
          usdValue: fromToken.balance * fromToken.priceUsd,
          direction: 'out' as const,
        },
      ]
    : [
        {
          symbol: fromToken.symbol,
          name: fromToken.name,
          delta: -fromAmount,
          usdValue: inputUsd,
          direction: 'out' as const,
        },
        {
          symbol: toToken.symbol,
          name: toToken.name,
          delta: toAmount,
          usdValue: effectiveOutUsd,
          direction: 'in' as const,
        },
      ];

  const traceSteps: EvmTraceStep[] = maliciousContract
    ? [
        {
          step: 1,
          opcode: 'CALL',
          target: 'Permit2.permitTransferFrom',
          detail: `Grant MAX_UINT256 allowance on ${fromToken.symbol} to unverified proxy`,
          gasUsed: 46200,
          flagged: true,
        },
        {
          step: 2,
          opcode: 'DELEGATECALL',
          target: shortenAddress(routerAddress),
          detail: `Sweep entire balance (${fromToken.balance} ${fromToken.symbol}) -> 0xdead...991F`,
          gasUsed: 98400,
          flagged: true,
        },
        {
          step: 3,
          opcode: 'RETURN',
          target: 'Simulated Output',
          detail: `0 ${toToken.symbol} returned to owner vault`,
          gasUsed: 43820,
          flagged: true,
        },
      ]
    : [
        {
          step: 1,
          opcode: 'CALL',
          target: `${fromToken.symbol}.transferFrom`,
          detail: `Transfer ${fromAmount} ${fromToken.symbol} into ${venue}`,
          gasUsed: 41200,
        },
        {
          step: 2,
          opcode: 'STATICCALL',
          target: 'QuoterV2.quoteExactInput',
          detail: `Route ${routeHops.join(' -> ')} · impact ${computedImpact.toFixed(2)}%`,
          gasUsed: 38900,
        },
        {
          step: 3,
          opcode: 'CALL',
          target: `${toToken.symbol}.transfer`,
          detail: `Deliver ${toAmount} ${toToken.symbol} to owner vault`,
          gasUsed: 62550,
        },
      ];

  const verdictTitle =
    riskLevel === 'critical'
      ? 'Malicious Drain Detected — Swap Blocked'
      : riskLevel === 'caution'
        ? 'Caution — Review Trade Terms Before Signing'
        : 'Swap Simulated — Verified Safe Route';

  const verdictSubtitle =
    riskLevel === 'critical'
      ? `Simulation reveals you would lose your entire ${fromToken.symbol} balance and receive 0 ${toToken.symbol}.`
      : riskLevel === 'caution'
        ? 'Route executes cleanly, but elevated price impact or public mempool exposure was flagged.'
        : `Receive ~${toAmount} ${toToken.symbol} via ${venue} with verified token balances.`;

  return {
    id: `sim-swap-${Date.now()}`,
    txType: 'swap',
    network: fromToken.network,
    summary: `Swap ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
    counterpartyLabel: venue,
    counterpartyAddress: routerAddress,
    riskLevel,
    verdictTitle,
    verdictSubtitle,
    balanceDiffs,
    checks,
    gasUnits,
    baseFeeGwei,
    priorityFeeGwei,
    gasCostUsd: Math.max(0.02, gasCostUsd),
    nonce,
    mevProtected: isMevProtected,
    mevRelay,
    slippagePct,
    priceImpactPct: computedImpact,
    routeLabel: venue,
    routeHops,
    calldataMethod: maliciousContract
      ? 'multicall(bytes[]) [UNVERIFIED_PERMIT_SWEEP]'
      : 'exactInputSingle(ExactInputSingleParams)',
    calldataHex: maliciousContract
      ? `0xac9650d80000000000000000000000000000dead8819a2b4c914f7311ec9a2887ba4991fffffffffffffffff`
      : `0x414bf389000000000000000000000000${fromToken.contractAddress.slice(2, 18)}${generateHexSuffix(
          `${fromAmount}-${toToken.symbol}`,
          48
        )}`,
    traceSteps,
    requiresRiskAck: riskLevel === 'critical' && settings.requireRiskConfirmation,
    swapPayload: {
      fromTokenId: fromToken.id,
      toTokenId: toToken.id,
      fromAmount,
      toAmount,
      venue,
    },
  };
}

/**
 * Generates a deterministic 25x25 QR-style vector matrix with authentic 7x7 finder corners,
 * timing tracks, and hash-seeded data modules for Receive address display.
 */
export function generateQrMatrix(payload: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinder = (row0: number, col0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row0 + r;
        const cc = col0 + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        reserved[rr][cc] = true;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          grid[rr][cc] = false;
        } else if (r === 0 || r === 6 || c === 0 || c === 6) {
          grid[rr][cc] = true;
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          grid[rr][cc] = true;
        } else {
          grid[rr][cc] = false;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment pattern near bottom-right
  for (let r = 16; r <= 20; r++) {
    for (let c = 16; c <= 20; c++) {
      reserved[r][c] = true;
      const dr = Math.abs(r - 18);
      const dc = Math.abs(c - 18);
      grid[r][c] = dr === 2 || dc === 2 || (dr === 0 && dc === 0);
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  let seed = 0x811c9dc5;
  for (let i = 0; i < payload.length; i++) {
    seed ^= payload.charCodeAt(i);
    seed = Math.imul(seed, 0x01000193) >>> 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c]) continue;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      grid[r][c] = (seed >>> 24) % 100 < 52;
    }
  }

  return grid;
}
