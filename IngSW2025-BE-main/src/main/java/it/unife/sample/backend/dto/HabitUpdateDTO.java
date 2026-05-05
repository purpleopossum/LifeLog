package it.unife.sample.backend.dto;

import lombok.Data;

@Data
public class HabitUpdateDTO {
    private String title;
    private String description;
    private String partOfDay;
    private String userId;
}