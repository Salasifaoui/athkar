# Gallery Component

A comprehensive React Native gallery component that integrates with Appwrite for image selection, upload, and database storage.

## Features

- 📷 **Gallery Selection**: Pick images from device gallery
- 📸 **Camera Capture**: Take photos directly with camera
- ☁️ **Cloud Upload**: Upload images to Appwrite storage
- 🗄️ **Database Integration**: Store image metadata in Appwrite database
- 🔄 **Progress Tracking**: Real-time upload progress
- 📱 **Responsive Design**: Optimized for mobile devices
- 🎨 **Customizable**: Flexible props for different use cases

## Installation

The component uses the following dependencies (already included in the project):
- `expo-image-picker` - For image selection and camera access
- `react-native-appwrite` - For Appwrite integration
- `@tanstack/react-query` - For data fetching and mutations

## Usage

### Basic Usage

```tsx
import { Gallery } from '@/components/ui/gallery';

export const MyComponent = () => {
  const handleImageSelect = (image: Media) => {
    console.log('Selected image:', image);
  };

  const handleImageUpload = (image: Media) => {
    console.log('Uploaded image:', image);
  };

  return (
    <Gallery
      onImageSelect={handleImageSelect}
      onImageUpload={handleImageUpload}
    />
  );
};
```

### Advanced Usage

```tsx
import { Gallery } from '@/components/ui/gallery';

export const AdvancedGallery = () => {
  return (
    <Gallery
      onImageSelect={(image) => console.log('Selected:', image)}
      onImageUpload={(image) => console.log('Uploaded:', image)}
      maxImages={5}
      allowMultiple={true}
      showUploadButton={true}
      showGalleryButton={true}
      bucketId="my-custom-bucket"
      collectionId="user_photos"
      databaseId="my-database"
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onImageSelect` | `(image: Media) => void` | - | Callback when an image is selected |
| `onImageUpload` | `(image: Media) => void` | - | Callback when an image is uploaded |
| `maxImages` | `number` | `10` | Maximum number of images to select |
| `allowMultiple` | `boolean` | `false` | Allow multiple image selection |
| `showUploadButton` | `boolean` | `true` | Show upload to database button |
| `showGalleryButton` | `boolean` | `true` | Show gallery selection button |
| `bucketId` | `string` | `APPWRITE_CONFIG.BUCKETS.AVATARS` | Appwrite storage bucket ID |
| `collectionId` | `string` | `'user_images'` | Database collection ID |
| `databaseId` | `string` | `APPWRITE_CONFIG.DATABASE_ID` | Database ID |

## Media Interface

```tsx
interface Media {
  $id: string;
  id?: string;
  uuid?: string;
  url: string;
  original_url?: string;
  file_name?: string;
  file_type?: string;
  mime_type?: string;
  uri?: string;
  createdAt: string;
  updatedAt?: string;
  uploadProgress?: number;
}
```

## Appwrite Integration

The component automatically:
1. **Uploads files** to the specified Appwrite storage bucket
2. **Creates database documents** with image metadata
3. **Associates images** with the current user account
4. **Handles permissions** and authentication

### Required Appwrite Setup

1. **Storage Bucket**: Create a bucket in Appwrite console
2. **Database Collection**: Create a collection for storing image metadata
3. **Permissions**: Ensure proper read/write permissions

### Database Document Structure

```json
{
  "userId": "user_id",
  "fileId": "file_id_from_storage",
  "fileName": "image.jpg",
  "mimeType": "image/jpeg",
  "uploadedAt": "2024-01-01T00:00:00.000Z",
  "url": "https://storage.appwrite.io/..."
}
```

## Permissions

The component automatically requests the following permissions:
- **iOS**: `NSPhotoLibraryUsageDescription` and `NSCameraUsageDescription`
- **Android**: `READ_EXTERNAL_STORAGE` and `CAMERA`

Make sure to add these permissions to your `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "This app needs access to photo library to select images.",
        "NSCameraUsageDescription": "This app needs access to camera to take photos."
      }
    },
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "CAMERA"
      ]
    }
  }
}
```

## Error Handling

The component includes comprehensive error handling for:
- Permission denials
- Upload failures
- Network errors
- Invalid file types

## Styling

The component uses React Native StyleSheet and is fully customizable. You can override styles by passing custom style props or modifying the component's internal styles.

## Example

See `gallery-example.tsx` for a complete working example of the component.

## Dependencies

- React Native
- Expo Image Picker
- React Native Appwrite
- TanStack React Query
- Zustand (for state management)
