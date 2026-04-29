package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Checkin;
import it.unife.sample.backend.repository.CheckinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CheckinService {

    @Autowired
    private CheckinRepository repository;

    public List<Checkin> findAll() {
        return repository.findAll();
    }

    public Optional<Checkin> findById(UUID id) {
        return repository.findById(id);
    }

    public Checkin save(Checkin checkin) {
        return repository.save(checkin);
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public List<Checkin> findByHabit(UUID habitId) {
        return repository.findByHabitId(habitId);
    }

    public List<Checkin> findByUser(UUID userId) {
        return repository.findByHabitUserId(userId);
    }

    public List<Checkin> findByHabitUserIdAndDate(UUID userId, LocalDate date) {
        return repository.findByHabitUserIdAndDate(userId, date);
    }

    public List<Checkin> findByHabitAndDate(UUID habitId, LocalDate date) {
        return repository.findByHabitIdAndDate(habitId, date);
    }
}
