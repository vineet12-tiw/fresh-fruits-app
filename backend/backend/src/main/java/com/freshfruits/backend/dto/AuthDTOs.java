package com.freshfruits.backend.dto;

import lombok.Data;

public class AuthDTOs {

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String username; // Phone Number is best for your app
        private String password;
        private String fullName; // "Anil Kumar"
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private String username;

        public AuthResponse(String token, String role, String username) {
            this.token = token;
            this.role = role;
            this.username = username;
        }
    }
}
