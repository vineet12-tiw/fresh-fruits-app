package com.freshfruits.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fruit_id")
    private Fruit fruit;

    private Double quantityKg;

    @JsonIgnore // Prevent infinite loop when converting to JSON
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
