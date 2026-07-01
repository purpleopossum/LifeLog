package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Entry;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.service.EntryService;
import it.unife.sample.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/entries")
public class EntryController {

    @Autowired
    private EntryService service;
    
    @Autowired
    private UserService userService;

    @GetMapping
    public List<Entry> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entry> getById(@PathVariable UUID id) {
        Optional<Entry> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
        public List<Entry> getByUserId(@PathVariable UUID userId) {
        return service.findByUserId(userId);
    }
    
    @GetMapping("/date/{entryDate}")
    public List<Entry> getByEntryDate(@PathVariable LocalDate entryDate) {
        return service.findByEntryDate(entryDate);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Entry entity, @RequestParam String userId) {
        try {
            UUID userUUID = UUID.fromString(userId);
            Optional<User> userOpt = userService.findById(userUUID);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            entity.setUser(userOpt.get());
            entity.setDeleted(false);
            entity.setEntryDate(LocalDate.now());
            return ResponseEntity.ok(service.save(entity));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid userId format");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entry> update(@PathVariable UUID id, @RequestBody Entry entity) {
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
