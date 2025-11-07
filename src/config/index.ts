export const APP_CONFIG = {
    APPWRITE_API_URL: process.env.EXPO_PUBLIC_APPWRITE_API_URL || 'https://cloud.appwrite.io/v1',
    APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
    DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || 'athkar',
    STORAGE_BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_AVATARS_BUCKET || 'storage',
  } as const;