package it.unife.sample.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.unife.sample.backend.model.Milestone;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    @Query("SELECT m FROM Milestone m WHERE m.id = :milestoneId AND m.challenge.user.id = :userId")
    Optional<Milestone> findByIdAndUserId(@Param("milestoneId") Long milestoneId, @Param("userId") UUID userId);
}
