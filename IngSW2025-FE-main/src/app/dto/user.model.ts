import { Habit } from "./habit.model";
import { Entry } from "./journal.model";

export class User {
  id: string|undefined;
  username!: string;
  email!: string;
  password?: string;

  friendCode!: string;

  message?: EncouragementMessageType;

  habits: Habit[] = [];

  entries: Entry[] = [];
}

export enum EncouragementMessageType {
  KEEP_GOING = "KEEP_GOING",
  YOU_ARE_DOING_GREAT = "YOU_ARE_DOING_GREAT",
  DONT_BREAK_THE_STREAK = "DONT_BREAK_THE_STREAK",
  PROUD_OF_YOU = "PROUD_OF_YOU",
  ONE_MORE_DAY = "ONE_MORE_DAY",
}

export const EncouragementMessageText: Record<EncouragementMessageType, string> = {
  KEEP_GOING: "Keep going 🔥",
  YOU_ARE_DOING_GREAT: "You're doing great 💪",
  DONT_BREAK_THE_STREAK: "Don't break the streak ⚡",
  PROUD_OF_YOU: "Proud of you 🏆",
  ONE_MORE_DAY: "One more day ⏳",
};
