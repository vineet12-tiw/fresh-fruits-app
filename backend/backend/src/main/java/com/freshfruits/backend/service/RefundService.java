package com.freshfruits.backend.service;

import com.freshfruits.backend.Entity.Order;
import com.freshfruits.backend.Entity.RefundTicket;
import com.freshfruits.backend.repository.OrderRepository;
import com.freshfruits.backend.repository.RefundTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class RefundService {

    @Autowired
    private RefundTicketRepository refundRepository;
    @Autowired
    private OrderRepository orderRepository;

    // AI Tool calls this
    public String validateAndCreateTicket(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"DELIVERED".equals(order.getStatus())) {
            return "REJECTED: Order not delivered yet.";
        }

        // 4-Hour Guardrail
        // Note: For testing, ensure your Order has a valid deliveryTimestamp
        // If deliveryTimestamp is null, assume delivered just now for testing
        LocalDateTime deliveryTime = order.getOrderTimestamp(); // Using OrderTime as proxy for now

        long hoursDiff = ChronoUnit.HOURS.between(deliveryTime, LocalDateTime.now());
        if (hoursDiff > 4) {
            return "REJECTED: Policy requires reporting within 4 hours.";
        }

        RefundTicket ticket = new RefundTicket();
        ticket.setOrderId(orderId);
        ticket.setReason(reason);
        ticket.setStatus("PENDING_REVIEW");
        refundRepository.save(ticket);

        return "SUCCESS: Ticket #" + ticket.getId() + " created. Waiting for Admin Approval.";
    }

    // Admin calls this
    public void approveRefund(Long ticketId) {
        RefundTicket ticket = refundRepository.findById(ticketId).orElseThrow();
        ticket.setStatus("APPROVED");
        refundRepository.save(ticket);
        // TODO: Call Razorpay Refund API here
    }
}