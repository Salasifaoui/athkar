import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable } from "react-native";
import { Media } from "../models/Media";
import { GallerySheet } from "./GallerySheet";

interface ImageSelectComponentProps {
  selectedImages: Media[];
  setSelectedImages: (images: Media[]) => void;
  updateLoading: boolean;
  text?: string;
}
export default function ImageSelectComponent({
  selectedImages,
  setSelectedImages,
  updateLoading,
  text,
}: ImageSelectComponentProps) {
  const [showGallerySheet, setShowGallerySheet] = useState(false);
  const handleRemoveImage = (imageId: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.$id !== imageId));
  };

  const handleImageUpload = (image: Media) => {
    setSelectedImages((prev) => [...prev, image]);
    setShowGallerySheet(false);
  };

  const renderImageItem = ({ item }: { item: Media }) => (
    <Box className="mr-2 ">
      <Image
        source={{ uri: item.url }}
        size="lg"
        className="rounded-lg w-20 h-20"
      />
      <Pressable
        onPress={() => handleRemoveImage(item.$id)}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
      >
        <Icon as={X} size={12} className="stroke-white" />
      </Pressable>
    </Box>
  );
  return (
    <>
      <VStack className="gap-2">
        {text && (
          <Text className="text-right text-md font-medium text-gray-700 mb-2">
            {text}
          </Text>
        )}

        {/* Selected Images FlatList */}
        {selectedImages.length > 0 && (
          <HStack className="mb-3 gap-2">
            <FlatList
              data={selectedImages}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.$id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </HStack>
        )}

        {/* Add Image Button */}
        <Pressable
          onPress={() => setShowGallerySheet(true)}
          disabled={updateLoading}
          className="bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4 items-center justify-center min-h-[100px]"
        >
          <Icon as={Plus} size={24} className="text-primary-400 mb-2" />
          <Text className="text-gray-500 text-sm">
            {selectedImages.length > 0
              ? "إضافة المزيد من الصور"
              : "إضافة صور للمنتج"}
          </Text>
        </Pressable>
        {/* GallerySheet for image selection */}
        
      </VStack>
      <GallerySheet
          showActionsheet={showGallerySheet}
          setShowActionsheet={setShowGallerySheet}
          allowMultiple={true}
          maxImages={10}
          onImageUpload={handleImageUpload}
          onClose={() => setShowGallerySheet(false)}
        />
    </>
  );
}
