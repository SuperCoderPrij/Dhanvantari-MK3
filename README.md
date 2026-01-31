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

📋 Prerequisites
 
Before setting up the project, ensure you have the following installed:
1. Node.js (v18 or higher)
2. Git
3. Bun (This project uses Bun as the package manager)
 
---
 
💻 1. Install System Tools
 
macOS
Open your Terminal and run:
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Git
brew install git

# Install Bun
curl -fsSL https://bun.sh/install | bash
 
Linux (Ubuntu/Debian)
Open your Terminal and run:
# Update packages
sudo apt update

# Install Git
sudo apt install git -y

# Install Node.js (using nvm is recommended, or direct install)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash
 
Windows
Open PowerShell as Administrator:
1. Install Node.js: Download and install from nodejs.org.
2. Install Git: Download and install from git-scm.com.
3. Install Bun:
    powershell -c "irm bun.sh/install.ps1 | iex"
 
---
 
🚀 2. Project Setup (All Operating Systems)
 
Once the tools are installed, follow these steps in your terminal (Command Prompt, PowerShell, or Bash):
 
1. Clone the Repository
git clone <your-repo-url>
cd Dhanvantari-MK3
 
2. Install Dependencies
This project uses `bun` for fast dependency installation.
bun install
 
3. Setup Convex (Backend)
You need to initialize the Convex backend. This will prompt you to log in to Convex and configure your project.
npx convex dev
•
Follow the prompts in the browser to log in.
•
It will automatically create a `.env.local` file with your `CONVEX_DEPLOYMENT` and `VITE_CONVEX_URL`.
 
4. Run the Development Server
Open a new terminal window (keep `npx convex dev` running in the first one) and start the frontend:
bun dev
 
The app should now be running at `http://localhost:5173`.
 
---
 
🛠️ Troubleshooting & Additional Commands
 
•
Type Check: `bun run type-check` (Runs TypeScript validation)
•
Build for Production: `bun run build`
•
Lint Code: `bun run lint`
 
Note on Environment Variables:
If you are using the Gemini Chatbot or Blockchain features, ensure you have the necessary keys in your Convex dashboard or `.env` file as per the project documentation.
 
•
Convex Dashboard: Run `npx convex dashboard` to view your database and logs.

## 👥 Team
**BYTE**  
Openverse GDG Hackathon Submission
