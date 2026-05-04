package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EntryRepository extends JpaRepository<Entry, UUID> {
    List<Entry> findByUserId(UUID userId);
    
    List<Entry> findByEntryDate(String entryDate);

}