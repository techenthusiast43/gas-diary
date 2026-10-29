# GasDiary ⛽📖

**GasDiary** is a gas-fee tracking and expense annotation dApp built for **BOT Chain Testnet** (Chain ID: `968`).

It connects directly with your Web3 wallet (MetaMask, Rabby, etc.) and the BOT Chain Blockscout explorer to calculate transaction fees, monitor gas trends over time, identify failed transactions, categorize DeFi and contract interactions, and save verifiable expense memos on-chain via `GasDiary.sol`.

---

## 🚀 Key Features

1. **Live Gas Analytics**
   - Total gas fees paid in native **BOT** (with fiat conversion estimates).
   - Average transaction cost and total transaction counts.
   - Failed transaction tracking and wasted gas metrics.
   - Peak gas transaction highlight.

2. **Visual Spending Trends**
   - **Daily Gas Spending Timeline**: Interactive bar chart displaying fee totals and transaction activity per day.
   - **Expense Category Distribution**: Visual breakdown across DeFi Swaps, NFT Mints, Token Transfers, Staking, Governance, and Deployments.

3. **Smart Contract Integration (`GasDiary.sol`)**
   - Self-sovereign on-chain annotations linked directly to your wallet address.
   - Stores category labels, transaction hashes, and personal notes on BOT Chain.
   - Batch tagging and tag removal support.
   - Local fallback storage mode for zero-gas test runs.

4. **Tax & Bookkeeping Export**
   - Export full transaction history as formatted **CSV** files with direct links to the Bohr Block Explorer (`https://scan.bohr.life`).

5. **Demo Mode / Live Mode**
   - Pre-loaded with realistic BOT Chain transactions so you can explore the full dashboard even before funding a new testnet wallet.

---

## 🌐 BOT Chain Network Parameters

| Parameter | Value |
|---|---|
| **Network Name** | BOT Chain Testnet |
| **Chain ID** | `968` |
| **Currency Symbol** | `BOT` |
| **Decimals** | `18` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life/](https://scan.bohr.life/) |
| **Blockscout API** | `https://scan.bohr.life/api/v2` |

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Smart Contract Tooling (Hardhat)

Compile `GasDiary.sol`:
```bash
npm run compile
```

Run contract unit tests:
```bash
npm run test:contract
```

Deploy to BOT Chain Testnet:
```bash
# Add your private key in .env or environment variable
export PRIVATE_KEY="0x..."
npm run deploy:bot
```

---

## 📂 Project Structure

```text
gas-diary/
├── contracts/
│   └── GasDiary.sol           # Solidity smart contract for on-chain tags
├── scripts/
│   └── deploy.cjs             # Hardhat deployment script
├── test/
│   └── GasDiary.test.cjs      # Comprehensive contract unit tests
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Brand header & wallet connection
│   │   ├── StatsCards.tsx     # Key metric overview cards
│   │   ├── AnalyticsCharts.tsx # Daily timeline & category breakdown
│   │   ├── TransactionTable.tsx # Searchable, filterable tx list
│   │   └── TagModal.tsx       # On-chain / local annotation modal
│   ├── config/
│   │   ├── chain.ts           # BOT Chain viem definition
│   │   └── wagmi.ts           # Reown AppKit & Wagmi configuration
│   ├── contracts/
│   │   └── GasDiaryABI.ts     # GasDiary contract ABI
│   ├── services/
│   │   ├── explorerApi.ts     # Blockscout v2 fetcher & sample data
│   │   ├── analytics.ts       # Stats & timeline calculators
│   │   └── csvExport.ts       # Formatted CSV exporter
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # Main dApp component
│   ├── main.tsx               # Entry point with Web3 providers
│   └── index.css              # Custom Vanilla CSS design system
├── hardhat.config.cjs         # Hardhat network & paths configuration
├── package.json
└── vite.config.ts
```
