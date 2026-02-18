package com.freshfruits.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "fruits")
public class Fruit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Alphonso Mango"
    private Double pricePerKg;
    private Double stockQuantity; // Manage inventory here
    private String imageUrl;
}
