import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useWeb3, POLYGON_AMOY_CHAIN_ID } from "@/hooks/use-web3";
import { ethers } from "ethers";
import { PHARMA_NFT_ABI, PHARMA_NFT_ADDRESS } from "@/lib/blockchain";
import { WalletAlerts } from "./components/WalletAlerts";
import { CreateMedicineForm } from "./components/CreateMedicineForm";

export default function CreateMedicine() {
  const navigate = useNavigate();
  const createMedicine = useMutation(api.medicines.createMedicine);
  const user = useQuery(api.users.currentUser);
  const { account, connectWallet, chainId, switchToAmoy, provider } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    if (!account) {
      toast.error("Wallet not connected", {
        description: "Please connect your MetaMask wallet to mint NFTs."
      });
      connectWallet();
      return;
    }

    if (chainId !== POLYGON_AMOY_CHAIN_ID) {
      toast.error("Wrong Network", {
        description: "Please switch to Polygon Amoy Testnet."
      });
      switchToAmoy();
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get("quantity"));

    try {
      const signer = await provider?.getSigner();
      if (!signer) throw new Error("No signer available");

      const contract = new ethers.Contract(PHARMA_NFT_ADDRESS, PHARMA_NFT_ABI, signer);

      const medicineName = formData.get("medicineName") as string;
      const batchNumber = formData.get("batchNumber") as string;
      const manufacturerName = formData.get("manufacturerName") as string || user.name || "Unknown Manufacturer";
      const expiryDate = formData.get("expiryDate") as string;
      const manufacturingDate = formData.get("manufacturingDate") as string;
      const medicineType = formData.get("medicineType") as string;
      const mrp = Number(formData.get("mrp"));

      const metadata = {
        name: `${medicineName} - Batch ${batchNumber}`,
        description: `Authentic ${medicineName} manufactured by ${manufacturerName}`,
        image: "https://vly.ai/logo.png",
        attributes: [
            { trait_type: "Batch", value: batchNumber },
            { trait_type: "Manufacturer", value: manufacturerName },
            { trait_type: "Expiry", value: expiryDate },
            { trait_type: "Type", value: medicineType }
        ]
      };

      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      const medicineIdUUID = crypto.randomUUID();

      toast.info("Confirm Transaction", {
        description: "Please confirm the minting transaction in MetaMask...",
        style: { color: "black", backgroundColor: "white" }
      });

      const tx = await contract.mintMedicine(
        account,
        tokenURI,
        medicineIdUUID,
        batchNumber,
        manufacturerName,
        expiryDate,
        manufacturingDate
      );

      const loadingToastId = toast.loading("Minting in progress...", {
        description: "Waiting for blockchain confirmation...",
        style: { color: "black", backgroundColor: "white" }
      });

      const receipt = await tx.wait();
      console.log("Transaction Receipt:", receipt);
      
      let tokenId = "";
      
      if (receipt && receipt.logs) {
        console.log("Receipt Logs:", receipt.logs);
        for (const log of receipt.logs) {
          try {
              const parsed = contract.interface.parseLog(log);
              console.log("Parsed Log:", parsed);
              if (parsed) {
                if (parsed.name === "MedicineMinted") {
                    tokenId = parsed.args[0].toString();
                    console.log("Found TokenID from MedicineMinted:", tokenId);
                    break;
                }
                if (parsed.name === "Transfer") {
                    tokenId = parsed.args[2].toString();
                    console.log("Found TokenID from Transfer:", tokenId);
                }
              }
          } catch (e) { 
            console.log("Failed to parse log:", e);
            continue; 
          }
        }
      }

      if (!tokenId) {
        console.error("Token ID not found in logs. Logs available:", receipt?.logs);
        throw new Error("Failed to retrieve Token ID from transaction logs. The transaction may have succeeded but the event was not found.");
      }

      await createMedicine({
        medicineName,
        manufacturerName,
        batchNumber,
        medicineType,
        manufacturingDate,
        expiryDate,
        mrp,
        quantity: quantity,
        tokenId: tokenId,
        transactionHash: receipt.hash,
        contractAddress: PHARMA_NFT_ADDRESS,
        qrCodeData: JSON.stringify({
          contract: PHARMA_NFT_ADDRESS,
          tokenId: tokenId,
          batch: batchNumber
        }),
      });

      toast.dismiss(loadingToastId);
      toast.success("Medicine Minted Successfully", {
        description: `Token ID: ${tokenId} minted on Polygon Amoy.`,
        style: { color: "black", backgroundColor: "white" }
      });
      navigate("/manufacturer/medicines");
    } catch (error: any) {
      console.error(error);
      toast.dismiss();
      toast.error("Failed to mint medicine", {
        description: error.reason || error.message || "Transaction failed",
        style: { color: "black", backgroundColor: "white" }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/manufacturer/medicines">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Mint New Medicine</h1>
          <p className="text-gray-400">Create a digital twin NFT for your medicine batch</p>
        </div>
      </motion.div>

      <WalletAlerts 
        account={account} 
        chainId={chainId} 
        connectWallet={connectWallet} 
        switchToAmoy={switchToAmoy} 
      />

      <CreateMedicineForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        account={account}
        chainId={chainId}
        defaultManufacturerName={user?.name}
      />
    </div>
  );
}