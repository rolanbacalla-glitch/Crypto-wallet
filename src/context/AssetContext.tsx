import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { type Asset } from '../types/asset';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface AssetContextType {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (symbol: string) => void;
  isLoading: boolean;
}

const DEFAULT_ASSETS: Asset[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '12.42 ETH', value: '£17,688.14', price: '£1,424.12', score: 98, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { symbol: 'USDC', name: 'USD Coin', balance: '14,204.30 USDC', value: '£14,204.30', price: '£1.00', score: 99, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
  { symbol: 'SOL', name: 'Solana', balance: '42.15 SOL', value: '£5,992.42', price: '£142.15', score: 72, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { symbol: 'LINK', name: 'Chainlink', balance: '184.20 LINK', value: '£3,392.80', price: '£18.42', score: 94, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png' },
  { symbol: 'PEPE', name: 'Pepe', balance: '1.2B PEPE', value: '£534.48', price: '£0.00000044', score: 24, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png' },
];

export const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS);
  const [isLoading, setIsLoading] = useState(false);

  // Load from Cloud on Login
  useEffect(() => {
    if (!user?.uid) return;

    const loadAssets = async () => {
      setIsLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid!));
        if (userDoc.exists() && userDoc.data()?.assets) {
          setAssets(userDoc.data()?.assets);
        } else {
          // If fresh user, persist defaults to cloud
          await setDoc(doc(db, 'users', user.uid!), { assets: DEFAULT_ASSETS }, { merge: true });
        }
      } catch (error) {
        console.error("Failed to load assets from Cloud:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [user?.uid]);

  const syncToCloud = async (newAssetList: Asset[]) => {
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid), { assets: newAssetList }, { merge: true });
      } catch (error) {
        console.error("Failed to sync assets to Cloud:", error);
      }
    }
  };

  const addAsset = (newAsset: Asset) => {
    setAssets(prev => {
      const newList = [newAsset, ...prev];
      syncToCloud(newList);
      return newList;
    });
  };

  const removeAsset = (symbol: string) => {
    setAssets(prev => {
      const newList = prev.filter(a => a.symbol !== symbol);
      syncToCloud(newList);
      return newList;
    });
  };

  return (
    <AssetContext.Provider value={{ assets, addAsset, removeAsset, isLoading }}>
      {children}
    </AssetContext.Provider>
  );
};
