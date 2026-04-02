Below is a PRD for the **AI Wallet Safety Copilot** product, written from discovery through delivery. The core product thesis is that wallet UX failures often become irreversible monetary losses, so the product should use AI to explain, warn, and block risky actions before signing.  

## Product brief

**Product name:** Wallet Safety Copilot  
**One-line description:** An AI layer inside a crypto wallet that explains transactions, detects risk, and helps users avoid scams and irreversible mistakes.  
**Primary outcome:** Reduce user loss from phishing, bad approvals, wrong-network sends, and misunderstood transactions.  

## Discovery

### Problem statement

Crypto wallet users still struggle with setup, transaction status, fees, recovery, and supported assets, and these issues can lead to dangerous errors and permanent loss of funds. The research also shows users often import mental models from traditional payments, expecting reversibility or cancellation where none exists.  

### Research insight

The biggest insight is that wallet failures are mostly **decision failures**, not just interface failures. Users need help understanding what a transaction does, whether it is reversible, whether an approval is dangerous, and whether the destination is trustworthy.  

### Target users

- New crypto users who need guidance and reassurance.
- Intermediate users who interact with DeFi, bridges, and approvals.
- Power users who want automation, but with guardrails.  

### Key user jobs

- Send and receive assets safely.
- Understand what a contract approval means.
- Detect scams and suspicious addresses.
- Recover from setup mistakes.
- Manage assets across chains without confusion.  

## Product goal

The goal is to make the wallet behave like a **trusted co-pilot** that translates blockchain actions into plain language and reduces harmful mistakes before they happen. This matters because phishing, social engineering, and scam-driven losses remain large and are increasingly AI-assisted.  

## Non-goals

- The product will not promise profits or trading signals.
- It will not fully automate transactions by default.
- It will not replace the wallet’s core custody, signing, or chain functionality.  
These limits matter because crypto scams often exploit overconfidence and blind automation.  

## Core experience

### 1. Transaction explanation

Before signing, the app explains the transaction in plain English: what asset moves, where it goes, what permissions it grants, and whether it can be reversed. This directly addresses the misunderstanding that crypto transactions are free, cancellable, or reversible.  

### 2. Risk scoring

The system assigns a simple risk label, such as low, medium, or high, based on wallet destination, contract behaviour, approval size, and known scam patterns. The purpose is not perfect prediction, but timely friction before a costly mistake.  

### 3. Approval monitor

The app watches approvals over time and warns when a user grants broad or long-lived permissions. That is especially important because scams increasingly use social engineering rather than obvious technical exploits.  

### 4. Safe defaults

For novice users, the wallet defaults to safer settings for gas, slippage, approvals, and recovery flows. The design should support separate novice and advanced modes, which aligns with the research recommendation to create distinct profiles for different experience levels.  

## Scope by phase

### Discovery

- Review wallet support tickets, app reviews, and scam case studies.
- Interview novice and experienced wallet users.
- Map the top loss scenarios: wrong network, phishing, approval abuse, and asset confusion.  

### Definition

- Prioritise the top three user failures.
- Define what the AI can explain, detect, and block.
- Establish guardrails for false positives and user override.  

### Design

- Prototype the pre-signing flow.
- Test warning language for comprehension and trust.
- Design a progressive disclosure model so beginners see more help than experts.  

### Build

- Implement transaction parsing and heuristic risk rules.
- Add AI explanation generation with strict templates.
- Integrate scam/address intelligence and approval tracking.  

### Launch

- Release to a limited beta cohort.
- Monitor override rates, warning acceptance, and prevented-risk events.
- Iterate on copy, thresholds, and onboarding.  

## Requirements

### Functional

- Explain any transaction before signing.
- Flag high-risk contracts, addresses, and approvals.
- Detect patterns associated with phishing or address poisoning.
- Support novice and advanced modes.
- Save an activity history of warnings and accepted risks.  

### Non-functional

- Explanations must be fast enough to avoid adding friction.
- Warnings must be understandable without crypto expertise.
- Security checks must fail safely, not silently.
- The product must preserve user control over final signing decisions.  

## Success metrics

- Fewer failed or abandoned transactions caused by confusion.
- Higher user comprehension of transaction consequences.
- Lower approval misuse and phishing-related loss events.
- Increased trust in the wallet during onboarding and first transactions.  

## Risks

The biggest risk is warning fatigue, where users start ignoring every alert. Another risk is false confidence if the AI misses a scam or overstates certainty, especially in a market where attackers continuously change tactics.  

## Recommendation

I recommend shipping this as a **smart wallet safety layer**, not as a general AI crypto assistant. That is the strongest product wedge because it targets the highest-value pain point: preventing irreversible loss at the moment of signing.  

## Delivery plan

1. Start with transaction explanation and approval warnings.
2. Add scam detection and address risk scoring.
3. Expand into recovery guidance and novice onboarding.
4. Only later consider optional automation and deeper DeFi intelligence.  
