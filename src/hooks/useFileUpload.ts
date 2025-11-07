import { APP_CONFIG } from '@/src/config';
import { Media } from '@/src/models/Media';
import { MediaService } from '@/src/services/mediaService';
import { storageService } from '@/src/services/storageService';
import { useCallback, useState } from 'react';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadAvatar = useCallback(async (imageUri: string): Promise<Media> => {
    setIsUploading(true);
    setProgress(0);
    try {
      // Upload file to Appwrite storage
      const file = await storageService.uploadAvatar(
        imageUri,
        APP_CONFIG.STORAGE_BUCKET_ID
      );

      // Get a preview URL for the uploaded file
      const previewUrl = await MediaService.getFilePreview(
        APP_CONFIG.STORAGE_BUCKET_ID,
        file.$id
      );

      setProgress(100);

      return {
        $id: file.$id,
        url: String(previewUrl),
        uri: imageUri,
        file_name: file.name,
        mime_type: 'image/jpeg',
        createdAt: new Date().toISOString(),
        uploadProgress: 100,
      };
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, []);

  return {
    isUploading,
    progress,
    uploadAvatar,
  };
}

export default useFileUpload;


