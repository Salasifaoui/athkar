export interface Hashtag {
  $id?: string;
  name: string;
  creatorId: string;
  count_posts: number;
  new_post: boolean;
  // Posts are now handled through PostHashtag junction table
  // Optional: populated posts for display (not stored directly)
  posts?: any[]; // Will be populated when needed
}