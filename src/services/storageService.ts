import { storage } from '@/src/services/apiService';
import { randomUUID } from 'expo-crypto';
import { ID } from 'react-native-appwrite';


export class StorageService {
  async uploadAvatar(image: string, db: string): Promise<any> {
    try {
      const response = await fetch(image);
        const blob = await response.blob();
      const file = await storage.createFile(db, ID.unique(), {
        name: `${randomUUID()}-avatar.jpg`,
        type: "image/jpeg",
        size: blob.size,
        uri: response.url,
      });
      return file;
    } catch (error) {
      throw new Error('فشل في رفع الصورة الشخصية.');
    }
  }
}

export const storageService = new StorageService();
