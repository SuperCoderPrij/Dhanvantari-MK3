import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { POLYGON_AMOY_CHAIN_ID } from "@/hooks/use-web3";

interface WalletAlertsProps {
  account: string | null;
  chainId: string | null;
  connectWallet: () => void;
  switchToAmoy: () => void;
}

export function WalletAlerts({ account, chainId, connectWallet, switchToAmoy }: WalletAlertsProps) {
  if (!account) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-yellow-400" />
          <div>
            <h3 className="font-medium text-yellow-400">Wallet Connection Required</h3>
            <p className="text-sm text-yellow-400/80">You need to connect your MetaMask wallet to mint NFTs.</p>
          </div>
        </div>
        <Button 
          onClick={connectWallet}
          variant="outline" 
          className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
        >
          Connect Wallet
        </Button>
      </motion.div>
    );
  }

  if (chainId !== POLYGON_AMOY_CHAIN_ID) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-medium text-purple-400">Wrong Network</h3>
            <p className="text-sm text-purple-400/80">Please switch to Polygon Amoy Testnet to mint NFTs.</p>
          </div>
        </div>
        <Button 
          onClick={switchToAmoy}
          variant="outline" 
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          Switch Network
        </Button>
      </motion.div>
    );
  }

  return null;
}
