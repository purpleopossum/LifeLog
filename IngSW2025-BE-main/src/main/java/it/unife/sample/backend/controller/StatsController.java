package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Stats;
import it.unife.sample.backend.service.HabitService;
import it.unife.sample.backend.service.StatsService;
import it.unife.sample.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService service;

    @Autowired
    private UserService userService;

    @Autowired
    private HabitService habitService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable UUID userId) {
        if (userService.findById(userId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Stats stats = service.getByUserId(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/habit/{habitId}")
    public ResponseEntity<?> getByHabitId(@PathVariable UUID habitId) {
        if (habitService.findById(habitId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Stats stats = service.getByHabitId(habitId);
        return ResponseEntity.ok(stats);
    }
}
