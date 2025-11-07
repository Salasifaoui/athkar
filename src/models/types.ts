
export type UserProfile = {
    $id: string;
    userId: string;
    email: string;
    username?: string;
    fullName?: string;
    bio?: string;
    imageUrl?: string;
    followers?: number;
    following?: number;
    posts?: number;
    birthDate?: string;
    gender?: string;
    country?: string;
    followingCount?: number;
    counter_points?: number;
    counter_cats?: number;
    counter_loves?: number;
  };

  // Re-export Post and Comment types for convenience
  export type { Post, CreatePostData, UpdatePostData } from '../models/Post';
  export type { Comment, CreateCommentData, UpdateCommentData } from '../models/Comment';

  export interface NotificationProps {
    id: string;
    type: string;
    title: string;
    content: string;
    icon?: string;
    symbol?: string;
    url: string;
    createdAt: Date;
  }
  export interface ActivityProps {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
  }