import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface CopilotLog {
  type: 'simulation' | 'reputation_search';
  userId?: string;
  txId?: string;
  txName?: string;
  address?: string;
  riskLevel?: string;
  sentiment?: string;
  timestamp: Date | { seconds: number; nanoseconds: number } | any;
  metadata?: Record<string, unknown>;
}

/**
 * Log a Copilot transaction attempt or reputation search to Firestore.
 */
export const logCopilotAttempt = async (logData: Omit<CopilotLog, 'timestamp'>) => {
  try {
    const logsRef = collection(db, 'copilot_logs');
    await addDoc(logsRef, {
      ...logData,
      timestamp: serverTimestamp()
    });
    console.log(`Copilot ${logData.type} attempt logged successfully`);
  } catch (error) {
    console.error(`Failed to log Copilot ${logData.type} attempt:`, error);
  }
};
