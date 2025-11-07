import { User } from "./user";
export interface Game {
    $id: string;
    name: string;
    numberUser: number;
  bgcolor?: string;
  nbre_online: number;
  status: 'new' | 'top' | 'danger' | 'ad';
  imageUrl?: string;
  ownerName?: string;
  about?: string;
  top: User[];
}