package it.unife.sample.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import it.unife.sample.backend.model.Checkin;

@Repository
public interface CheckinRepository extends JpaRepository<Checkin, UUID> {

    List<Checkin> findByHabitId(UUID habitId);

    @EntityGraph(attributePaths = {"habit", "habit.user"})
    List<Checkin> findByHabitUserId(UUID userId);

    @EntityGraph(attributePaths = {"habit", "habit.user"})
    List<Checkin> findByHabitUserIdAndDate(UUID userId, LocalDate date);

    @EntityGraph(attributePaths = {"habit"})
    List<Checkin> findByHabitIdAndDate(UUID habitId, LocalDate date);

    @Modifying
    @Query("DELETE FROM Checkin c WHERE c.habit.id = :habitId")
    void deleteByHabitId(UUID habitId);
}
