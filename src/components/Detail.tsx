import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TouchableOpacity } from 'react-native';

interface DetailProps {
  item: {
    icon: React.ReactNode;
    text: string;
    component: React.ReactNode;
    onPress: () => void;
  };
}

const Detail = ({ item }: DetailProps) => {
  const { icon, text, component, onPress } = item;

  let touchableOpacityProps = {};
  if (onPress && typeof onPress === 'function') {
    touchableOpacityProps = { onPress };
  }

  const body = (
    <Box className="p-2">
      {text ? <Text className="text-xs">{text}</Text> : null}
      {component && component}
    </Box>
  );

  return (
    <TouchableOpacity style={{ flex: 1 }} {...touchableOpacityProps}>
      <HStack className="items-center justify-center p-2">
        {/* <Icon
          as={icon}
          size="xl"
          style={{ color: '#ccc' }}
        /> */}
        {body}
        {onPress && typeof onPress === 'function' && (
          <Icon size="xl" as={ChevronRightIcon} style={{ color: '#ccc' }} />
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default Detail;