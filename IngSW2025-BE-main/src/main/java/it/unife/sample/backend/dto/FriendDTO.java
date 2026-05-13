package it.unife.sample.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FriendDTO {
    private String friendshipId;
    private String userId;
    private String username;
    private String friendCode;
    private String status;
    private LocalDateTime createdAt;
}