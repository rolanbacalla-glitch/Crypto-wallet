# Nest Wallet: The AI-First Safety Layer (10/10 Master Spec)

## 1. Product Thesis & Positioning
**Nest** is not a "wallet with AI"; it is a **Security Product** that features a premium non-custodial wallet. The product thesis centers on **"Decision Assurance"**—the belief that most crypto losses are human decision failures that can be prevented by translating raw on-chain data into high-fidelity, human-readable safety narratives.

---

## 2. Target Personas & Adaptive Friction
We differentiate our experience through **Intelligent Friction**. This ensures safety without frustrating power users.

*   **The Beginner (The Protected)**:
    *   **Experience**: Simplified flows, extreme plain-English focus.
    *   **Friction Gate**: High-risk actions require a **3-second "Verify" hold** on a physical button.
    *   **Safeguard**: Defaults to lowest slippage (0.1%) and auto-blocking of known malicious DNS.

*   **The Advanced User (The Auditor)**:
    *   **Experience**: Technical depth, permission-level granular audits.
    *   **Friction Gate**: High-risk actions require a **Double-Check Checkbox** within the simulation layer.
    *   **Safeguard**: Surfaces raw hex, contract age, gas optimization strategies, and MEV protection stats.

---

## 3. The AI Safety Engine (Verdict Taxonomy)
The "Heart" of Nest is a deterministic/probabilistic hybrid engine. Every transaction *must* receive a **Safety Verdict** before a user can sign.

| Verdict | Visual Influence | UX Consequence | Description |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Red Pulse, Background Glow | **BLOCK** Recommendation | Immediate fund-drain risk found (e.g., Phishing Permit). |
| **WARNING** | Amber Pulse, Soft Orange | **WARN** & Explain | Suspicious behavior (e.g., Unverified Contract, Low Liquidity). |
| **INFO** | Calm Green | **FAST-TRACK** | Stable, high-trust interaction (e.g., Transfer to Coinbase). |
| **INCONCLUSIVE** | Muted Grey / Noise Filter | **CAUTION** Mode | AI results uncertain. default to manual verification. |

### **3.1. Fail-Safe Execution**
The Safety Engine operates on a **"Safe-by-Default"** rule. If the AI service is offline or the simulation returns internal errors, the wallet enters **Safe Mode (Fail-Safe)**, limiting all high-value transactions and requiring 2FA or a Cooling Period.

---

## 4. Key Experience Modules (The Stack)

### **4.1. Onboarding Wizard**
*   **Persona Identification**: Captures risk tolerance and experience level.
*   **Safety Baseline**: Sets initial gas/slippage defaults based on persona.

### **4.2. Live Threat Radar**
*   **Real-Time Data**: Global monitoring of phishing sites, protocol exploits, and network congestion.
*   **Visual Pulse**: Uses a soft radar-ping animation to signify active, "always-on" monitoring.

### **4.3. Approval Guard (Audit & Revoke)**
*   **Permission Audit**: A comprehensive view of all active smart contract approvals.
*   **Risk Scoring**: Categorizes approvals as Low, Medium, or High risk.
*   **Instant Revocation**: "Revoke Now" mechanism to terminate dangerous permissions.

---

## 5. Visual System & Typography (The Stable Vault)

### **5.1. Typography: Stability First**
*   **The Rule**: **Zero Italicization.** 
*   **Rationale**: Italics imply instability, slanting, and haste. Nest uses **Inter Tight (Semibold/Black)** in upright, vertical orientations.
*   **Effect**: Every label looks grounded and secure, like a bank vault’s engraved plaque.

### **5.2. Themes & Surfaces**
*   **Dark-Mode-First**: Deep charcoal, graphite, and near-black surfaces.
*   **Restrained Neon**: Primary Accent `#D4FF3B` (Vibrant Lime). Danger Accent `#FF5252` (Alert Red).
*   **Glassmorphism**: Subtle frosting on safety cards with a **30px Blur Radius**.

---

## 6. Privacy & Trust Architecture (Zero-Knowledge Safety)
*   **Transaction Obfuscation**: The Safety Engine simulates transactions in an isolated environment.
*   **Privacy Guardrail**: No user identity is tied to the transaction data sent for analysis.
*   **Self-Custody**: Nest never stores or sees a user's private keys or seed phrase.

---

## 7. Delivery Roadmap
1.  **V1 (Current)**: Onboarding, Dashboard, Threat Radar, Approval Guard, Basic Simulation.
2.  **V2 (Near Term)**: **Emergency Freeze** (Safe Mode), **MEV Shield**, One-Click Revoke All.
3.  **V3 (Vision)**: **Cross-Chain Risk Audit** across all major L2s (Base, Arbitrum, Optimism).
