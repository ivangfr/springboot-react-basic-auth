package com.ivanfranchin.bookapi.user;

import com.ivanfranchin.bookapi.security.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  List<User> findAllByOrderByUsername();

  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  long countByRole(Role role);
}
