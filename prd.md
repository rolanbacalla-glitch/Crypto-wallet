# Nest Wallet: AI-First Safety Copilot PRD

## 1. Product Overview
**Nest** is a next-generation crypto wallet designed to eliminate irreversible monetary loss through an integrated AI Safety Engine. Unlike traditional wallets that only provide raw hexadecimal data, Nest translates every on-chain interaction into a human-readable narrative, providing a "Safety Copilot" for both novice and advanced users.

---

## 2. Target Personas
We have implemented a dual-persona system during onboarding:
*   **The Beginner**: Needs plain English explanations, simplified UI, and high-friction warnings for risky actions.
*   **The Advanced User**: Focuses on MEV protection, gas optimization, and deep technical audits of smart contract permissions.

---

## 3. Current Feature Set (Implemented)

### 3.1. Intelligence-Driven Onboarding
*   **Multi-Step Wizard**: A high-fidelity onboarding flow that captures user experience levels.
*   **Persona Selection**: Users choose between "Beginner" and "Advanced" profiles, which dynamically adjusts the complexity of the AI Safety Engine's output.

### 3.2. Dashboard & Live Intelligence
*   **Portfolio Overview**: Real-time visualization of total wallet value with performance trending.
*   **Live Threat Radar**: A global monitoring feed surfacing phishing campaigns, protocol exploits, and network congestion in real-time.
*   **Safety Intelligence Mini-App**: A persistent dashboard widget that runs simulations on current market conditions.

### 3.3. Approval Guard (Audit & Revoke)
*   **Permission Audit**: A comprehensive view of all active smart contract approvals (e.g., Uniswap, Lido).
*   **Risk Scoring**: Approvals are categorized as Low, Medium, or High risk based on contract reputation and allowance size.
*   **Instant Revocation**: A "Revoke Now" mechanism to immediately terminate dangerous permissions.

### 3.4. AI Safety Engine (The Copilot)
*   **Narrative Generation**: Translates complex transactions into high-fidelity "Security Verdicts" and "Plain Language Summaries."
*   **Scenario Simulation**: Supports pre-defined safety tests including:
    *   *Direct Swap Verification*
    *   *Suspicious Permit Detection*
    *   *High-Slippage Monitoring*
    *   *Phishing Site Interaction*

### 3.5. Portfolio & Asset Management
*   **Deep Performance Analytics**: Interactive charts with timeframe switching (1D, 1W, 1M, etc.).
*   **Asset Allocation**: Dynamic breakdown of holdings with real-time value tracking.
*   **Intelligence Event Log**: A history of protected actions and "saved" funds from blocked threats.

---

## 4. User Experience & Design
*   **Aesthetics**: Glassmorphic, dark-mode-first design using a "Vibrant Neon" palette (Primary: `#D4FF3B`, Danger: `#FF5252`).
*   **Typography**: Clean, non-italicized branding using `Inter` or `Inter Tight` for maximum readability.
*   **Micro-interactions**: Pulse animations on the Threat Radar and liquid transitions between safety states.

---

## 5. Success Metrics
*   **Risk Prevention**: Number of "High Risk" transactions blocked or revoked.
*   **User Confidence**: Onboarding completion rates and frequency of interaction with the Safety Audit tool.
*   **Comprehension**: Reduction in "Permit Slip" errors among Beginner users.

---

## 6. Future Roadmap
1.  **Emergency Freeze**: One-click "Safe Mode" to revoke all permissions and move assets to a cold vault.
2.  **MEV Shield**: Integrated protection against frontrunning and sandwich attacks.
3.  **Cross-Chain Audit**: Unified view of risks across L2s (Base, Optimism, Arbitrum).
