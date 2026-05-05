package it.unife.sample.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;    

    @OneToMany(mappedBy = "habit")
    @JsonIgnore
    private List<Checkin> checkins;

    private String title;    
    private String description;
    private String partOfDay;
    private boolean deleted;

}
