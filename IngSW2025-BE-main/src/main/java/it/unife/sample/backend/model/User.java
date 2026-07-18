package it.unife.sample.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    @Column(unique = true, length = 6)
    private String friendCode;

    @Enumerated(EnumType.STRING)
    private EncouragementMessageType message;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Habit> habits;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Entry> entries;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean admin = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean premium = false;
}
