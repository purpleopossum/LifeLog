export interface PartnerStats {
  name: string;

  totalHabits: number;

  totalWeekCompleted: number;
  totalWeekSkipped: number;
  totalWeekCheckins: number;

  longestStreak: number;
  currentStreak: number;

  completedLastSevenDays: number[];
  completedPercentageLast7Days: number;
  skippedPercentageLast7Days: number;
}

export interface Stats {
  totalCheckins: number;
  daysWithCheckin: number;
  longestStreak: number;
  currentStreak: number;

  totalWeekCompleted: number;
  totalWeekSkipped: number;
  totalWeekCheckins: number;

  completedLastSevenDays: number[];
  completedPercentageLast7Days: number;
  skippedPercentageLast7Days: number;

  partner: PartnerStats | undefined;
}
