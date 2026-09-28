# ForensicChain: Decentralized Evidence Management & AI Assistant

![Forensic Ecosystem](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Build-MERN-blue?style=for-the-badge)
![Web3](https://img.shields.io/badge/Blockchain-Ethereum-8A2BE2?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Forensic%20Sketch-critical?style=for-the-badge)

**ForensicChain** is a state-of-the-art evidence management system that ensures absolute data integrity and admissibility using Blockchain technology. It features a premium, high-tech interface with real-time AI forensic sketching and decentralized storage.

---

## 💎 Premium Features

### 🛡️ Immutable Chain of Custody
Every forensic asset is cryptographically hashed (SHA-256) and anchored to the Ethereum blockchain. Any alteration to the data will immediately invalidate the cryptographic fingerprint.

### 🤖 Forensic AI Sketch Generation & Reporting
Investigators can generate highly detailed composite sketches from witness descriptions using the integrated **FLUX.1-schnell** AI model.
- **Streamlined Match Analysis**: Instantly compares generated sketches against the criminal database using perceptual hashing, displaying high-probability matches with a clean, responsive UI.
- **Contextual Intelligence**: Pulls crime scene context and environmental analysis directly into the visual report.

### 🔍 Audit Console (Public Verification)
A dedicated, public-facing portal that allows anyone to verify the integrity of a file by comparing its local hash against the immutable blockchain record.

### 📊 Super Admin Dashboard
- **Telemetry Ticker**: Real-time blockchain and IPFS node status.
- **Activity Log**: Instant notification system for all forensic events.
- **Officer Management**: Professional onboarding for authorized investigators.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Framer Motion, Tailwind CSS (Glassmorphism) |
| **Backend** | Node.js, Express, MongoDB (Mongoose) |
| **Blockchain** | Solidity, Hardhat, Ethers.js |
| **AI** | Hugging Face (FLUX.1), Neural-styled UI |
| **Storage** | IPFS (InterPlanetary File System) |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)
- Hardhat (Included in dev dependencies)
- Metamask Wallet (Browser Extension)

### 1. Blockchain Node
```bash
cd blockchain
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```
> [!IMPORTANT]
> Copy the deployed **Contract Address** and update it in `server/.env` and `client/src/pages/VerifyEvidence.jsx`.

### 2. API Server
```bash
cd server
npm install
# Create .env based on .env.example
npm run dev
```

### 3. Client Dashboard
```bash
cd client
npm install
npm run dev
```

---

## 📂 Environment Variables

### Backend (`server/.env`)
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for authentication.
- `CONTRACT_ADDRESS`: The deployed smart contract address.
- `HF_API_TOKEN`: Your Hugging Face access token for AI generation.
- `PRIVATE_KEY`: Ethereum wallet private key for automated signing.

### Frontend (`client/.env`)
- `VITE_API_URL`: The URL of the backend API (e.g., `http://localhost:5000`).

---

## 📜 Academic Disclaimer
This project is developed for research and educational purposes, demonstrating the fusion of Web3 and Generative AI in modern digital forensics.

---
© 2026 ForensicChain Team. Secure. Transparent. Immutable.
