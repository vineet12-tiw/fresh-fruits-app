package com.freshfruits.backend.repository;


import com.freshfruits.backend.Entity.RefundTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RefundTicketRepository extends JpaRepository<RefundTicket, Long> {

    // Admin View: Show only tickets waiting for approval
    List<RefundTicket> findByStatus(String status);

    // AI Agent Check: prevent duplicate refund requests for same order
    boolean existsByOrderId(Long orderId);
}
