package it.unife.sample.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.unife.sample.backend.model.Checkin;
import it.unife.sample.backend.model.Stats;
import it.unife.sample.backend.repository.CheckinRepository;
import it.unife.sample.backend.repository.HabitRepository;

@Service
public class StatsService {

	@Autowired
	private CheckinRepository checkinRepository;
	@Autowired
	private HabitRepository habitRepository;

	public Stats getByUserId(UUID userId) {
		List<Checkin> checkins = checkinRepository.findByHabitUserId(userId);
		int numHabits = habitRepository.findByUserId(userId).size();
		return buildStats(checkins, numHabits);
	}

	public Stats getByHabitId(UUID habitId) {
		return buildStats(checkinRepository.findByHabitId(habitId), 1);
	}

	private Stats buildStats(List<Checkin> checkins, int numHabits) {
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
		stats.setCompletedPercentageLast7Days(calculateLast7DaysStatusPercentage(checkins, true, numHabits));
		stats.setSkippedPercentageLast7Days(calculateLast7DaysStatusPercentage(checkins, false, numHabits));
		stats.setTotalWeekCompleted(countLast7Days(checkins, "completed"));
		stats.setTotalWeekSkipped(countLast7Days(checkins, "skipped"));
		stats.setTotalWeekCheckins(numHabits * 7);
		stats.setCompletedLastSevenDays(getCompletedLast7Days(checkins, numHabits));
		return stats;
	}

	private int countLast7Days(List<Checkin> checkins, String statusFilter) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);

        int count = 0;

        for (Checkin checkin : checkins) {
            LocalDate date = checkin.getDate();
            if (date == null || date.isBefore(start) || date.isAfter(today)) continue;

            String status = checkin.getStatus() == null ? "" : checkin.getStatus().toLowerCase();

            if (statusFilter.equals("completed") &&
                (status.equals("completed") || status.equals("done") || status.equals("success"))) {
                count++;
            }

            if (statusFilter.equals("skipped") &&
                (status.equals("skipped") || status.equals("skip"))) {
                count++;
            }
        }

        return count;
    }

private List<Integer> getCompletedLast7Days(List<Checkin> checkins, int numHabits) {
    LocalDate today = LocalDate.now();
    List<Integer> result = new ArrayList<>();

    for (int i = 6; i >= 0; i--) {
        LocalDate day = today.minusDays(i);

        int count = 0;

        for (Checkin c : checkins) {
            if (c.getDate() != null && c.getDate().equals(day)) {
                String status = c.getStatus() == null ? "" : c.getStatus().toLowerCase();

                if (status.equals("completed")) {
                    count++;
                }
            }
        }


        if (numHabits <= 0) {
            result.add(0);
        } else {
            int percentage = (int) Math.round((count * 100.0) / numHabits);
            result.add(percentage);
        }
    }

    return result;
}

	private double calculateLast7DaysStatusPercentage(List<Checkin> checkins, boolean completed, int numHabits) {
		if (numHabits <= 0) {
        	return 0.0;
    	}
		LocalDate today = LocalDate.now();
		LocalDate start = today.minusDays(6);


		int matchingStatus = 0;

		for (Checkin checkin : checkins) {
			LocalDate date = checkin.getDate();
			if (date == null || date.isBefore(start) || date.isAfter(today)) {
				continue;
			}


			String status = checkin.getStatus() == null ? "" : checkin.getStatus().trim().toLowerCase();

			if (completed && (status.equals("completed"))) {
				matchingStatus++;
			}

			if (!completed && (status.equals("skipped"))) {
				matchingStatus++;
			}
		}


		return (matchingStatus * 100.0) / (numHabits * 7);
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
