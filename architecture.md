# Architecture Overview - Wallet Safety Copilot

## Core Architecture
Wallet Safety Copilot follows a **Smart-Account-First** (Account Abstraction) approach, decoupling the signer (private key) from the account logic (smart contract).

### Component Layers
1. **Frontend (Vite + React)**: Responsive UI for wallet management, transaction preview, and safety alerts.
2. **Safety Copilot Engine (Middleware)**:
    - **Transaction Simulator**: Decodes `eth_sendTransaction` or `eth_sign` requests into human-readable intent.
    - **Risk Scorer**: Evaluates destination addresses, contract interactions, and approval patterns against known safety databases.
    - **Progressive Disclosure Manager**: Adjusts visual detail based on user profile (Beginner/Advanced).
3. **Execution Layer**:
    - **Bundler Integration**: (Mocked for V1) Interfaces with ERC-4337 bundlers.
    - **Signer**: Secure local storage or TEE-based signing (Mocked for V1).

## Data Flow
User Action -> Copilot Simulation -> Risk Analysis -> Safety Preview -> User Selection (Approve/Reject) -> Signing -> Broadcast.
