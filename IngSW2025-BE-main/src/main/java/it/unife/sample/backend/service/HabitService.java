package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Habit;
import it.unife.sample.backend.repository.HabitRepository;
import it.unife.sample.backend.model.PremadeHabit;
import it.unife.sample.backend.repository.PremadeHabitRepository;
import jakarta.transaction.Transactional;
import it.unife.sample.backend.repository.CheckinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class HabitService {

    @Autowired
    private HabitRepository repository;
    @Autowired
    private CheckinRepository checkinRepository;
    @Autowired
    private PremadeHabitRepository premadeHabitRepository;

    public List<Habit> findAll() {
        return repository.findAll();
    }

    public Optional<Habit> findById(UUID id) {
        return repository.findById(id);
    }

    public List<Habit> findByUserId(UUID userId) {
        return repository.findByUserId(userId);
    }


    public Habit save(Habit habit) {
        return repository.save(habit);
    }

    @Transactional
    public void deleteById(UUID id) {
        checkinRepository.deleteByHabitId(id);
        repository.deleteById(id);
    }

    public List<PremadeHabit> findPremadeHabits() {
        return premadeHabitRepository.findAll();
    }

    public PremadeHabit createPremadeHabit(PremadeHabit premadeHabit) {
        return premadeHabitRepository.save(premadeHabit);
    }

    public void deletePremadeHabit(UUID id) {
        premadeHabitRepository.deleteById(id);
    }

    public Optional<PremadeHabit> updatePremadeHabit(UUID id, PremadeHabit updatedPremadeHabit) {
        return premadeHabitRepository.findById(id).map(existingPremadeHabit -> {
            existingPremadeHabit.setTitle(updatedPremadeHabit.getTitle());
            existingPremadeHabit.setDescription(updatedPremadeHabit.getDescription());
            existingPremadeHabit.setPartOfDay(updatedPremadeHabit.getPartOfDay());
            return premadeHabitRepository.save(existingPremadeHabit);
        });
    }   
}