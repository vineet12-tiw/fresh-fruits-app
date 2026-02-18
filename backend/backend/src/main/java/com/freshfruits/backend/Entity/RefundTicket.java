package com.freshfruits.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "refund_tickets")
public class RefundTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId; // Link to the original order

    @Column(columnDefinition = "TEXT")
    private String reason; // e.g., "Mangoes were spoiled"

    private String status; // PENDING_REVIEW, APPROVED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();

    private String adminComment; // Optional: "Approved, refunding 50%"
}
