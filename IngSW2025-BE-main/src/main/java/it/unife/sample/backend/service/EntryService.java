package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Entry;
import it.unife.sample.backend.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EntryService {

    @Autowired
    private EntryRepository repository;

    public List<Entry> findAll() {
        return repository.findAll();
    }

    public Optional<Entry> findById(UUID id) {
        return repository.findById(id);
    }

    public List<Entry> findByUserId(UUID userId) {
        return repository.findByUserId(userId);
    }
    
    public List<Entry> findByEntryDate(String entryDate) {
        return repository.findByEntryDate(entryDate);
    }


    public Entry save(Entry Entry) {
        return repository.save(Entry);
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}