package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.EncouragementMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<EncouragementMessage, UUID> {
    List<EncouragementMessage> findByReceiverIdOrderBySentAtDesc(UUID receiverId);
}