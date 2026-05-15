package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    List<Friendship> findByReceiverIdAndStatus(UUID receiverId, String status);

    @Query("SELECT f FROM Friendship f WHERE (f.sender.id = :userId OR f.receiver.id = :userId) AND f.status = :status")
    Optional<Friendship> findAcceptedFriendshipByUserId(@Param("userId") UUID userId, @Param("status") String status);

    @Query("SELECT f FROM Friendship f WHERE ((f.sender.id = :userA AND f.receiver.id = :userB) OR (f.sender.id = :userB AND f.receiver.id = :userA))")
    Optional<Friendship> findBetweenUsers(@Param("userA") UUID userA, @Param("userB") UUID userB);

    @Query("SELECT COUNT(f) FROM Friendship f WHERE f.receiver.id = :receiverId AND f.status = :status")
    long countByReceiverIdAndStatus(@Param("receiverId") UUID receiverId, @Param("status") String status);

    @Query("SELECT f FROM Friendship f WHERE f.receiver.id = :receiverId AND f.status = :status AND f.id <> :friendshipId")
    List<Friendship> findOtherPendingRequestsByReceiverId(@Param("receiverId") UUID receiverId,
                                                         @Param("status") String status,
                                                         @Param("friendshipId") UUID friendshipId);
}