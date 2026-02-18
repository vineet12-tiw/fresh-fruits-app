package com.freshfruits.backend.repository;

import com.freshfruits.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Used by Spring Security to load users during Login
    Optional<User> findByUsername(String username);

    // Check if user exists before registering (prevent duplicates)
    boolean existsByUsername(String username);
}
