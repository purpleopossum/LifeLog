package it.unife.sample.backend.dto;

import lombok.Data;

@Data
public class FriendshipRequestDTO {
    private String senderId;
    private String friendCode;
}