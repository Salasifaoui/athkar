import Avatar1Icon from '@/components/icons/avatars/avatar-1.svg';
import { AvatarList } from "@/components/icons/icons";
import { View } from "react-native";

export const AvatarItem = ({
  nameIcon,
  color,
  size,
  ...props
}: {
  nameIcon: keyof typeof AvatarList;
  color: string;
  size: number;
}) => {
  const Avatar = AvatarList[nameIcon as keyof typeof AvatarList];

console.log("Avatar1Icon", Avatar1Icon);
  return (
    <View
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        ...props,
      }}
    >
      {/* <Avatar width={size} height={size} /> */}
      {/* <Icon as={Avatar1Icon} style={{ width: size, height: size }} /> */}
    </View>
  );
};
