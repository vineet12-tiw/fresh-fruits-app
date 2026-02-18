package com.freshfruits.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerPhone;

    // Logistics
    private String communityName;
    private String blockName;
    private String flatNo;

    // Status & Dates
    private LocalDate deliveryDate;
    private LocalDateTime orderTimestamp = LocalDateTime.now();
    private String status = "PENDING";

    // RELATIONS

    // 1. One Order has Many Items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    // 2. Assigned Driver (Optional)
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    private Double totalAmount;
}
