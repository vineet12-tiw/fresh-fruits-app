package com.freshfruits.backend.controller;

import com.freshfruits.backend.Entity.Fruit;
import com.freshfruits.backend.Entity.Order;
import com.freshfruits.backend.Entity.RefundTicket;
import com.freshfruits.backend.repository.FruitRepository;
import com.freshfruits.backend.repository.OrderRepository;
import com.freshfruits.backend.repository.RefundTicketRepository;
import com.freshfruits.backend.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private RefundService refundService;
    @Autowired
    private RefundTicketRepository refundTicketRepository;
    @Autowired
    private FruitRepository fruitRepository;
    @Autowired
    private OrderRepository orderRepository;

    // --- REFUND MANAGEMENT (HITL) ---

    // 1. View Pending Tickets
    @GetMapping("/refunds")
    public List<RefundTicket> getPendingRefunds() {
        return refundTicketRepository.findByStatus("PENDING_REVIEW");
    }

    // 2. Approve a Refund (The "Click" Action)
    @PostMapping("/refunds/{id}/approve")
    public ResponseEntity<String> approveRefund(@PathVariable Long id) {
        refundService.approveRefund(id);
        return ResponseEntity.ok("Refund Approved. Money will be credited in 3-5 days.");
    }

    // 3. Reject a Refund
    @PostMapping("/refunds/{id}/reject")
    public ResponseEntity<String> rejectRefund(@PathVariable Long id) {
        RefundTicket ticket = refundTicketRepository.findById(id).orElseThrow();
        ticket.setStatus("REJECTED");
        refundTicketRepository.save(ticket);
        return ResponseEntity.ok("Refund Rejected.");
    }

    // --- INVENTORY MANAGEMENT ---

    // 4. Restock Fruits
    @PostMapping("/inventory/restock")
    public Fruit restockFruit(@RequestParam Long fruitId, @RequestParam Double quantity) {
        Fruit fruit = fruitRepository.findById(fruitId).orElseThrow();
        fruit.setStockQuantity(quantity); // Set absolute value or add logic to increment
        return fruitRepository.save(fruit);
    }

    @GetMapping("/gate-pass")
    public ResponseEntity<byte[]> downloadGatePass(@RequestParam(required = false) LocalDate date) {
        if (date == null) date = LocalDate.now().plusDays(1); // Default to Tomorrow

        List<Order> orders = orderRepository.findByDeliveryDateOrderByLocation(date);

        // 1. Generate CSV Content
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // HEADER (Standard Format for Security Guards)
        writer.println("S.No,Community,Block,Flat No,Customer Name,Phone,Vendor,Type");

        int serial = 1;
        for (Order order : orders) {
            writer.printf("%d,%s,%s,%s,%s,%s,%s,%s%n",
                    serial++,
                    escape(order.getCommunityName()),
                    escape(order.getBlockName()),
                    escape(order.getFlatNo()),
                    escape(order.getCustomerName()),
                    order.getCustomerPhone(),
                    "FreshFruits",     // Vendor Name
                    "Groceries/Perishable" // Item Type
            );
        }
        writer.flush();

        // 2. Return as File Download
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=GatePass_" + date + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(out.toByteArray());
    }

    // Helper to handle commas in names
    private String escape(String data) {
        if (data == null) return "";
        return "\"" + data.replace("\"", "\"\"") + "\"";
    }
}
