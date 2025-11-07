
import { User } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export type ZixAvatarProps = {
  size?: number;
  media?: any;
  name?: string;
  email?: string;
  backgroundColor?: string;
  textColor?: string;
  showInitials?: boolean;
};

export const ZixAvatar: React.FC<ZixAvatarProps> = ({
  media,
  name,
  email,
  size = 40,
  backgroundColor = '#FF6B6B',
  textColor = '#FFFFFF',
  showInitials = true,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  // const [imageLoading, setImageLoading] = useState(true);

  // Priority order: media.imageUrl -> media.avatar -> ui-avatars.com -> initials -> default icon
  const mediaUrl = useMemo(() => {
    // Check for direct image URL
    if (media?.imageUrl && !imageError) return media.imageUrl;
    
    // Check for avatar URL
    if (media?.avatar && !imageError) return media.avatar;
    
    // Check for profile picture
    if (media?.profilePicture && !imageError) return media.profilePicture;

    // If we have a name, generate avatar from ui-avatars.com
    if (name && !imageError) {
      const params = new URLSearchParams();
      params.append('name', name);
      params.append('size', size.toString());
      params.append('background', backgroundColor.replace('#', ''));
      params.append('color', textColor.replace('#', ''));
      params.append('bold', 'true');
      params.append('format', 'png');
      return `https://ui-avatars.com/api/?${params.toString()}`;
    }

    return null;
  }, [name, media, imageError, size, backgroundColor, textColor]);

  // Generate initials from name
  const initials = useMemo(() => {
    if (!name) return null;
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }, [name]);

  const handleImageError = () => {
    setImageError(true);
    // setImageLoading(false);
  };

  // const handleImageLoad = () => {
  //   setImageLoading(false);
  // };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View style={[avatarStyle, (props as any).style]} {...props}>
      {mediaUrl && !imageError ? (
        <Image
          source={{ uri: mediaUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
          onError={handleImageError}
          // onLoad={handleImageLoad}
        />
      ) : showInitials && initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.4, color: textColor }]}>
          {initials}
        </Text>
      ) : (
        <User size={size * 0.6} color={textColor} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 0,
  },
  initials: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ZixAvatar;