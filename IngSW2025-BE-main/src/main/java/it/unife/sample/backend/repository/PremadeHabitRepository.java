package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.PremadeHabit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PremadeHabitRepository extends JpaRepository<PremadeHabit, UUID> {

}