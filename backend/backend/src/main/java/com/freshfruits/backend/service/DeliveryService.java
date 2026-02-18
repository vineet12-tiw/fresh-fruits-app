package com.freshfruits.backend.service;



import com.freshfruits.backend.Entity.Fruit;
import com.freshfruits.backend.Entity.Order;
import com.freshfruits.backend.Entity.OrderItem;
import com.freshfruits.backend.dto.OrderDTOs;
import com.freshfruits.backend.repository.FruitRepository;
import com.freshfruits.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private FruitRepository fruitRepository;

    private static final LocalTime CUTOFF_TIME = LocalTime.of(20, 0); // 8:00 PM

    // Logic: 8 PM Cutoff
    public LocalDate calculateDeliveryDate() {
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();
        return now.isBefore(CUTOFF_TIME) ? today.plusDays(1) : today.plusDays(2);
    }

    // TRANSACTIONAL: Either everything succeeds, or nothing changes.
    @Transactional
    public Order placeOrder(OrderDTOs.OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCommunityName(request.getCommunityName());
        order.setBlockName(request.getBlockName());
        order.setFlatNo(request.getFlatNo());
        order.setDeliveryDate(calculateDeliveryDate());
        order.setStatus("PENDING");

        List<OrderItem> entityItems = new ArrayList<>();
        double totalAmount = 0;

        // Inventory Check & Locking
        for (OrderDTOs.OrderItemRequest itemReq : request.getItems()) {
            Fruit fruit = fruitRepository.findById(itemReq.getFruitId())
                    .orElseThrow(() -> new RuntimeException("Fruit not found: " + itemReq.getFruitId()));

            if (fruit.getStockQuantity() < itemReq.getQuantityKg()) {
                throw new RuntimeException("Out of Stock: " + fruit.getName());
            }

            // Deduct Stock
            fruit.setStockQuantity(fruit.getStockQuantity() - itemReq.getQuantityKg());
            fruitRepository.save(fruit);

            // Create Item
            OrderItem orderItem = new OrderItem();
            orderItem.setFruit(fruit);
            orderItem.setQuantityKg(itemReq.getQuantityKg());
            orderItem.setOrder(order);
            entityItems.add(orderItem);

            totalAmount += (fruit.getPricePerKg() * itemReq.getQuantityKg());
        }

        order.setItems(entityItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }
}