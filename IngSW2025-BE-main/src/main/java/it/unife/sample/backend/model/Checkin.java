package it.unife.sample.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
public class Checkin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "habit_id")
    private Habit habit;

    @ManyToMany(mappedBy = "checkins")
    @JsonIgnore
    private Set<Entry> entries = new HashSet<>();

    private LocalDate date;
    private String status;
    private String note;
    

    private int mood;
}
