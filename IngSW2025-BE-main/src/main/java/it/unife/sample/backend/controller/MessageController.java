package it.unife.sample.backend.controller;

import it.unife.sample.backend.dto.MessageDTO;
import it.unife.sample.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private static final List<String> PRESET_MESSAGES = List.of(
            "Keep going 🔥",
            "You're doing great",
            "Don't break the streak",
            "Proud of you",
            "One more day"
    );

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody MessageDTO dto) {
        try {
            MessageDTO sent = messageService.send(dto);
            return ResponseEntity.ok(sent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/inbox/{userId}")
    public ResponseEntity<?> inbox(@PathVariable UUID userId) {
        try {
            return ResponseEntity.ok(messageService.getInbox(userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/presets")
    public List<String> presets() {
        return PRESET_MESSAGES;
    }
}