package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.EncouragementMessageType;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    public List<User> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable UUID id) {
        Optional<User> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getByUsername(@PathVariable String username) {
        User entity = service.findByUsername(username);
        if (entity != null) {
            return ResponseEntity.ok(entity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getByEmail(@PathVariable String email) {
        User entity = service.findByEmail(email);
        if (entity != null) {
            return ResponseEntity.ok(entity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody User entity) {
        try {
            User created = service.register(entity);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }   

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable UUID id, @RequestBody User entity) {
        Optional<User> existingOpt = service.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existing = existingOpt.get();
        existing.setUsername(entity.getUsername());
        existing.setEmail(entity.getEmail());
        existing.setPassword(entity.getPassword());
        existing.setFriendCode(entity.getFriendCode());

        if (entity.getMessage() != null) {
            existing.setMessage(entity.getMessage());
        }

        return ResponseEntity.ok(service.save(existing));
    }

    @PutMapping("/{id}/message")
    public ResponseEntity<User> setMessage(@PathVariable UUID id, @RequestBody EncouragementMessageType message) {
        try {
            return ResponseEntity.ok(service.updateMessage(id, message));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/message")
    public ResponseEntity<User> clearMessage(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.clearMessage(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
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