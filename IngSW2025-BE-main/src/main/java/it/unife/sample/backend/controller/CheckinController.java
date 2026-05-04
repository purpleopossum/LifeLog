package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Checkin;
import it.unife.sample.backend.model.Habit;
import it.unife.sample.backend.service.CheckinService;
import it.unife.sample.backend.service.HabitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/checkins")
public class CheckinController {

    @Autowired
    private CheckinService service;
    
    @Autowired
    private HabitService habitService;

    @GetMapping("/{id}")
    public ResponseEntity<Checkin> getById(@PathVariable UUID id) {
        Optional<Checkin> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Checkin> getAll() {
        return service.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Checkin> getByUserId(
            @PathVariable UUID userId,
            @RequestParam(required = false) String date
    ) {
        if (date != null && !date.isEmpty()) {
            LocalDate localDate = LocalDate.parse(date);
            return service.findByHabitUserIdAndDate(userId, localDate);
        } else {
            return service.findByUser(userId);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Checkin> updateCheckin(@PathVariable UUID id, @RequestBody Checkin updated) {
        Optional<Checkin> checkinOpt = service.findById(id);
        if (checkinOpt.isEmpty()) return ResponseEntity.notFound().build();

        Checkin checkin = checkinOpt.get();
        checkin.setStatus(updated.getStatus());
        checkin.setNote(updated.getNote());
        checkin.setMood(updated.getMood());

        return ResponseEntity.ok(service.save(checkin));
    }

    @GetMapping("/habit/{habitId}")
    public List<Checkin> getByHabit(@PathVariable UUID habitId) {
        return service.findByHabit(habitId);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public List<Checkin> getByUserAndDate(
            @PathVariable String userId,
            @PathVariable String date) {
        UUID userUUID = UUID.fromString(userId);
        LocalDate localDate = LocalDate.parse(date);
        return service.findByHabitUserIdAndDate(userUUID, localDate);
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Checkin checkin, @RequestParam String habitId) {
        try {
            UUID habitUUID = UUID.fromString(habitId);
            Optional<Habit> habitOpt = habitService.findById(habitUUID);
            if (habitOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Habit not found");
            }
            checkin.setHabit(habitOpt.get());
            return ResponseEntity.ok(service.save(checkin));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid habitId format");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
