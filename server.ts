import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

interface RiskAnalysisPayload {
  mode: 'guardian' | 'sentinel';
  txType: 'send' | 'swap' | 'revoke';
  network: string;
  summary: string;
  recipientOrRouter: string;
  balanceDiffs: Array<{ symbol: string; delta: string; usdValue: string }>;
  riskLevel: 'safe' | 'caution' | 'critical';
  riskFlags: Array<{ title: string; severity: string; detail: string }>;
  gasGwei?: number;
  slippagePct?: number;
  mevProtected?: boolean;
  calldataHex?: string;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
  });

  app.post('/api/explain-risk', async (req: Request, res: Response) => {
    const body = req.body as Partial<RiskAnalysisPayload> | undefined;

    if (!body || !body.txType || !body.summary || !body.network || !body.riskLevel) {
      res.status(400).json({
        error: 'Invalid transaction payload. Required fields: txType, network, summary, riskLevel.',
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'AI risk explanation is unavailable because GEMINI_API_KEY is not configured. Add your key in Settings > Secrets to enable live AI explanations.',
      });
      return;
    }

    const sanitizedPayload = {
      mode: body.mode === 'sentinel' ? 'sentinel' : 'guardian',
      txType: String(body.txType).slice(0, 24),
      network: String(body.network).slice(0, 40),
      summary: String(body.summary).slice(0, 300),
      recipientOrRouter: String(body.recipientOrRouter || 'Unknown').slice(0, 120),
      balanceDiffs: Array.isArray(body.balanceDiffs) ? body.balanceDiffs.slice(0, 6) : [],
      riskLevel: String(body.riskLevel).slice(0, 20),
      riskFlags: Array.isArray(body.riskFlags) ? body.riskFlags.slice(0, 8) : [],
      gasGwei: typeof body.gasGwei === 'number' ? body.gasGwei : undefined,
      slippagePct: typeof body.slippagePct === 'number' ? body.slippagePct : undefined,
      mevProtected: Boolean(body.mevProtected),
      calldataHex: typeof body.calldataHex === 'string' ? body.calldataHex.slice(0, 260) : undefined,
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Analyze this simulated EVM wallet transaction and explain the security posture clearly:\n${JSON.stringify(sanitizedPayload, null, 2)}`,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          systemInstruction:
            'You are Nest Wallet’s transaction security analyst. Produce a concise, accurate, grounded risk explanation strictly based on the provided transaction simulation payload. Never invent addresses or claims not in the payload. Provide both a plain-English Guardian explanation (2-3 sentences, jargon-free) and concrete Sentinel technical findings (2-4 short bullet items covering calldata, counterparty risk, slippage/MEV, or allowance exposure).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdictLabel: {
                type: Type.STRING,
                description: 'Short 2-4 word verdict such as Safe to Sign, Review Before Signing, or High Risk — Do Not Sign.',
              },
              guardianSummary: {
                type: Type.STRING,
                description: 'Plain-English 2-3 sentence explanation tailored for everyday users with zero technical jargon.',
              },
              sentinelFindings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 concise technical findings for power users.',
              },
              recommendedAction: {
                type: Type.STRING,
                description: 'One clear next step the user should take right now.',
              },
            },
            required: ['verdictLabel', 'guardianSummary', 'sentinelFindings', 'recommendedAction'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({
          error: 'The AI model returned an empty analysis. Please try again.',
        });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json({
        ...parsed,
        model: 'gemini-4-hydrogen',
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected server error while analyzing transaction risk.';
      const status =
        message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED')
          ? 403
          : message.includes('RESOURCE_EXHAUSTED')
            ? 429
            : 502;
      res.status(status).json({
        error:
          status === 403
            ? 'Gemini API rejected the configured key. Please verify GEMINI_API_KEY in Settings > Secrets.'
            : status === 429
              ? 'Rate limit reached for AI risk analysis. Please wait a moment and try again.'
              : `Unable to complete AI risk analysis: ${message}`,
      });
    }
  });

  if (isProduction) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    // Express 5 (path-to-regexp v8) requires a named wildcard for the SPA fallback
    app.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nest Wallet server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((error) => {
  console.error('Failed to start Nest Wallet server:', error);
  process.exit(1);
});
