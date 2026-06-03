import { User } from "./user.model";

export interface Friendship {
  id: string;
  sender: User;
  receiver: User;
  status: string;
  createdAt: string;
}

export interface FriendshipResponse {
  id: string;
  status: string;
  message: string;
}
