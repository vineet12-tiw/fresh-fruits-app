package com.freshfruits.backend.controller;


import com.freshfruits.backend.Entity.User;
import com.freshfruits.backend.dto.AuthDTOs;
import com.freshfruits.backend.repository.UserRepository;
import com.freshfruits.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder; // Injected from SecurityConfig

    // --- 1. SIGNUP ENDPOINT ---
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AuthDTOs.RegisterRequest request) {
        // Validation: Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username (Phone) is already taken!");
        }

        // Create new User Account
        User user = new User();
        user.setUsername(request.getUsername());

        // CRITICAL: Never save plain text passwords!
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default role is always CUSTOMER
        user.setRole("ROLE_CUSTOMER");

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // --- 2. LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTOs.LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String role = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_CUSTOMER");

            String token = jwtUtil.generateToken(request.getUsername(), role);

            return ResponseEntity.ok(new AuthDTOs.AuthResponse(token, role, request.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}