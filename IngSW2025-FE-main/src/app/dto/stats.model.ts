export interface PartnerStats {
  name: string;
  totalHabits: number;
  totalWeekCompleted: number;
  totalWeekSkipped: number;
  longestStreak: number;
  currentStreak: number;
  completedPercentage: number;
  completedLastSevenDays: number[];
}

export interface Stats {
  totalHabits: number;
  longestStreak: number;
  currentStreak: number;
  completed: number;
  skipped: number;
  totalWeekCompleted: number;
  totalWeekSkipped: number;
  completedPercentage: number;
  completedLastSevenDays: number[];

  partner: PartnerStats | undefined;
}
