package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Friendship;
import it.unife.sample.backend.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @PostMapping("/request")
        public ResponseEntity<?> sendRequest(@RequestParam UUID senderId, @RequestParam String friendCode) {
        try {
            Friendship friendship = friendshipService.sendRequest(senderId, friendCode);
            return ResponseEntity.ok(Map.of(
                    "id", friendship.getId().toString(),
                    "status", friendship.getStatus(),
                    "message", "Richiesta inviata"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable UUID id) {
        try {
            Friendship friendship = friendshipService.accept(id);
            return ResponseEntity.ok(Map.of(
                    "id", friendship.getId().toString(),
                    "status", friendship.getStatus(),
                    "message", "Richiesta accettata"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable UUID id) {
        try {
            Friendship friendship = friendshipService.reject(id);
            return ResponseEntity.ok(Map.of(
                    "id", friendship.getId().toString(),
                    "status", friendship.getStatus(),
                    "message", "Richiesta rifiutata"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFriend(@PathVariable UUID userId) {
        try {
            Friendship friend = friendshipService.getFriend(userId);
            if (friend == null) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(friend);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<?> getPending(@PathVariable UUID userId) {
        try {
            List<Friendship> pending = friendshipService.getPendingRequests(userId);
            return ResponseEntity.ok(pending);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}