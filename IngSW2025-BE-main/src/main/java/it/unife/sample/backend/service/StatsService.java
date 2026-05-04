package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Checkin;
import it.unife.sample.backend.model.Stats;
import it.unife.sample.backend.repository.CheckinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class StatsService {

	@Autowired
	private CheckinRepository checkinRepository;

	public Stats getByUserId(UUID userId) {
		return buildStats(checkinRepository.findByHabitUserId(userId));
	}

	public Stats getByHabitId(UUID habitId) {
		return buildStats(checkinRepository.findByHabitId(habitId));
	}

	private Stats buildStats(List<Checkin> checkins) {
		Set<LocalDate> uniqueDaysSet = new HashSet<>();
		for (Checkin checkin : checkins) {
			if (checkin.getDate() != null) {
				uniqueDaysSet.add(checkin.getDate());
			}
		}

		List<LocalDate> uniqueDays = new ArrayList<>(uniqueDaysSet);
		uniqueDays.sort(LocalDate::compareTo);

		Stats stats = new Stats();
		stats.setTotalCheckins(checkins.size());
		stats.setDaysWithCheckin(uniqueDays.size());
		stats.setLongestStreak(calculateLongestStreak(uniqueDays));
		stats.setCurrentStreak(calculateCurrentStreak(uniqueDaysSet));
		stats.setCompletedPercentageLast7Days(calculateLast7DaysStatusPercentage(checkins, true));
		stats.setSkippedPercentageLast7Days(calculateLast7DaysStatusPercentage(checkins, false));
		return stats;
	}

	private double calculateLast7DaysStatusPercentage(List<Checkin> checkins, boolean completed) {
		LocalDate today = LocalDate.now();
		LocalDate start = today.minusDays(6);

		int totalInLast7Days = 0;
		int matchingStatus = 0;

		for (Checkin checkin : checkins) {
			LocalDate date = checkin.getDate();
			if (date == null || date.isBefore(start) || date.isAfter(today)) {
				continue;
			}

			totalInLast7Days++;
			String status = checkin.getStatus() == null ? "" : checkin.getStatus().trim().toLowerCase();

			if (completed && (status.equals("completed") || status.equals("done") || status.equals("success"))) {
				matchingStatus++;
			}

			if (!completed && (status.equals("skipped") || status.equals("skip"))) {
				matchingStatus++;
			}
		}

		if (totalInLast7Days == 0) {
			return 0.0;
		}

		return (matchingStatus * 100.0) / totalInLast7Days;
	}

	private int calculateLongestStreak(List<LocalDate> sortedDates) {
		if (sortedDates.isEmpty()) {
			return 0;
		}

		int longest = 1;
		int current = 1;

		for (int i = 1; i < sortedDates.size(); i++) {
			LocalDate previous = sortedDates.get(i - 1);
			LocalDate currentDate = sortedDates.get(i);

			if (currentDate.equals(previous.plusDays(1))) {
				current++;
			} else {
				longest = Math.max(longest, current);
				current = 1;
			}
		}

		return Math.max(longest, current);
	}

	private int calculateCurrentStreak(Set<LocalDate> datesSet) {
		int streak = 0;
		LocalDate cursor = LocalDate.now();

		while (datesSet.contains(cursor)) {
			streak++;
			cursor = cursor.minusDays(1);
		}

		return streak;
	}
}
