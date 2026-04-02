# Nest Wallet: The AI-First Safety Layer (Master Specification)

## 1. Product Thesis & Positioning
**Nest** is not a "wallet with AI"; it is a **Security Product** that features a premium non-custodial wallet. The product thesis centers on **Decision Assurance**—the belief that most crypto losses are human decision failures that can be prevented by translating raw on-chain data into high-fidelity, human-readable safety narratives.

---

## 2. Target Personas & Adaptive Friction
Nest differentiates through **Intelligent Friction**, creating safety without frustrating power users.

### 2.1 The Beginner (The Protected)
- **Experience**: Simplified flows and extreme plain-English focus.
- **Friction Gate**: High-risk actions require a **3-second "Verify" hold** on the primary confirmation button.
- **Safeguard**: Defaults include lowest slippage (0.1%) and auto-blocking of known malicious DNS patterns.

### 2.2 The Advanced User (The Auditor)
- **Experience**: Technical depth with permission-level granular audits.
- **Friction Gate**: High-risk actions require a **Double-Check Checkbox** within the simulation layer.
- **Safeguard**: Surfaces raw hex, contract age, gas optimization strategies, and MEV protection insights.

---

## 3. The AI Safety Engine (Verdict Taxonomy)
The Safety Engine is the "heart" of the product. Every transaction *must* receive a **Safety Verdict** before a user can sign.

| Verdict | Visual Influence | UX Consequence | Description |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Red Pulse, Background Glow | **BLOCK** Recommendation | Immediate fund-drain risk (e.g., Phishing Permit). |
| **WARNING** | Amber Pulse, Soft Orange | **WARN** & Explain | Suspicious behavior (e.g., Unverified Contract, Low Liquidity). |
| **INFO** | Calm Green | **FAST-TRACK** | Stable, high-trust interaction (e.g., Transfer to Coinbase). |
| **INCONCLUSIVE** | Muted Grey / Noise Filter | **CAUTION** Mode | AI results uncertain. Default to manual verification. |

### 3.1. Fail-Safe Execution
The system follows a **Safe-by-Default** rule. If AI services are offline or simulations fail, the wallet enters **Safe Mode**, limiting high-value transactions and requiring a manual cooling period or secondary confirmation.

---

## 4. Key Experience Modules

### 4.1. Onboarding Wizard
- **Persona Identification**: Captures risk tolerance and experience level.
- **Safety Baseline**: Sets initial gas/slippage defaults based on persona.
- **Adaptive Copy**: Onboarding instructions and warning intensity scale with user sophistication.

### 4.2. Dashboard & Live Intelligence
- **Portfolio Overview**: Total wallet value and performance trending.
- **Live Threat Radar**: A global monitoring feed surfacing phishing campaigns, protocol exploits, and network congestion in real-time.
- **Safety Intelligence Widget**: Persistent dashboard status reflecting the current health of the user's wallet permissions.

### 4.3. Approval Guard (Audit & Revoke)
- **Permission Audit**: A comprehensive view of all active smart contract approvals.
- **Risk Scoring**: Categorizes approvals as Low, Medium, or High risk.
- **Instant Revocation**: "Revoke Now" mechanism to immediately terminate dangerous permissions.

### 4.4. Simulation Layer & Event Log
- **Pre-Sign Simulation**: Direct swap verification, suspicious permit detection, and high-slippage monitoring.
- **Intelligence Event Log**: A history of protected actions and "saved" funds from blocked threats.
- **Storytelling**: Uses "Saved Funds" outcomes to reinforce the value of the safety layer.

---

## 5. Visual System & Typography

### 5.1. Stability Typography
*   **The Rule**: **Zero Italicization.** 
*   **Philosophy**: Italics imply haste and instability. Nest uses **Inter Tight (Semibold/Black)** for headlines and **Inter (Medium)** for body text, always in upright, vertical orientations.
*   **Numeric Data**: Large balances use tabular (monospaced) treatments for fast scanning and mathematical precision.

### 5.2. Palette & Surfaces
*   **Dark-Mode-First**: Deep charcoal, graphite, and near-black surfaces.
*   **Restrained Neon**: Primary Accent `#D4FF3B` (Vibrant Lime). Danger Accent `#FF5252` (Alert Red).
*   **Surface Elevation**:
    *   **Level 0**: App background (Near-black).
    *   **Level 1**: Standard cards (Slight contrast lift, 1px border).
    *   **Level 2**: Interactive modules (Subtle shadows, low blur).
    *   **Level 3**: Critical overlays & Threat drawers (Strong separation).
    *   **Level 4**: Blocking alerts & Safe Mode interruptions (Dominant screen presence).

---

## 6. Privacy & Trust Architecture (Zero-Knowledge Safety)
*   **Transaction Obfuscation**: The Safety Engine simulates transactions in an isolated environment.
*   **Privacy Guardrail**: No user identity is tied to the transaction data sent for analysis.
*   **Self-Custody**: Nest never stores or sees a user's private keys or seed phrase.

---

## 7. Metrics for Success

| Design Decision | Intended User Effect | Product Metric |
| :--- | :--- | :--- |
| **Live Threat Radar** | Ecosystem risk visibility | Higher interaction with safety tools. |
| **Safety Verdict Cards** | Improved comprehension | Lower permit-slip errors and signing confusion. |
| **Approval Guard** | Fast permission cleanup | Increase in revoked dangerous permissions. |
| **Adaptive Onboarding** | Reduced user intimidation | Higher wizard completion rate. |
| **Intelligence Event Log** | Perceived protection value | Repeat engagement with the safety audit. |

---

## 8. Development Roadmap
1.  **V1 (Current)**: Onboarding, Dashboard, Threat Radar, Approval Guard, Basic Simulation.
2.  **V2 (Near Term)**: **Emergency Freeze** (Safe Mode), **MEV Shield**, One-Click Revoke All.
3.  **V3 (Vision)**: **Cross-Chain Risk Audit** across all major L2s (Base, Arbitrum, Optimism).

---

## 9. Final Prompt Intent
The final design should generate a premium dark-theme interface for Nest Wallet that looks **calm, modern, and credible**. It combines AI safety intelligence, human-readable transaction guidance, threat awareness, and adaptive complexity. The result is a security-first fintech product with restrained neon accents, refined glassmorphism, and a trustworthy visual language.
