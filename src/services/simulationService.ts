export interface SimulationChange {
  type: 'transfer' | 'approval' | 'balance_change';
  asset: string;
  amount: string;
  from?: string;
  to?: string;
  isIncoming: boolean;
}

export interface SimulationResult {
  success: boolean;
  changes: SimulationChange[];
  gasUsed: string;
  error?: string;
  provider: 'alchemy' | 'mock';
}

const ALCHEMY_RPC_URL = import.meta.env.VITE_ALCHEMY_RPC_URL;

export async function simulateTransaction(
  from: string,
  to: string,
  data: string,
  value: string = '0x0',
  expectedResult: 'success' | 'failure' = 'success'
): Promise<SimulationResult> {
  // 1. Fallback to Mock if no URL provided
  if (!ALCHEMY_RPC_URL || ALCHEMY_RPC_URL.includes('your_alchemy_key')) {
    return mockSimulation(expectedResult);
  }

  try {
    const response = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_simulateV1',
        params: [{
          blockStateCalls: [{
            from,
            stateOverrides: {
              [from]: { balance: '0xde0b6b3a7640000' } // 1 ETH State Override
            },
            calls: [{ from, to, data, value }]
          }],
          traceTransfers: true,
          validation: true
        }, 'latest']
      })
    });

    const result = await response.json();
    
    if (result.error) throw new Error(result.error.message);

    const simData = result.result[0];
    return {
      success: simData.status === '0x1',
      gasUsed: parseInt(simData.gasUsed, 16).toString(),
      changes: parseSimulationChanges(simData),
      provider: 'alchemy'
    };
  } catch (error) {
    console.warn("Simulation failed, falling back to mock:", error);
    return mockSimulation(expectedResult);
  }
}

function parseSimulationChanges(simData: any): SimulationChange[] {
  const changes: SimulationChange[] = [];
  const VITALIK_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  if (simData.logs) {
    simData.logs.forEach((log: any) => {
      const topic0 = log.topics[0];
      
      // ERC20 Transfer: 0xddf252ad...
      if (topic0 === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
        const from = '0x' + log.topics[1].slice(26).toLowerCase();
        const to = '0x' + log.topics[2].slice(26).toLowerCase();
        const value = parseInt(log.data, 16);
        
        changes.push({
          type: 'transfer',
          asset: 'ERC20 Token',
          amount: (value / 1e18).toFixed(4), // Placeholder for actual decimals
          from,
          to,
          isIncoming: to === VITALIK_ADDRESS.toLowerCase()
        });
      }
      
      // ERC20 Approval: 0x8c5be1e5...
      if (topic0 === '0x8c5be1e580a61c47544395541a32200b2e8ca8c8a149f1db746097d7f766e4a9') {
        const owner = '0x' + log.topics[1].slice(26).toLowerCase();
        const spender = '0x' + log.topics[2].slice(26).toLowerCase();
        
        changes.push({
          type: 'approval',
          asset: 'ERC20 Token',
          amount: 'Unlimited', // Simplified
          from: owner,
          to: spender,
          isIncoming: false
        });
      }
    });
  }
  
  return changes;
}

async function mockSimulation(expectedResult: 'success' | 'failure'): Promise<SimulationResult> {
  await new Promise(resolve => setTimeout(resolve, 1200)); // Slightly longer for "premium" feel
  
  if (expectedResult === 'failure') {
    return {
      success: false,
      gasUsed: '0',
      provider: 'mock',
      changes: [],
      error: 'Execution reverted: Insufficient liquidity for swap or malicious contract protection triggered.'
    };
  }

  return {
    success: true,
    gasUsed: '142850',
    provider: 'mock',
    changes: [
      { type: 'transfer', asset: 'ETH', amount: '0.0420', isIncoming: false },
      { type: 'transfer', asset: 'USDC', amount: '124.50', isIncoming: true },
      { type: 'balance_change', asset: 'Gas Fee', amount: '0.0012', isIncoming: false }
    ]
  };
}

