package com.freshfruits.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

public class OrderDTOs {

    // 1. Customer sends this to place an order
    @Data
    public static class OrderRequest {
        private String customerName;
        private String customerPhone;
        // Gated Community Info
        private String communityName;
        private String blockName;
        private String flatNo;

        // List of items (Fruit ID + Quantity)
        private List<OrderItemRequest> items;
    }

    @Data
    public static class OrderItemRequest {
        private Long fruitId;
        private Double quantityKg;
    }

    // 2. Admin receives this for the "Packing List"
    @Data
    public static class PackingListItem {
        private String fruitName;
        private Double totalQuantityKg;

        public PackingListItem(String fruitName, Double totalQuantityKg) {
            this.fruitName = fruitName;
            this.totalQuantityKg = totalQuantityKg;
        }
    }

    // 3. Driver receives this for the Route
    @Data
    public static class DriverOrderView {
        private Long orderId;
        private String customerName;
        private String addressLabel; // "MyHome Avatar | Block A | 101"
        private String status;
        private String phone;
    }
}
