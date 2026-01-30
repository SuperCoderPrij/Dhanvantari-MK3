# 🧪 Dhanvantari
### Blockchain-Based Pharmaceutical Anti-Counterfeiting System

Dhanvantari is a web-based platform designed to prevent the sale of **fake, expired, and overpriced medicines** using **blockchain technology and AI-powered verification**.  
Each medicine is assigned a **unique ERC-721 NFT**, giving it a **tamper-proof digital identity** that can be verified instantly using a QR code.

The platform is named **Dhanvantari**, inspired by Lord Dhanvantari—the Hindu deity of health and medicine—symbolizing healing, protection, and trust.

---

## 🚨 Problem Statement
The pharmaceutical supply chain faces serious challenges:
- Expired medicines sold as valid
- Fake and duplicate medicines in circulation
- Overpricing of genuine medicines
- No simple way for consumers to verify authenticity

Most existing solutions rely on **centralized systems**, which can be altered or misused.

---

## ✅ Our Solution
Dhanvantari provides a **decentralized verification system** where:
- Every medicine unit is minted as a **unique ERC-721 NFT**
- Critical data is stored **immutably on the blockchain**
- A **QR code** links the physical medicine to its blockchain record
- Consumers verify authenticity instantly by scanning the QR code

---

## 🏗️ System Overview
Dhanvantari consists of three main components:
1. **Manufacturer Portal** – Mint medicines and generate QR codes  
2. **Consumer Dashboard** – Scan and verify medicines  
3. **Blockchain Layer** – Store immutable medicine data  

All components are connected through a secure, real-time backend.

---

## 🏭 Manufacturer Workflow
- Manufacturers register medicines using the portal
- Each medicine batch is minted as an **ERC-721 NFT**
- NFT stores:
  - Batch ID
  - Expiry date
  - Official MRP
  - Manufacturer details
- A **unique QR code** is generated for each NFT
- QR codes are printed and attached during manufacturing

Any attempt to remove, replace, or reuse a QR code is detected as **fraud**.

---

## 👤 Consumer Workflow
- Consumers scan the QR code using the web app
- The app fetches data directly from the blockchain
- Displays:
  - Authenticity status
  - Expiry date
  - Official MRP
  - Manufacturer information
- Fake, expired, or altered medicines are flagged instantly

---

## 🔐 Fraud Detection Mechanism
- Each QR code is linked to a **single unique NFT**
- NFTs cannot be duplicated or modified
- Batch-level verification prevents QR reuse
- Any mismatch results in verification failure

---

## 🤖 Google Technologies Used
- **Google Gemini AI Chatbot** to answer app-related questions  
- **Ask Gemini (Medicine Scan)** to provide dosage, usage, and safety information  
- **Google Maps** to add and display verified manufacturer locations  
- Cloud-ready architecture compatible with Google’s ecosystem  

This ensures users can **verify medicines and understand how to take them safely**.

---

## 🧰 Technology Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- React Router

### Backend
- Convex
- Convex Auth
- n8n Cloud (workflow automation)

### Blockchain
- Polygon Amoy Testnet
- Solidity (ERC-721 Smart Contract – PharmaNFT)
- Ethers.js

### Utilities
- html5-qrcode
- Sonner (notifications)
- Lucide React (icons)
- MetaMask (wallet integration)

---

## 🚀 Feasibility & Scalability
- Fully prototype-ready
- Low-cost blockchain transactions
- Hackathon-feasible implementation
- Scalable to pharmacies, distributors, and regulators

---

## 🔮 Future Enhancements
- Advanced Gemini AI health assistance
- Government drug authority integration
- Automated recall alerts
- Mobile application support
- National medicine authenticity registry

---

## 🏆 Impact
- Reduces counterfeit medicine circulation
- Protects consumer health
- Ensures price transparency
- Builds trust using cryptographic proof

---

## 👥 Team
**BYTE**  
Openverse GDG Hackathon Submission
