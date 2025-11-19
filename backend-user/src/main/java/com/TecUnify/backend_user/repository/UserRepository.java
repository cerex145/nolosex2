package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Boolean existsByEmail(String email);
    Boolean existsByGoogleId(String googleId);
    // removed: existsByCarnetEstudiantil - field not present in User entity
}