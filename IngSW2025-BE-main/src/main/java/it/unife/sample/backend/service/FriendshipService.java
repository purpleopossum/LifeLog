package it.unife.sample.backend.service;

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
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        if (friendCode == null || friendCode.isBlank()) {
            throw new IllegalArgumentException("friendCode is required");
        }

        User receiver = userRepository.findByFriendCode(friendCode.trim().toUpperCase());
        if (receiver == null) {
            throw new IllegalArgumentException("No user found with the provided friendCode");
        }

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot add yourself as a partner");
        }

        // Check that receiver doesn't already have an ACCEPTED partner
        if (friendshipRepository.findAcceptedFriendshipByUserId(receiver.getId(), ACCEPTED).isPresent()) {
            throw new IllegalArgumentException("User already has a friend");
        }

        // Check that sender doesn't already have an ACCEPTED partner
        if (friendshipRepository.findAcceptedFriendshipByUserId(sender.getId(), ACCEPTED).isPresent()) {
            throw new IllegalArgumentException("You already have a friend");
        }

        Friendship existing = friendshipRepository.findBetweenUsers(sender.getId(), receiver.getId()).orElse(null);
        if (existing != null) {
            if (ACCEPTED.equals(existing.getStatus())) {
                throw new IllegalArgumentException("You are already partners");
            }
            if (PENDING.equals(existing.getStatus())) {
                throw new IllegalArgumentException("Request already exists and is pending");
            }
            if (REJECTED.equals(existing.getStatus())) {
                existing.setSender(sender);
                existing.setReceiver(receiver);
                existing.setStatus(PENDING);
                existing.setCreatedAt(LocalDateTime.now());
                return friendshipRepository.save(existing);
            }
        }

        // Check that receiver doesn't already have 3 PENDING requests
        long pendingCount = friendshipRepository.countByReceiverIdAndStatus(receiver.getId(), PENDING);
        if (pendingCount >= 3) {
            throw new IllegalArgumentException("User's inbox is full");
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
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!PENDING.equals(friendship.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be accepted");
        }

        // Check that sender doesn't already have an ACCEPTED partner
        if (friendshipRepository.findAcceptedFriendshipByUserId(friendship.getSender().getId(), ACCEPTED).isPresent()) {
            throw new IllegalArgumentException("Sender already has an active partner");
        }

        // Check that receiver doesn't already have an ACCEPTED partner
        if (friendshipRepository.findAcceptedFriendshipByUserId(friendship.getReceiver().getId(), ACCEPTED).isPresent()) {
            throw new IllegalArgumentException("Receiver already has an active partner");
        }

        // Accept the request
        friendship.setStatus(ACCEPTED);
        friendshipRepository.save(friendship);

        // Auto-reject all other PENDING requests received by the receiver
        List<Friendship> otherPendingRequests = friendshipRepository.findOtherPendingRequestsByReceiverId(
                friendship.getReceiver().getId(), PENDING, friendship.getId()
        );
        for (Friendship otherRequest : otherPendingRequests) {
            otherRequest.setStatus(REJECTED);
            friendshipRepository.save(otherRequest);
        }

        return friendship;
    }

    public Friendship reject(UUID friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!PENDING.equals(friendship.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be rejected");
        }

        friendship.setStatus(REJECTED);
        return friendshipRepository.save(friendship);
    }

    public Friendship getFriend(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return friendshipRepository.findAcceptedFriendshipByUserId(userId, ACCEPTED)
                .orElse(null);
    }

    public List<Friendship> getPendingRequests(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return friendshipRepository.findByReceiverIdAndStatus(userId, PENDING)
                .stream()
                .toList();
    }

    public boolean areAcceptedFriends(UUID userA, UUID userB) {
        return friendshipRepository.findBetweenUsers(userA, userB)
                .map(f -> ACCEPTED.equals(f.getStatus()))
                .orElse(false);
    }

}