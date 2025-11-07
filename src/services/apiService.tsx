import {
  APP_CONFIG
} from "@/src/config";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage
} from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(APP_CONFIG.APPWRITE_API_URL!)
  .setProject(APP_CONFIG.APPWRITE_PROJECT_ID!);
// .setPlatform(APPWRITE_PLATFORM_NAME!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export const getDocument = async (collectionId: string, documentId: string) => {
  try {
    const document = await databases.getDocument(
      APP_CONFIG.DATABASE_ID!,
      collectionId,
      documentId
    );

    return document;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const listDocuments = async (
  collectionId: string,
  queries?: string[]
) => {
  try {
    const documents = await databases.listDocuments(
      APP_CONFIG.DATABASE_ID!,
      collectionId,
      queries || []
    );

    return documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: object
) => {
  try {
    const updatedDocument = await databases.updateDocument(
      APP_CONFIG.DATABASE_ID!,
      collectionId,
      documentId,
      data
    );

    return updatedDocument;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const createDocument = async (
  collectionId: string,
  documentId: string,
  data: object
) => {
  try {
    const newDocument = await databases.createDocument(
      APP_CONFIG.DATABASE_ID!,
      collectionId,
      documentId,
      data
    );

    return newDocument;
  } catch (error) {
    throw new Error(error as string);
  }
};

// STORAGE
export async function createFile(
  bucketId: string,
  fileId: string,
  file: any
): Promise<any> {
  return storage.createFile(bucketId, fileId, file);
}

export async function getFileView(
  bucketId: string,
  fileId: string
): Promise<URL> {
  return storage.getFileView(bucketId, fileId);
}

export async function getFilePreview(
  bucketId: string,
  fileId: string
): Promise<URL> {
  return storage.getFilePreview(
    bucketId,
    fileId,
    350,
    350,
    ImageGravity.Center,
    75
  );
}

export async function getFileDownload(
  bucketId: string,
  fileId: string
): Promise<URL> {
  return storage.getFileDownload(bucketId, fileId);
}
