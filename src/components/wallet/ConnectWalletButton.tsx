import { useModal, useWalletConnect } from '@/src/dex/hooks';
import { Wallet2 } from 'lucide-react-native';
import ButtonAction from '../ButtonAction';
export default function ConnectWalletButton() {
    const { connectingWallet} = useWalletConnect();
    const { openModal } = useModal();
  return (
    <ButtonAction
      text="Connect Wallet"
      onPress={() => openModal({
        name: 'connect-wallet',
      })}
      iconAs={Wallet2}
      colorIconAs="text-white"
      variant="solid"
      action="primary"
      loading={connectingWallet}
    />
  );
}