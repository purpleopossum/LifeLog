package it.unife.sample.backend.service;

import it.unife.sample.backend.model.EncouragementMessageType;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final String FRIEND_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int FRIEND_CODE_LENGTH = 6;
    private static final int MAX_CODE_ATTEMPTS = 20;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private UserRepository repository;

    public List<User> findAll() {
        return repository.findAll();
    }

    public Optional<User> findById(UUID id) {
        return repository.findById(id);
    }

    public User findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public User findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public User findByFriendCode(String friendCode) {
        if (friendCode == null) {
            return null;
        }
        return repository.findByFriendCode(friendCode.trim().toUpperCase());
    }

    public User save(User entity) {
        ensureFriendCode(entity);
        return repository.save(entity);
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public User register(User user) {
        if (repository.findByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("Username già registrato, esegui il Login!");
        } else if (repository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email già registrata, esegui il Login!");
        }
        ensureFriendCode(user);
        return repository.save(user);
    }

    private void ensureFriendCode(User user) {
        if (user.getFriendCode() != null && !user.getFriendCode().isBlank()) {
            String normalizedCode = user.getFriendCode().trim().toUpperCase();
            User owner = repository.findByFriendCode(normalizedCode);
            if (owner != null && (user.getId() == null || !owner.getId().equals(user.getId()))) {
                throw new IllegalArgumentException("Friend code già in uso");
            }
            user.setFriendCode(normalizedCode);
            return;
        }

        if (user.getId() != null) {
            Optional<User> existing = repository.findById(user.getId());
            if (existing.isPresent() && existing.get().getFriendCode() != null && !existing.get().getFriendCode().isBlank()) {
                user.setFriendCode(existing.get().getFriendCode());
                return;
            }
        }

        user.setFriendCode(generateUniqueFriendCode());
    }

    private String generateUniqueFriendCode() {
        for (int attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
            String candidate = randomCode();
            if (!repository.existsByFriendCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Impossibile generare un friend code univoco");
    }

    private String randomCode() {
        StringBuilder code = new StringBuilder(FRIEND_CODE_LENGTH);
        for (int i = 0; i < FRIEND_CODE_LENGTH; i++) {
            int idx = RANDOM.nextInt(FRIEND_CODE_CHARS.length());
            code.append(FRIEND_CODE_CHARS.charAt(idx));
        }
        return code.toString();
    }

    public User updateMessage(UUID id, EncouragementMessageType message) {
        User user = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User non trovato"));

        user.setMessage(message);
        return repository.save(user);
    }
    
    public User clearMessage(UUID id) {
        User user = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setMessage(null);
        return repository.save(user);
}
}