import { useState, useCallback } from 'react';
import { safetyEngine } from '../services/SafetyEngine';
import type { SafetyReport } from '../services/SafetyEngine';
import { mockTransactions } from '../data/mockTransactions';
import type { TransactionData } from '../data/mockTransactions';

export const useCopilot = () => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [report, setReport] = useState<SafetyReport | null>(null);
  const [activeTx, setActiveTx] = useState<TransactionData | null>(null);

  const analyse = useCallback(async (txId: string, profile: 'beginner' | 'advanced' = 'beginner') => {
    setIsAnalysing(true);
    setReport(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tx = mockTransactions.find(t => t.id === txId);
    if (tx) {
      const result = await safetyEngine.analyseTransaction(tx, profile);
      setReport(result);
      setActiveTx(tx);
    }
    
    setIsAnalysing(false);
  }, []);

  return {
    isAnalysing,
    report,
    activeTx,
    analyse,
    availableScenarios: mockTransactions
  };
};
