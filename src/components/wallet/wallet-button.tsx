import { useAccount } from '@/src/dex';
import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import MiniWalletInfo from './MiniWalletInfo';

  export default function WalletButton() {
    const { activeAccount } = useAccount();



  if (activeAccount) {
    return <MiniWalletInfo />;
  }
  return <ConnectWalletButton />;
}


