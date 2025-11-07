import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImageIcon, UploadCloud, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Platform } from "react-native";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useFileUpload } from "../hooks/useFileUpload";
import { Media } from "../models/Media";

export interface GallerySheetProps {
  showActionsheet: boolean;
  setShowActionsheet: (show: boolean) => void;
  allowMultiple: boolean;
  maxImages: number;
  onImageUpload: (image: Media) => void;
  onClose: () => void;
}

export const GallerySheet = ({
  showActionsheet,
  setShowActionsheet,
  allowMultiple,
  maxImages,
  onImageUpload,
  onClose,
}: GallerySheetProps) => {
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(showActionsheet);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { user } = useAuth();
  const {
    isUploading: hookUploading,
    progress,
    uploadAvatar,
  } = useFileUpload();

  useEffect(() => {
    requestPermissions();
  }, []);
  useEffect(() => {
    setIsModalVisible(showActionsheet);
  }, [showActionsheet]);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant gallery permissions to select images."
        );
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: allowMultiple,
      });

      if (!result.canceled && result.assets) {
        const newImages: Media[] = result.assets.map((asset) => ({
          $id: `temp_${Date.now()}_${Math.random()}`,
          url: asset.uri,
          uri: asset.uri,
          file_name: asset.fileName || `image_${Date.now()}.jpg`,
          mime_type: asset.type || "image/jpeg",
          createdAt: new Date().toISOString(),
        }));

        setSelectedImages((prev) =>
          allowMultiple
            ? [...prev, ...newImages].slice(0, maxImages)
            : [newImages[0]]
        );
        setIsModalVisible(true);
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newImage: Media = {
          $id: `temp_${Date.now()}_${Math.random()}`,
          url: asset.uri,
          uri: asset.uri,
          file_name: asset.fileName || `photo_${Date.now()}.jpg`,
          mime_type: asset.type || "image/jpeg",
          createdAt: new Date().toISOString(),
        };
        setSelectedImages([newImage]);
        setIsModalVisible(true);
      }
    } catch (err) {
      console.error("Error taking photo:", err);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const uploadImage = async (image: Media) => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      if (image.uri) {
        const uploaded = await uploadAvatar(image.uri);
        setUploadProgress(100);
        onImageUpload?.(uploaded);
      } else {
        Alert.alert("Error", "Image URI is undefined");
      }

      setUploadProgress(100);
      setIsUploading(false);

      Alert.alert("Success", "Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageSelect = (image: Media) => {
    // onImageSelect?.(image);
    setIsModalVisible(false);
    onClose?.();
  };

  const removeImage = (imageId: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.$id !== imageId));
  };

  const renderImageItem = ({ item }: { item: Media }) => (
    <Pressable onPress={() => handleImageSelect(item)}>
      <Image source={{ uri: item.url }} size="2xl" className="rounded-md" />
      <Pressable onPress={() => removeImage(item.$id)} className="absolute bg-red-500 rounded-full p-1 top-0 right-0">
        <Icon as={X} size={16} className="stroke-white" />
      </Pressable>
    </Pressable>
  );
  return (
    <Actionsheet
      isOpen={showActionsheet}
      onClose={() => setShowActionsheet(false)}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent className="px-5">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <HStack className="justify-between w-full mt-3">
          <VStack>
            <Heading size="md" className="font-semibold">
              Upload your latest resume
            </Heading>
            <Text size="sm">JPG, PNG supported</Text>
          </VStack>
          <Pressable onPress={() => setShowActionsheet(false)}>
            <Icon as={X} size="lg" className="stroke-background-500" />
          </Pressable>
        </HStack>
        {selectedImages.length > 0 ? (
          <Box className="my-[18px] items-start justify-start p-2 rounded-xl bg-background-50 border border-dashed border-outline-300 h-[230px] w-full">
            <FlatList
              data={selectedImages}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.$id}
            />
          </Box>
        ) : (
          <Box className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[130px] w-full">
            <Icon
              as={UploadCloud}
              className="h-[62px] w-[62px] stroke-background-200"
            />
            <Text size="sm">No files uploaded yet</Text>
          </Box>
        )}
        {selectedImages.length > 0 ? (
          <Button
            className="w-full"
            onPress={async () => {
              for (const image of selectedImages) {
                await uploadImage(image);
              }
              setSelectedImages([]);
              setShowActionsheet(false);
            }}
          >
            <Icon
              as={UploadCloud}
              size="lg"
              className="stroke-background-500"
            />
            <ButtonText>Upload</ButtonText>
          </Button>
        ) : (
          <ButtonGroup className="w-full">
            <Button className="w-full" onPress={() => takePhoto()}>
              <Icon as={Camera} size="lg" className="stroke-background-500" />
              <ButtonText>Camera</ButtonText>
            </Button>
            <Button className="w-full" onPress={() => pickImageFromGallery()}>
              <Icon
                as={ImageIcon}
                size="lg"
                className="stroke-background-500"
              />
              <ButtonText>Gallery</ButtonText>
            </Button>
          </ButtonGroup>
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
};
