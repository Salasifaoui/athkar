import { AvatarList } from "@/components/icons/icons";
import { AvatarItem } from "../avatar-item/avatar-item";
import { ZixAvatar } from "../zix-avatar/zix-avatar";

export type UserAvatarProps = {
  size?: number;
  user?: any;
  backgroundColor?: string;
  textColor?: string;
  showInitials?: boolean;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 50,
  backgroundColor = '#FF6B6B',
  textColor = '#FFFFFF',
  showInitials = true,
  ...props
}) => {
  // Check if user has a custom avatar icon (from AvatarList)
  const hasCustomAvatar = user?.avatar && 
    user?.avatar !== '' && 
    user?.avatar in AvatarList;

  if (hasCustomAvatar) {
    return (
      <AvatarItem
        nameIcon={user?.avatar as keyof typeof AvatarList}
        color='transparent'
        size={size}
      />
    );
  }

  // Use ZixAvatar for all other cases (images, initials, or default icon)
  return (
    <ZixAvatar
      media={user}
      name={user?.name || user?.displayName || user?.email?.split('@')[0]}
      email={user?.email}
      size={size}
      backgroundColor={backgroundColor}
      textColor={textColor}
      showInitials={showInitials}
      {...props}
    />
  );
};

export default UserAvatar;
