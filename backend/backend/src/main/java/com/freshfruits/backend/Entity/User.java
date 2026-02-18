package com.freshfruits.backend.Entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // Phone number or Email
    private String password; // BCrypt Encrypted

    // Roles: ROLE_ADMIN, ROLE_DRIVER, ROLE_CUSTOMER
    private String role;
}