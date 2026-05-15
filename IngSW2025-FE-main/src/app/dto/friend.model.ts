import { User } from "./user.model";

export interface Friendship {
  id: string;
  sender: User;
  receiver: User;
  status: string;
  createdAt: string;
}

export interface Friend {
    friendshipId: string;
    userId: string;
    username: string;
    friendCode: string;
    status: string;
    createdAt: string;
}
