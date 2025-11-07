import { Button, ButtonIcon } from '@/components/ui/button';
import { Facebook } from 'lucide-react-native';
import React from 'react';

export default function FacebookButton({ onPress, className }: { onPress: () => void, className: string }) {

  return (
    <Button
      style={{ backgroundColor: "#4267B2" }}
      size="sm"
      onPress={onPress}
      className={className}>
      <ButtonIcon as={Facebook} width={24} height={24} className="text-white" />

    </Button>
  );
};
