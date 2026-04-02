import type { TransactionData } from '../data/mockTransactions';
import { generateNarrative, type AINarrative } from './geminiService';
import { simulateTransaction, type SimulationChange } from './simulationService';
import { checkAddressReputation, type AddressIdentity } from './addressIntelService';
import { getProtocolAudit, getSlippageReport, type ProtocolAudit, type SlippageReport } from './defiIntelService';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SafetyReport {
  riskLevel: RiskLevel;
  narrative: AINarrative;
  isApprovalWarning: boolean;
  warnings: string[];
  transaction: TransactionData;
  recipientIdentity?: AddressIdentity;
  protocolAudit?: ProtocolAudit;
  slippageReport?: SlippageReport;
  simulationResults?: {
    success: boolean;
    gasUsed: string;
    changes: SimulationChange[];
    provider: string;
  };
  details?: {
    calldata?: string;
    simulationOutput?: string;
    contractAudit?: string;
  };
}

class SafetyEngine {
  async analyseTransaction(tx: TransactionData, profile: 'beginner' | 'advanced' = 'beginner'): Promise<SafetyReport> {
    let riskLevel: RiskLevel = 'low';
    const warnings: string[] = [];
    let isApprovalWarning = false;

    const userAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Mock user wallet

    // 1. Entity & Protocol Intelligence Phase
    const recipient = tx.contractAddress || tx.recipient;
    const recipientIdentity = await checkAddressReputation(recipient, userAddress);
    const protocolAudit = await getProtocolAudit(recipient || "");
    const slippageReport = getSlippageReport(tx.id);

    // Initial Risk from Identity
    if (recipientIdentity.label === 'malicious') {
      riskLevel = 'critical';
      warnings.push(`CRITICAL: Destination is a confirmed high-risk entity: ${recipientIdentity.name}`);
    } else if (recipientIdentity.label === 'suspicious') {
      riskLevel = 'high';
      warnings.push('WARNING: Address has a low reputation score.');
    } else if (recipientIdentity.label === 'verified') {
      warnings.push(`SECURE: Verified interaction with ${recipientIdentity.name}.`);
    }

    // Risk from Protocol Health
    if (recipientIdentity.isContract && !protocolAudit.isAudited) {
      if (riskLevel === 'low') riskLevel = 'medium';
      warnings.push('CAUTION: This protocol has not been indexed or verified in our audit database.');
    } else if (protocolAudit.isAudited) {
      warnings.push(`SECURE: Interacting with ${protocolAudit.auditor}-audited code.`);
    }

    // Risk from Economic Factors (Slippage)
    if (slippageReport.isHighlyImpactful) {
      if (riskLevel === 'low' || riskLevel === 'medium') riskLevel = 'high';
      warnings.push(`WARNING: High price impact/slippage predicted: ${slippageReport.impactPercentage}%.`);
    }

    // 2. Simulation Phase (Live Simulation)
    const simResults = await simulateTransaction(
       userAddress,
       recipient || "0x0000000000000000000000000000000000000000",
       tx.calldata || "0x",
       tx.value || "0x0",
       tx.simulationResult
    );

    if (!simResults.success) {
      riskLevel = riskLevel === 'critical' ? 'critical' : 'high';
      warnings.push(`CRITICAL: Simulation failed: ${simResults.error || 'Unknown revert'}`);
    }

    // Check for unexpected high-value outflows in simulation
    const largeOutflows = simResults.changes.filter(c => !c.isIncoming && c.type === 'transfer' && parseFloat(c.amount) > 10);
    if (largeOutflows.length > 0 && tx.type !== 'transfer') {
      riskLevel = 'high';
      warnings.push(`WARNING: Unexpected outflow of ${largeOutflows[0].amount} ${largeOutflows[0].asset} detected.`);
    }

    // 3. Heuristic Risk Scoring (Deterministic Safety)
    const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
    
    if (tx.type === 'swap') {
      if (recipientIdentity.label !== 'verified' && !protocolAudit.isAudited) {
        const currentIdx = riskLevels.indexOf(riskLevel);
        riskLevel = riskLevels[Math.max(currentIdx, 2)]; // at least high
        warnings.push('Interacting with an unverified swap router.');
      }
    } 
    
    else if (tx.type === 'approval') {
      isApprovalWarning = true;
      if (tx.isUnlimitedApproval) {
        riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
        if (recipientIdentity.label !== 'verified') {
          riskLevel = 'high';
        }
        warnings.push('CRITICAL: Granting UNLIMITED access to your assets.');
      }
    }

    else if (tx.type === 'transfer') {
      if (tx.isNewAddress && recipientIdentity.label === 'unknown') {
        riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
        warnings.push('The recipient address has zero historical interaction with your wallet.');
      }
    }

    // 4. AI-Powered Narrative (Fluid Context)
    const partialReport: any = {
      riskLevel,
      warnings,
      transaction: tx,
      recipientIdentity,
      protocolAudit,
      slippageReport,
      simulationResults: simResults,
    };

    const narrative = await generateNarrative(partialReport, profile);

    return {
      riskLevel,
      narrative,
      isApprovalWarning,
      warnings,
      transaction: tx,
      recipientIdentity,
      protocolAudit,
      slippageReport,
      simulationResults: simResults,
      details: {
        calldata: tx.calldata || '0x',
        simulationOutput: simResults.success ? `Success: Gas used ${simResults.gasUsed}` : `Reverted: ${simResults.error}`,
        contractAudit: protocolAudit.isAudited ? `Audit Pass: Verified by ${protocolAudit.auditor}.` : 'N/A'
      }
    };
  }
}

export const safetyEngine = new SafetyEngine();



