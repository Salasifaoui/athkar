import { Game } from "./game";
import { User } from "./user";

export interface Invitation {
  id: string;
  gameId: Game;
  sender: User;
  receiver: User;
  status: 'pending' | 'accepted' | 'rejected';
  balance_for_battle: number;
  message?: string;
}