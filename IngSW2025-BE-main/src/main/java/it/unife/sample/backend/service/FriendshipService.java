package it.unife.sample.backend.service;

import it.unife.sample.backend.dto.FriendDTO;
import it.unife.sample.backend.model.Friendship;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.repository.FriendshipRepository;
import it.unife.sample.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FriendshipService {

    private static final String PENDING = "PENDING";
    private static final String ACCEPTED = "ACCEPTED";
    private static final String REJECTED = "REJECTED";

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    public Friendship sendRequest(UUID senderId, String friendCode) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender non trovato"));

        if (friendCode == null || friendCode.isBlank()) {
            throw new IllegalArgumentException("friendCode obbligatorio");
        }

        User receiver = userRepository.findByFriendCode(friendCode.trim().toUpperCase());
        if (receiver == null) {
            throw new IllegalArgumentException("Nessun utente trovato con il friendCode indicato");
        }

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Non puoi aggiungere te stesso come partner");
        }

        Friendship existing = friendshipRepository.findBetweenUsers(sender.getId(), receiver.getId()).orElse(null);
        if (existing != null) {
            if (ACCEPTED.equals(existing.getStatus())) {
                throw new IllegalArgumentException("Siete gia partner");
            }
            if (PENDING.equals(existing.getStatus())) {
                throw new IllegalArgumentException("Richiesta gia presente e in attesa");
            }
            if (REJECTED.equals(existing.getStatus())) {
                existing.setSender(sender);
                existing.setReceiver(receiver);
                existing.setStatus(PENDING);
                existing.setCreatedAt(LocalDateTime.now());
                return friendshipRepository.save(existing);
            }
        }

        if (hasAcceptedPartner(sender.getId())) {
            throw new IllegalArgumentException("Il sender ha gia un partner attivo");
        }

        if (hasAcceptedPartner(receiver.getId())) {
            throw new IllegalArgumentException("Il receiver ha gia un partner attivo");
        }

        Friendship friendship = new Friendship();
        friendship.setSender(sender);
        friendship.setReceiver(receiver);
        friendship.setStatus(PENDING);
        friendship.setCreatedAt(LocalDateTime.now());

        return friendshipRepository.save(friendship);
    }

    public Friendship accept(UUID friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Richiesta non trovata"));

        if (!PENDING.equals(friendship.getStatus())) {
            throw new IllegalArgumentException("Solo le richieste PENDING possono essere accettate");
        }

        if (hasAcceptedPartnerExcept(friendship.getSender().getId(), friendship.getId())) {
            throw new IllegalArgumentException("Il sender ha gia un partner attivo");
        }

        if (hasAcceptedPartnerExcept(friendship.getReceiver().getId(), friendship.getId())) {
            throw new IllegalArgumentException("Il receiver ha gia un partner attivo");
        }

        friendship.setStatus(ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    public Friendship reject(UUID friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Richiesta non trovata"));

        if (!PENDING.equals(friendship.getStatus())) {
            throw new IllegalArgumentException("Solo le richieste PENDING possono essere rifiutate");
        }

        friendship.setStatus(REJECTED);
        return friendshipRepository.save(friendship);
    }

    public List<FriendDTO> getFriends(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Utente non trovato");
        }

        return friendshipRepository.findByUserIdAndStatus(userId, ACCEPTED)
                .stream()
                .map(f -> {
                    User friend = f.getSender().getId().equals(userId) ? f.getReceiver() : f.getSender();
                    return toFriendDTO(f, friend);
                })
                .toList();
    }

    public List<FriendDTO> getPendingRequests(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Utente non trovato");
        }

        return friendshipRepository.findByReceiverIdAndStatus(userId, PENDING)
                .stream()
                .map(f -> toFriendDTO(f, f.getSender()))
                .toList();
    }

    public boolean areAcceptedFriends(UUID userA, UUID userB) {
        return friendshipRepository.findBetweenUsers(userA, userB)
                .map(f -> ACCEPTED.equals(f.getStatus()))
                .orElse(false);
    }

    private boolean hasAcceptedPartner(UUID userId) {
        return !friendshipRepository.findByUserIdAndStatus(userId, ACCEPTED).isEmpty();
    }

    private boolean hasAcceptedPartnerExcept(UUID userId, UUID friendshipId) {
        return friendshipRepository.findByUserIdAndStatus(userId, ACCEPTED)
                .stream()
                .anyMatch(f -> !f.getId().equals(friendshipId));
    }

    private FriendDTO toFriendDTO(Friendship friendship, User user) {
        FriendDTO dto = new FriendDTO();
        dto.setFriendshipId(friendship.getId().toString());
        dto.setUserId(user.getId().toString());
        dto.setUsername(user.getUsername());
        dto.setFriendCode(user.getFriendCode());
        dto.setStatus(friendship.getStatus());
        dto.setCreatedAt(friendship.getCreatedAt());
        return dto;
    }
}