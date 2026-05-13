package it.unife.sample.backend.service;

import it.unife.sample.backend.dto.MessageDTO;
import it.unife.sample.backend.model.EncouragementMessage;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.repository.MessageRepository;
import it.unife.sample.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipService friendshipService;

    public MessageDTO send(MessageDTO dto) {
        if (dto.getSenderId() == null || dto.getReceiverId() == null) {
            throw new IllegalArgumentException("senderId e receiverId sono obbligatori");
        }
        if (dto.getMessage() == null || dto.getMessage().isBlank()) {
            throw new IllegalArgumentException("message obbligatorio");
        }

        UUID senderId = UUID.fromString(dto.getSenderId());
        UUID receiverId = UUID.fromString(dto.getReceiverId());

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender non trovato"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver non trovato"));

        if (!friendshipService.areAcceptedFriends(senderId, receiverId)) {
            throw new IllegalArgumentException("Puoi inviare messaggi solo a partner accettati");
        }

        EncouragementMessage message = new EncouragementMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessage(dto.getMessage().trim());
        message.setSentAt(LocalDateTime.now());

        EncouragementMessage saved = messageRepository.save(message);
        return toDTO(saved);
    }

    public List<MessageDTO> getInbox(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Utente non trovato");
        }

        return messageRepository.findByReceiverIdOrderBySentAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private MessageDTO toDTO(EncouragementMessage message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId().toString());
        dto.setSenderId(message.getSender().getId().toString());
        dto.setSenderUsername(message.getSender().getUsername());
        dto.setReceiverId(message.getReceiver().getId().toString());
        dto.setReceiverUsername(message.getReceiver().getUsername());
        dto.setMessage(message.getMessage());
        dto.setSentAt(message.getSentAt());
        return dto;
    }
}