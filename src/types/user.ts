export interface User {
  userId: string;        // Appwrite account.$id
  username: string;       // Display name
  email: string;          // Email for quick search
  imageUrl?: string;    // Profile image URL from storage
  status?: string;        // User status (online, busy, etc.)
  address?: string;          // Short bio
  is_online?: boolean;   // Creation timestamp
  gender?: string;    // Gender
  interest?: string[];    // Interest
  location?: string;    // Location
}

export interface AuthUser extends User {
  isEmailVerified: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  address?: string;
  status?: string;
  imageUrl?: string;
  is_online?: boolean;
  gender?: string;
  interest?: string[];
  location?: string;
}