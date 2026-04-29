package it.unife.sample.backend.service;

import it.unife.sample.backend.model.User;
import it.unife.sample.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

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

    public User save(User entity) {
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
        return repository.save(user);
    }
}