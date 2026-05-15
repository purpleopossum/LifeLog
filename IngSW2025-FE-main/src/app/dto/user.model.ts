import { Habit } from "./habit.model";
import { Entry } from "./journal.model";

export class User {
  id: string|undefined;
  username!: string;
  email!: string;
  password!: string;

  friendCode!: string;

  habits: Habit[] = [];

  entries: Entry[] = [];
}
