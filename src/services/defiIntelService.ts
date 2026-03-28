export interface ProtocolAudit {
  name: string;
  isAudited: boolean;
  securityScore: number; // 0-100
  auditReportLink?: string;
  auditor?: string;
}

export interface SlippageReport {
  isHighlyImpactful: boolean;
  impactPercentage: number;
}

const auditDatabase: Record<string, ProtocolAudit> = {
  // Uniswap V3
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': {
    name: 'Uniswap V3',
    isAudited: true,
    securityScore: 99,
    auditReportLink: 'https://github.com/Uniswap/v3-core/tree/main/audits',
    auditor: 'CertiK/OpenZeppelin'
  },
  // Curve
  '0xD533a949740bb3306d119CC777fa900bA034cd52': {
    name: 'Curve Finance',
    isAudited: true,
    securityScore: 95,
    auditReportLink: 'https://curve.fi/audits',
    auditor: 'Trail of Bits'
  }
};

export async function getProtocolAudit(contractAddress: string): Promise<ProtocolAudit> {
  const addr = contractAddress.toLowerCase();
  if (auditDatabase[addr]) return auditDatabase[addr];
  
  return {
    name: 'Unindexed Protocol',
    isAudited: false,
    securityScore: 30, // Default for unindexed/new protocols
  };
}

export function getSlippageReport(txId: string): SlippageReport {
  // Mock logic: tx-high-slippage will trigger a high impact score
  if (txId === 'tx-high-slippage') {
    return { isHighlyImpactful: true, impactPercentage: 7.2 };
  }
  
  return { isHighlyImpactful: false, impactPercentage: 0.15 };
}
