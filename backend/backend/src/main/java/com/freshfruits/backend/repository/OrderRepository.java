package com.freshfruits.backend.repository;


import com.freshfruits.backend.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ---------------------------------------------------------
    // 1. PACKING LIST (The Aggregator)
    // ---------------------------------------------------------
    // Instead of fetching 5000 orders, we ask DB: "Group by Fruit Name and SUM the quantity"
    // Returns: [["Mango", 500.0], ["Apple", 200.0]]
    @Query("SELECT i.fruit.name, SUM(i.quantityKg) " +
            "FROM OrderItem i " +
            "WHERE i.order.deliveryDate = :date " +
            "AND i.order.status != 'CANCELLED' " +
            "GROUP BY i.fruit.name")
    List<Object[]> getPackingListForDate(@Param("date") LocalDate date);

    // ---------------------------------------------------------
    // 2. DRIVER ROUTE (Vertical Logistics)
    // ---------------------------------------------------------
    // Sorts by Community -> Block -> Flat Number (Optimized for Deliveries)
    @Query("SELECT o FROM Order o " +
            "WHERE o.deliveryDate = :date " +
            "AND o.status = 'PACKED' " +
            "ORDER BY o.communityName ASC, o.blockName ASC, o.flatNo ASC")
    List<Order> findDriverRoute(@Param("date") LocalDate date);

    // 3. Customer History
    List<Order> findByCustomerPhoneOrderByOrderTimestampDesc(String phone);

    @Query("SELECT o FROM Order o WHERE o.deliveryDate = :date ORDER BY o.communityName, o.blockName, o.flatNo")
    List<Order> findByDeliveryDateOrderByLocation(LocalDate date);
}
