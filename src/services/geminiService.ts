import { GoogleGenerativeAI } from "@google/generative-ai";

import type { TransactionData } from "../data/mockTransactions";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateExplanation = async (txData: TransactionData, profile: 'beginner' | 'advanced') => {
  if (!API_KEY) {
    return `Simulated transaction: ${txData.type === 'swap' ? 'Swap' : txData.type === 'approval' ? 'Approve' : 'Transfer'} ${txData.amount} ${txData.asset}. (Configure Gemini API Key for rich analysis)`;
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Wallet Safety Copilot. Your job is to explain a blockchain transaction in a single, clear sentence.
      
      Transaction Details:
      - Type: ${txData.type}
      - Asset: ${txData.asset}
      - Amount: ${txData.amount}
      - Target: ${txData.recipient}
      - Contract Address: ${txData.contractAddress || 'Direct Transfer'}
      - User Profile: ${profile}
      
      Requirements:
      - For "Beginner": Use simple English. Avoid technical jargon. Mention what moves where.
      - For "Advanced": You can use slightly more technical terms (e.g. "DEX Router", "ERC20 Approval") but stay concise.
      - Keep it under 25 words.
      - Focus ONLY on the intent of the transaction.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Simulated transaction to ${txData.recipient} for ${txData.amount} ${txData.asset}. (AI analysis failed)`;
  }
};
