package it.unife.sample.backend.dto;

import lombok.Data;

@Data
public class CheckinUpdateDTO {
    private String status;
    private String note;
    private int mood;
}
