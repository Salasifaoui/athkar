import { storage } from "@/src/services/apiService";
import { randomUUID } from "expo-crypto";
import { ID, ImageGravity } from "react-native-appwrite";
export class MediaService {
    static async saveImageToStorage(image: string, db: string) {
        const response = await fetch(image);
        const blob = await response.blob();
        try {
          const file = await storage.createFile(db, ID.unique(), {
            name: `${randomUUID()}-avatar.jpg`,
            type: "image/jpeg",
            size: blob.size,
            uri: response.url,
          });
          return file;
        } catch (error) {
          console.error(error);
        }
      
    }

   static async getFilePreview(
      bucketId: string,
      fileId: string
    ): Promise<any> {
      return storage.getFilePreviewURL(
        bucketId,
        fileId,
        350,
        350,
        ImageGravity.Center,
        75
      );
    }
}