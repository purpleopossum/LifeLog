package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Habit;
import it.unife.sample.backend.service.HabitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public ResponseEntity<Habit> create(@RequestBody Habit entity, @RequestParam String userId) {
        entity.setUserId(UUID.fromString(userId));       
        if (entity.getDescription() == null) entity.setDescription("");
        if (entity.getPartOfDay() == null) entity.setPartOfDay("");
        entity.setDeleted(false);

        return ResponseEntity.ok(service.save(entity));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Habit> update(@PathVariable UUID id, @RequestBody Habit entity) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
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
}