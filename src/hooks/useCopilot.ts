import { useState, useCallback } from 'react';
import { safetyEngine } from '../services/SafetyEngine';
import type { SafetyReport } from '../services/SafetyEngine';
import { mockTransactions } from '../data/mockTransactions';
import type { TransactionData } from '../data/mockTransactions';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useCopilot = () => {
  const { user } = useAuth();
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

      // Save to Firebase if user is logged in
      if (user?.uid) {
        try {
          await addDoc(collection(db, 'users', user.uid, 'simulations'), {
            txId: tx.id,
            txName: tx.name,
            riskLevel: result.riskLevel,
            report: result,
            timestamp: serverTimestamp(),
            profile
          });
        } catch (error) {
          console.error("Failed to save simulation to Firebase:", error);
        }
      }
    }
    
    setIsAnalysing(false);
  }, [user]);

  return {
    isAnalysing,
    report,
    activeTx,
    analyse,
    availableScenarios: mockTransactions
  };
};
