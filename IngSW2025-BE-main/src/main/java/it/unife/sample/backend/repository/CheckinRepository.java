package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Checkin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface CheckinRepository extends JpaRepository<Checkin, UUID> {

    List<Checkin> findByHabitId(UUID habitId);

    List<Checkin> findByHabitUserId(UUID userId);

    List<Checkin> findByHabitUserIdAndDate(UUID userId, LocalDate date);

    List<Checkin> findByHabitIdAndDate(UUID habitId, LocalDate date);
}
