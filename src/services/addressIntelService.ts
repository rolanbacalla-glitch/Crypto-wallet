export interface AddressIdentity {
  name: string;
  label: 'verified' | 'suspicious' | 'unknown' | 'malicious';
  reputationScore: number; // 0 to 100
  isContract: boolean;
  tags: string[];
}

const entityDatabase: Record<string, AddressIdentity> = {
  // Uniswap V3 Router
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': {
    name: 'Uniswap V3 Router',
    label: 'verified',
    reputationScore: 99,
    isContract: true,
    tags: ['DeFi', 'DEX', 'Swap']
  },
  // Aave Pool
  '0x87870B27F51f6Af5d396E5114F23F92Cda00A91D': {
    name: 'Aave V3 Pool',
    label: 'verified',
    reputationScore: 98,
    isContract: true,
    tags: ['Lending', 'DeFi']
  },
  // Fake address for poisoning
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045': {
     name: "Vitalik Buterin's Wallet",
     label: 'verified',
     reputationScore: 100,
     isContract: false,
     tags: ['Public Figure', 'Whale']
  },
  // Known Phishing
  '0xBadF00d000000000000000000000000000000000': {
    name: 'Known Phishing Scammer',
    label: 'malicious',
    reputationScore: 0,
    isContract: false,
    tags: ['Phishing', 'Scam']
  }
};

export async function checkAddressReputation(address: string, userAddress?: string): Promise<AddressIdentity> {
  const cleanAddress = address.toLowerCase();
  
  // 1. Database Check
  if (entityDatabase[cleanAddress]) {
    return entityDatabase[cleanAddress];
  }

  // 2. Address Poisoning / Look-alike Check
  if (userAddress && isPoisoningAttempt(address, userAddress)) {
    return {
      name: 'Look-alike Address',
      label: 'malicious',
      reputationScore: 5,
      isContract: false,
      tags: ['Poisoning', 'Phishing']
    };
  }

  // 3. Default (Unknown)
  return {
    name: 'Unknown Address',
    label: 'unknown',
    reputationScore: 50,
    isContract: false,
    tags: []
  };
}

/**
 * Detects if a target address looks suspiciously like another address (e.g. poisoning attempt)
 * Matches first 4 and last 4 characters.
 */
function isPoisoningAttempt(target: string, actual: string): boolean {
  if (target.toLowerCase() === actual.toLowerCase()) return false;
  
  const targetCased = target.toLowerCase();
  const actualCased = actual.toLowerCase();

  const startMatch = targetCased.slice(0, 6) === actualCased.slice(0, 6);
  const endMatch = targetCased.slice(-4) === actualCased.slice(-4);
  
  // If first 6 and last 4 match, but address is different, it's likely a poisoning attempt
  return startMatch && endMatch;
}
