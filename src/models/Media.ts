export interface Media {
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