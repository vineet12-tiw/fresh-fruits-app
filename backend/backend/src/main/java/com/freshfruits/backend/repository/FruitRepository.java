package com.freshfruits.backend.repository;

import com.freshfruits.backend.Entity.Fruit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FruitRepository extends JpaRepository<Fruit, Long> {

    // 1. Customer View: Only show fruits that are in stock
    List<Fruit> findByStockQuantityGreaterThan(Double minStock);

    // 2. Admin View: Low Stock Alert (e.g., less than 10kg left)
    @Query("SELECT f FROM Fruit f WHERE f.stockQuantity < :limit")
    List<Fruit> findLowStockItems(Double limit);
}