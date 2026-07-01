package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Challenge;
import it.unife.sample.backend.model.Milestone;
import it.unife.sample.backend.service.ChallengeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<List<Challenge>> getChallenges(@RequestParam UUID userId) {
        List<Challenge> challenges = challengeService.getUserChallenges(userId);
        return ResponseEntity.ok(challenges);
    }

    @PatchMapping("/milestones/{milestoneId}")
    public ResponseEntity<Milestone> toggleMilestone(
            @PathVariable Long milestoneId,
            @RequestParam UUID userId) {
        
        try {
            Milestone updatedMilestone = challengeService.toggleMilestoneCheck(milestoneId, userId);
            return ResponseEntity.ok(updatedMilestone);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Challenge> createChallenge(
            @RequestParam UUID userId,
            @RequestBody Challenge challenge) {
        
        try {
            Challenge savedChallenge = challengeService.createChallenge(challenge, userId);
            return ResponseEntity.status(201).body(savedChallenge);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{challengeId}")
    public ResponseEntity<Void> deleteChallenge(
            @PathVariable Long challengeId,
            @RequestParam UUID userId) {
        
        try {
            challengeService.deleteChallenge(challengeId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{challengeId}")
    public ResponseEntity<Challenge> updateChallenge(
            @PathVariable Long challengeId,
            @RequestParam UUID userId,
            @RequestBody Challenge updatedChallenge) {
        
        try {
            Challenge savedChallenge = challengeService.updateChallenge(updatedChallenge, userId);
            return ResponseEntity.ok(savedChallenge);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}