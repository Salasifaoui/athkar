// import { useUploadFile } from '@/src/appwrite/storage/useFileUpload';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useFileUpload } from '@/src/hooks/useFileUpload';
import { Media } from '@/src/models/Media';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ZixAlertActions } from '../../../components/ui/zix-alert-actions/zix-alert-actions';

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 3;

export interface GalleryProps {
  // onImageSelect?: (image: Media) => void;
  onImageUpload?: (image: Media) => void;
  maxImages?: number;
  allowMultiple?: boolean;
  showUploadButton?: boolean;
  showGalleryButton?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  // onImageSelect,
  onImageUpload,
  maxImages = 10,
  allowMultiple = false,
  showUploadButton = true,
  showGalleryButton = true,
  visible = false,
  onClose,
}) => {
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { user } = useAuth();
  const { isUploading: hookUploading, progress, uploadAvatar } = useFileUpload();


  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant gallery permissions to select images.');
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
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
          mime_type: asset.type || 'image/jpeg',
          createdAt: new Date().toISOString(),
        }));

        setSelectedImages((prev) =>
          allowMultiple ? [...prev, ...newImages].slice(0, maxImages) : [newImages[0]]
        );
        setIsModalVisible(true);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image from gallery');
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
          mime_type: asset.type || 'image/jpeg',
          createdAt: new Date().toISOString(),
        };
        setSelectedImages([newImage]);
        setIsModalVisible(true);
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadImage = async (image: Media) => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
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
        Alert.alert('Error', 'Image URI is undefined');
      }

      setUploadProgress(100);
      setIsUploading(false);

      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Failed to upload image');
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
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => handleImageSelect(item)}
    >
      <Image source={{ uri: item.url }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(item.$id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={styles.buttonRow}>
        {showGalleryButton && (
          <TouchableOpacity style={styles.actionButton} onPress={pickImageFromGallery}>
            <Text style={styles.buttonText}>📷 Gallery</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Camera</Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <FlatList
          data={selectedImages}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          style={styles.imageList}
        />
      )}

      <View style={styles.buttonContainer}>
        {showUploadButton && (
          <Button
            onPress={async () => {
              for (const image of selectedImages) {
                await uploadImage(image);
              }
            }}
            disabled={isUploading || hookUploading || selectedImages.length === 0}
            style={styles.uploadButton}
          >
            {isUploading || hookUploading ? <ButtonSpinner color="gray" /> : <ButtonText>Upload to Database</ButtonText>}
<ButtonText>{isUploading || hookUploading ? 'Uploading...' : 'Upload to Database'}</ButtonText>
          </Button>
        )}

        {(isUploading || hookUploading) && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.progressText}>
              Uploading... {Math.round(hookUploading ? progress : uploadProgress)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ZixAlertActions
        closeButton
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          onClose?.();
        }}
        childrenContent={renderModalContent()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  imageList: { maxHeight: 300 },
  imageContainer: { position: 'relative', margin: 4 },
  image: { width: imageSize, height: imageSize, borderRadius: 8 },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { marginTop: 16, gap: 12 },
  uploadButton: { backgroundColor: '#34C759' },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  progressText: { fontSize: 14, color: '#666' },
});

export default Gallery;
