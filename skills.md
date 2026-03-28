# Execution & Engineering Skills - Wallet Safety Copilot

## Engineering Rules
- **Maintainability**: Prefer simple, reusable components over complex custom solutions.
- **Safety Over Speed**: Validating transaction simulations accurately is more important than fast load times.
- **Mock Integration**: Use high-fidelity mock data for transaction parsing and risk scoring until real RPC integration is required.
- **Fail Safely**: If simulation data is incomplete, show a "Simulation Failed" warning instead of assuming it's safe.

## Security Guardrails
- **No Private Keys in Cleartext**: Even for MVP, all local storage must be handled as if it contains sensitive data.
- **Auditability**: Maintain an internal "Audit Trail" of all safety flags shown and user decisions made.
- **Never Suppress Risk**: Aesthetics should never come at the cost of hiding valid security warnings.
- **Non-Custodial Architecture**: The user must always remain the final signer of any transaction.
