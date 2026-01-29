import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export const POLYGON_AMOY_CHAIN_ID = '0x13882'; // 80002 in hex

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log("Requesting MetaMask accounts...");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Accounts received:", accounts);
        
        const chain = await window.ethereum.request({ method: 'eth_chainId' });
        console.log("Chain ID received:", chain);
        
        setAccount(accounts[0]);
        setChainId(chain);
        setProvider(new ethers.BrowserProvider(window.ethereum));
        
        toast.success("Wallet connected");
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        // Handle user rejection specifically
        if (error.code === 4001) {
          toast.error("Connection rejected by user");
        } else {
          toast.error(`Failed to connect wallet: ${error.message || "Unknown error"}`);
        }
      }
    } else {
      console.error("MetaMask not found in window.ethereum");
      toast.error("MetaMask is not installed");
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    toast.info("Wallet disconnected");
  }, []);

  const switchToAmoy = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_AMOY_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: POLYGON_AMOY_CHAIN_ID,
                chainName: 'Polygon Amoy Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                blockExplorerUrls: ['https://amoy.polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Amoy chain:", addError);
          toast.error("Failed to add Polygon Amoy network");
        }
      } else {
        console.error("Error switching to Amoy chain:", switchError);
        toast.error("Failed to switch to Polygon Amoy network");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null);
      };

      const handleChainChanged = (chain: string) => {
        setChainId(chain);
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          window.ethereum.request({ method: 'eth_chainId' }).then((chain: string) => {
            setChainId(chain);
            setProvider(new ethers.BrowserProvider(window.ethereum));
          });
        }
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return {
    account,
    chainId,
    provider,
    connectWallet,
    disconnectWallet,
    switchToAmoy
  };
}