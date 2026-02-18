package com.freshfruits.backend.controller;


import com.freshfruits.backend.Entity.Fruit;
import com.freshfruits.backend.repository.FruitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fruits")
@CrossOrigin(origins = "*") // Allow React to access this
public class FruitController {

    @Autowired
    private FruitRepository fruitRepository;

    // F-01: Get all available fruits
    @GetMapping
    public List<Fruit> getCatalog() {
        // Industry Standard: Filter out fruits with 0 stock
        return fruitRepository.findByStockQuantityGreaterThan(0.0);
    }

    // Admin: Update Stock
    @PostMapping("/update-stock")
    public Fruit updateStock(@RequestParam Long id, @RequestParam Double quantity) {
        Fruit fruit = fruitRepository.findById(id).orElseThrow();
        fruit.setStockQuantity(quantity);
        return fruitRepository.save(fruit);
    }

    // 1. Add Fruit
    @PostMapping
    public Fruit addFruit(@RequestBody Fruit fruit) {
        return fruitRepository.save(fruit);
    }

    // 2. Delete Fruit
    @DeleteMapping("/{id}")
    public void deleteFruit(@PathVariable Long id) {
        fruitRepository.deleteById(id);
    }
}
