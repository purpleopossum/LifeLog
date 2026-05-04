package it.unife.sample.backend.model;

import lombok.Data;

@Data
public class Stats {

    private int totalCheckins;
    private int daysWithCheckin;
    private int currentStreak;
    private int longestStreak;
    private double completedPercentageLast7Days;
    private double skippedPercentageLast7Days;
}
