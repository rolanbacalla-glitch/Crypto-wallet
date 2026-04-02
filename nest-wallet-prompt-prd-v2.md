# Nest Wallet: The AI-First Safety Layer (Updated Master Spec)

## 1. Product Thesis & Positioning
**Nest** is not a "wallet with AI"; it is a **Security Product** that features a premium non-custodial wallet [file:44]. The product thesis centers on **Decision Assurance**—the belief that most crypto losses are human decision failures that can be prevented by translating raw on-chain data into high-fidelity, human-readable safety narratives [file:44].

## 2. Target Personas & Adaptive Friction
Nest differentiates through **Intelligent Friction**, creating safety without frustrating power users [file:44].

### 2.1 The Beginner (The Protected)
- Simplified flows and extreme plain-English focus [file:44].
- High-risk actions require a 3-second **Verify Hold** on a physical or primary confirmation button [file:44].
- Defaults include lowest slippage at 0.1% and auto-blocking of known malicious DNS patterns [file:44].

### 2.2 The Advanced User (The Auditor)
- Technical depth with permission-level granular audits [file:44].
- High-risk actions require a **Double-Check Checkbox** inside the simulation layer [file:44].
- Surfaces raw hex, contract age, gas optimization strategies, and MEV protection insights [file:44].

## 3. AI Safety Engine
The Safety Engine is the product heart and every transaction must receive a **Safety Verdict** before a user can sign [file:44].

| Verdict | Visual Influence | UX Consequence | Description |
|---|---|---|---|
| **CRITICAL** | Red pulse, elevated red glow, high-contrast alert panel [file:44] | **Block** recommendation [file:44] | Immediate fund-drain risk, such as a phishing permit [file:44] |
| **WARNING** | Amber pulse, soft orange highlight [file:44] | **Warn** and explain [file:44] | Suspicious behavior, such as low liquidity or unverified contracts [file:44] |
| **INFO** | Calm green, low visual noise [file:44] | **Fast-track** [file:44] | Stable and high-trust interaction, such as a transfer to Coinbase [file:44] |
| **INCONCLUSIVE** | Muted gray, subtle noise or uncertainty treatment [file:44] | **Caution** mode [file:44] | AI confidence is low, so manual verification is required [file:44] |

### 3.1 Fail-Safe Execution
The system follows a **Safe-by-Default** rule. If AI services are offline or simulations fail, the wallet enters **Safe Mode**, limiting high-value transactions and requiring 2FA or a cooling period [file:44].

## 4. Key Experience Modules

### 4.1 Onboarding Wizard
- Persona identification based on experience level and risk tolerance [file:44].
- Safety baseline setup, including default gas and slippage profiles [file:44].
- Adaptive onboarding copy and warning intensity depending on persona [file:44].

### 4.2 Dashboard
- Total wallet value and performance trend [file:44].
- Portfolio allocation and real-time asset visibility [file:44].
- Persistent Safety Intelligence widget [file:42][file:44].
- Live Threat Radar for phishing, exploits, and network congestion [file:42][file:44].

### 4.3 Approval Guard
- Full smart contract permission audit [file:42][file:44].
- Low, Medium, and High risk scoring [file:42][file:44].
- Instant **Revoke Now** actions [file:42][file:44].
- One-click future pathway for **Revoke All** in later versions [file:44].

### 4.4 Simulation Layer
- Direct swap verification [file:42].
- Suspicious permit detection [file:42].
- High-slippage monitoring [file:42].
- Phishing-site interaction warnings [file:42].

### 4.5 Intelligence Event Log
- Protected actions and blocked threats [file:42].
- Saved-funds storytelling where a clear prevented-loss estimate exists [file:42].
- Time-filtered visibility for audits and trust-building [file:42].

## 5. Visual System

### 5.1 Typography
- **Zero Italicization** to reinforce stability and avoid visual cues associated with haste or instability [file:44].
- Use **Inter Tight** for headlines and **Inter** for UI and body text to maximize clarity and credibility [file:42][file:44].
- Large numeric balances should use a strong tabular treatment for fast scanning and precision.

### 5.2 Palette
- Dark-mode-first system with deep charcoal, graphite, and near-black surfaces [file:42][file:44].
- Primary accent: `#D4FF3B` [file:42][file:44].
- Danger accent: `#FF5252` [file:42][file:44].
- Supporting cool tones such as teal or cyan should only appear when they improve hierarchy, readability, or system feedback [file:42].

### 5.3 Surface Elevation System
To improve consistency for designers and AI generators, the UI should follow a defined elevation model:

- **Level 0**: App background, near-black canvas, no blur, no visible border.
- **Level 1**: Standard cards, slight contrast lift, 1px low-opacity border.
- **Level 2**: Interactive modules, subtle shadow and optional low blur.
- **Level 3**: Critical overlays, modal panels, threat drawers, strongest contrast separation.
- **Level 4**: Highest-emphasis system states such as blocking alerts or safe-mode interruptions.

Shadows should remain soft and premium, never theatrical. Glassmorphism can be used selectively on intelligence cards and overlays, but it must stay restrained and readable [file:42][file:44].

## 6. Component System
The design system should define consistent interaction states so the product remains trustworthy and predictable.

### 6.1 Buttons
- **Primary**: Lime-accent emphasis for main confirm or proceed actions.
- **Secondary**: Neutral dark buttons with bordered treatment.
- **Danger**: Red emphasis for revoke, freeze, or block-related actions.
- **Safe Mode**: Special interrupted state with high visibility and reduced competing UI.

### 6.2 States
Every interactive component should have:
- Default state.
- Hover state.
- Focus-visible state.
- Pressed state.
- Disabled state.
- Loading state.
- Error state where applicable.
- Success or complete state where appropriate.

### 6.3 Data Components
- Risk badges for Low, Medium, High, and Critical.
- Alert banners for system-wide warnings.
- Security verdict cards with clear hierarchy between summary, rationale, and recommended action.
- Event log rows with timestamp, status, prevented risk type, and amount protected where available.

## 7. Responsive Behavior
The wallet should be mobile-first and responsive across phone, tablet, and desktop.

- **Mobile**: Single-column layout, stacked cards, fixed bottom action area for key decisions.
- **Tablet**: Two-column layout for dashboard and audits when space allows.
- **Desktop**: Modular dashboard with pinned intelligence areas and more persistent secondary context.
- Cards and charts should scale without losing hierarchy or making warnings harder to parse.
- Critical verdict states should remain dominant regardless of screen width.

## 8. Accessibility
The product should feel premium without sacrificing accessibility.

- Maintain strong contrast between text, surfaces, and status states.
- Use focus-visible rings for keyboard users.
- Avoid using color alone to communicate risk; pair color with icons, labels, and descriptive copy.
- Make warnings readable for both beginners and expert users.
- Ensure dense technical information remains scannable with spacing, grouping, and progressive disclosure.
- Motion should support awareness, not distract from high-stakes decisions.

## 9. Privacy & Trust Architecture
- The Safety Engine simulates transactions in an isolated environment [file:44].
- No user identity is tied to the transaction data sent for analysis [file:44].
- Nest never stores or sees a user's private keys or seed phrase [file:44].
- Trust messaging should be surfaced in context, especially during transaction review and onboarding [file:44].

## 10. Design-Measurement Mapping
The visual and UX system should connect directly to business and safety outcomes.

| Design Decision | Intended User Effect | Product Metric |
|---|---|---|
| Prominent Threat Radar [file:42][file:44] | Users notice ecosystem risk earlier | Higher interaction with safety tools [file:42] |
| Clear Safety Verdict cards [file:42][file:44] | Users better understand transaction consequences | Better user comprehension and lower permit-slip errors [file:42] |
| Strong revoke hierarchy in Approval Guard [file:42][file:44] | Faster removal of risky approvals | More dangerous permissions revoked [file:42] |
| Adaptive onboarding by persona [file:42][file:44] | Better confidence and lower intimidation | Higher onboarding completion and improved confidence [file:42] |
| Event log and saved-funds framing [file:42] | Users perceive ongoing value and protection | More repeat engagement with the wallet safety layer [file:42] |

## 11. Delivery Roadmap
1. **V1**: Onboarding, dashboard, threat radar, approval guard, and basic simulation [file:44].
2. **V2**: Emergency Freeze, MEV Shield, and one-click Revoke All [file:42][file:44].
3. **V3**: Cross-chain risk audit across major L2s such as Base, Arbitrum, and Optimism [file:42][file:44].

## 12. Final Prompt Intent
The final design prompt should generate a premium dark-theme wallet that looks calm, modern, protective, and credible. It should feel like a high-trust fintech security product with restrained neon accents, precise typography, adaptive friction, and a clear AI safety layer that helps users make better decisions before signing risky on-chain actions [file:42][file:44].
