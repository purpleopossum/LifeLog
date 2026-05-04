package it.unife.sample.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String username;
    private String email;
    private String password;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Habit> habits;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Entry> entries;
}
