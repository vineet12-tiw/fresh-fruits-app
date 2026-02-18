package com.freshfruits.backend.controller;


import com.freshfruits.backend.Entity.Fruit;
import com.freshfruits.backend.Entity.Order;
import com.freshfruits.backend.Entity.OrderItem;
import com.freshfruits.backend.dto.OrderDTOs;
import com.freshfruits.backend.repository.FruitRepository;
import com.freshfruits.backend.repository.OrderRepository;
import com.freshfruits.backend.dto.OrderDTOs.*;

import com.freshfruits.backend.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private FruitRepository fruitRepository;
    @Autowired
    private DeliveryService deliveryService;

    // F-02: Customer Places Order
    @PostMapping
    @Transactional // If anything fails, rollback the whole order
    public ResponseEntity<String> placeOrder(@RequestBody OrderDTOs.OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCommunityName(request.getCommunityName());
        order.setBlockName(request.getBlockName());
        order.setFlatNo(request.getFlatNo());

        // 1. Calculate Delivery Date (8 PM Cutoff)
        order.setDeliveryDate(deliveryService.calculateDeliveryDate());

        // 2. Map Items & Deduct Stock
        List<OrderItem> entityItems = new ArrayList<>();
        double totalAmount = 0;

        for (OrderDTOs.OrderItemRequest itemReq : request.getItems()) {
            Fruit fruit = fruitRepository.findById(itemReq.getFruitId())
                    .orElseThrow(() -> new RuntimeException("Fruit not found"));

            // Stock Check
            if (fruit.getStockQuantity() < itemReq.getQuantityKg()) {
                return ResponseEntity.badRequest().body("Insufficient stock for: " + fruit.getName());
            }

            // Deduct Stock
            fruit.setStockQuantity(fruit.getStockQuantity() - itemReq.getQuantityKg());
            fruitRepository.save(fruit);

            // Create OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setFruit(fruit);
            orderItem.setQuantityKg(itemReq.getQuantityKg());
            orderItem.setOrder(order); // Link back to parent
            entityItems.add(orderItem);

            totalAmount += (fruit.getPricePerKg() * itemReq.getQuantityKg());
        }

        order.setItems(entityItems);
        order.setTotalAmount(totalAmount);

        orderRepository.save(order);

        return ResponseEntity.ok("Order placed! Delivery Date: " + order.getDeliveryDate());
    }

    // F-05: Admin Packing List
    @GetMapping("/admin/packing-list")
    public List<PackingListItem> getPackingList(@RequestParam(required = false) LocalDate date) {
        if (date == null) date = LocalDate.now().plusDays(1); // Default to tomorrow

        List<Object[]> results = orderRepository.getPackingListForDate(date);

        // Map Object[] from DB to clean DTO
        return results.stream()
                .map(row -> new PackingListItem((String) row[0], (Double) row[1]))
                .collect(Collectors.toList());
    }

    // F-08: Driver Route (Vertical Sorting)
    @GetMapping("/driver/route")
    public List<DriverOrderView> getDriverRoute(@RequestParam(required = false) LocalDate date) {
        if (date == null) date = LocalDate.now(); // Default to today

        List<Order> orders = orderRepository.findDriverRoute(date);

        return orders.stream().map(o -> {
            DriverOrderView view = new DriverOrderView();
            view.setOrderId(o.getId());
            view.setCustomerName(o.getCustomerName());
            view.setPhone(o.getCustomerPhone());
            view.setStatus(o.getStatus());
            view.setAddressLabel(o.getCommunityName() + " | " + o.getBlockName() + " | " + o.getFlatNo());
            return view;
        }).collect(Collectors.toList());
    }

    @GetMapping("/all") // GET /api/orders/all
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // GET /api/orders/my-orders
    // Retrieves orders for the currently logged-in user
    @GetMapping("/my-orders")
    public List<Order> getMyOrders(Principal principal) {
        // Principal.getName() automatically returns the phone number from the JWT Token
        String username = principal.getName();

        // You need to ensure your Repository has this method!
        return orderRepository.findByCustomerPhoneOrderByOrderTimestampDesc(username);
    }
}
