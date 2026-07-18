package it.unife.sample.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.unife.sample.backend.model.Habit;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.model.PremadeHabit;
import it.unife.sample.backend.service.HabitService;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitService service;


    @GetMapping
    public List<Habit> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habit> getById(@PathVariable UUID id) {
        Optional<Habit> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
        public List<Habit> getByUserId(@PathVariable UUID userId) {
        return service.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Habit habit, @RequestParam UUID userId) {
        try {
            Habit entity = new Habit();
            entity.setTitle(habit.getTitle());
            entity.setDescription(habit.getDescription());
            entity.setPartOfDay(habit.getPartOfDay());
            entity.setUser(new User());
            entity.getUser().setId(userId);
            if (entity.getDescription() == null) entity.setDescription("");
            if (entity.getPartOfDay() == null) entity.setPartOfDay("");
            entity.setDeleted(false);

            return ResponseEntity.ok(service.save(entity));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid userId format");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Habit> update(@PathVariable UUID id, @RequestBody Habit habit) {

        Optional<Habit> habitOpt = service.findById(id);
        if (habitOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Habit entity = habitOpt.get();

        entity.setTitle(habit.getTitle());
        entity.setDescription(habit.getDescription());
        entity.setPartOfDay(habit.getPartOfDay());

        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/premade")
    public List<PremadeHabit> getPremadeHabits() {
        return service.findPremadeHabits();
    }

    @PostMapping("/premade")
    public ResponseEntity<PremadeHabit> createPremadeHabit(@RequestBody PremadeHabit premadeHabit) {
        PremadeHabit createdPremadeHabit = service.createPremadeHabit(premadeHabit);
        return ResponseEntity.ok(createdPremadeHabit);
    }
}