package it.unife.sample.backend.dto;

import lombok.Data;

@Data
public class CheckinCreateDTO {
    private String status;
    private String note;
    private Integer mood;
    private String date;
}
