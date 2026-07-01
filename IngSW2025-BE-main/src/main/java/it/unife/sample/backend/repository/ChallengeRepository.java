package it.unife.sample.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.unife.sample.backend.model.Challenge;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    
    @Query("SELECT DISTINCT c FROM Challenge c LEFT JOIN FETCH c.milestones WHERE c.user.id = :userId")
    List<Challenge> findAllByUserIdWithMilestones(@Param("userId") UUID userId);
}
