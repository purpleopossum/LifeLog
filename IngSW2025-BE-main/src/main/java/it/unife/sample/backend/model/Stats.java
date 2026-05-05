package it.unife.sample.backend.model;

import lombok.Data;
import java.util.List;

@Data
public class Stats {

    private int totalCheckins;
    private int daysWithCheckin;
    private int currentStreak;
    private int longestStreak;
    private int totalWeekCompleted;
    private int totalWeekSkipped;
    private int totalWeekCheckins;
    private double completedPercentageLast7Days;
    private double skippedPercentageLast7Days;
    private List<Integer> completedLastSevenDays;
}
