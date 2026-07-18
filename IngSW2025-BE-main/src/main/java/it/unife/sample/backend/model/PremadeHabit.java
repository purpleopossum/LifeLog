package it.unife.sample.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "premade_habits")
public class PremadeHabit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String title;    
    private String description;
    private String partOfDay;
    private String category;
}
