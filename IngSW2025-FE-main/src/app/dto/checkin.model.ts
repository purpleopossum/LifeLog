import { Habit } from './habit.model';

export class Checkin {
  id?: string;
  habit!: Habit;
  date!: string;
  status!: string;
  note?: string;
  mood?: number;
}
