import { User } from "./user.model";

export interface Friendship {
  id: string;
  sender: User;
  receiver: User;
  status: string;
  createdAt: string;
}
