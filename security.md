# Security Framework - Wallet Safety Copilot

## Principles
Security is not just about keeping keys safe; it's about protecting the user from their own decisions and external malice.

### Key Protections
- **Pre-execution Analysis**: Every transaction is simulated on-chain (using mock simulation in V1) to predict the outcome before the user signs.
- **Phishing Detection**: Integrated destination check against known phishing databases.
- **Malicious Approval Detection**: Flags if a contract is requesting an "Unlimited Approval" on a high-value asset without clear justification.
- **Audit Trail**: Logs all warnings shown and user bypasses for later review in the Safety Centre.

### Technical Security
- **Local Isolation**: Sensitive operations (e.g., seed phrase generation/display) are isolated in a minimal UI state.
- **No Cloud-Sync of Keys**: Private keys never leave the local device.
- **Safe Fallback**: If the Copilot API is unreachable, the wallet defaults to "Warning: Simulation Unavailable" rather than allowing silent signing.
