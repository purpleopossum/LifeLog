package it.unife.sample.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private Habit habit;

    private LocalDate date;

    private String status;

    private String note;

    private int mood; // da 1 a 5
}
