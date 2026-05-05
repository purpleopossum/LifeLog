export class Habit {
  id?: string;
  userId!: string;
  title!: string;
  description!: string;
  partOfDay!: string;
}

export interface HabitUpdateDTO {
  title: string;
  description: string;
  partOfDay: string;
  userId: string;
}
