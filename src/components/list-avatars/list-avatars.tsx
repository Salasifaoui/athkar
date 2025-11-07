import { Media } from "@/src/models/Media";

import { useUpdateProfile } from "@/src/features/profile/hooks/userUpdateProfile";
import { StyleSheet } from "react-native";
import { Gallery } from "../gallery";

interface ListAvatarsProps {
  userProfile: any;
  showGallery: boolean;
  setShowGallery: (show: boolean) => void;
}

export const ListAvatars = ({
  userProfile,
  showGallery,
  setShowGallery,
}: ListAvatarsProps) => {
  const { updateProfile } = useUpdateProfile();

  // const { updateUserProfile, isLoading, error, clearError } =
  //   useUserProfileUpdate();

  const handleImageUpload = async (
    type: string,
    selectedMedia: Media | Media[] | string
  ) => {
    if (type === "image") {
      await updateProfile(userProfile.userId, {
        imageUrl: selectedMedia.url,
        avatar: "",
      });
      setShowGallery(false);
    } else if (type === "avatar") {
      await updateProfile(userProfile.userId, {
        avatar: selectedMedia as string,
      });
      setShowGallery(false);
    }
  };

  return (
    <>
      <Gallery
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onImageUpload={(media: Media | Media[]) =>
          handleImageUpload("image", media)
        }
        maxImages={1}
        allowMultiple={false}
        showUploadButton={true}
        showGalleryButton={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  styldButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    backgroundColor: "#FF6B6B",
  },
});
