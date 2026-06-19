package it.unife.sample.backend.model;

import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Data
public class Stats {

    private int totalCheckins = 0;
    private int daysWithCheckin = 0;
    private int currentStreak = 0;
    private int longestStreak = 0;
    private int totalWeekCompleted = 0;
    private int totalWeekSkipped = 0;
    private int totalWeekCheckins = 0;
    private double completedPercentageLast7Days = 0.0;
    private double skippedPercentageLast7Days = 0.0;
    private List<Integer> completedLastSevenDays = new ArrayList<>();
}
