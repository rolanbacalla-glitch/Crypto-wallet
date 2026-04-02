import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SafetyReport } from "./SafetyEngine";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export interface AINarrative {
  summary: string;
  securityVerdict: string;
  threatAssessment: string;
  recommendation: string;
}

export const generateNarrative = async (report: SafetyReport, profile: 'beginner' | 'advanced'): Promise<AINarrative> => {
  const tx = report.transaction;
  
  if (!API_KEY) {
    return {
      summary: `You are ${tx.type === 'swap' ? 'swapping' : tx.type === 'approval' ? 'approving' : 'sending'} ${tx.amount} ${tx.asset}.`,
      securityVerdict: `Risk Level: ${report.riskLevel.toUpperCase()}`,
      threatAssessment: report.warnings.join(' ') || 'No immediate threats detected by heuristic engine.',
      recommendation: report.riskLevel === 'low' ? 'You can proceed safely.' : 'Review warnings before signing.'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Wallet Safety Copilot. Your job is to translate complex blockchain security data into a human-readable "Narrative".
      
      TRANSACTION CONTEXT:
      - Type: ${tx.type} 
      - Asset: ${tx.asset} (${tx.amount})
      - Recipient Identity: ${report.recipientIdentity?.name} (${report.recipientIdentity?.label})
      - Protocol Audit: ${report.protocolAudit?.isAudited ? 'Audited by ' + report.protocolAudit.auditor : 'UNAUDITED'}
      - Simulation Result: ${report.simulationResults?.success ? 'SUCCESS' : 'FAILED: ' + report.simulationResults?.changes.map(c => `${c.amount} ${c.asset}`).join(', ')}
      - Risk Score: ${report.riskLevel}
      - Internal Warnings: ${report.warnings.join(', ')}
      
      USER PROFILE: ${profile} (Beginner needs simpler language, Advanced needs more technical precision).
      
      TASK:
      Generate a JSON object with strictly these fields:
      1. "summary": One sentence explaining EXACTLY what this transaction does to the user's funds.
      2. "securityVerdict": A punchy verdict (e.g. "Trusted Protocol", "High-Risk Approval", "Suspicious Destination").
      3. "threatAssessment": Explain the security context. Why is it safe or dangerous? Mention audits or reputation.
      4. "recommendation": A clear action for the user.
      
      RULES:
      - Keep sentences short.
      - Use "You" perspective. 
      - If it's a swap, mention the DEX (Uniswap, etc.) if known.
      - Use markdown for emphasis if needed.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Attempt to parse JSON from AI response
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      return JSON.parse(text.slice(jsonStart, jsonEnd));
    } catch {
      // Fallback if AI doesn't return JSON
      return {
        summary: text.split('\n')[0],
        securityVerdict: "AI Analysis",
        threatAssessment: text,
        recommendation: "Verify all details before signing."
      };
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
       summary: "Failed to generate AI narrative.",
       securityVerdict: "Error",
       threatAssessment: "The AI agent is currently unavailable.",
       recommendation: "Proceed with caution."
    };
  }
};
