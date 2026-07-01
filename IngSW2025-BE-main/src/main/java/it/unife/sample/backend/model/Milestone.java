package it.unife.sample.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "milestones")
public class Milestone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String description;

    private int sequenceOrder;

    @JsonProperty("isCompleted")
    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "challenge_id")
    @JsonBackReference
    private Challenge challenge;
}
