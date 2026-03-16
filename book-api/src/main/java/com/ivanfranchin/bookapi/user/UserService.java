package com.ivanfranchin.bookapi.user;

import com.ivanfranchin.bookapi.rest.dto.SignUpRequest;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getUsers();

    Optional<User> getUserByUsername(String username);

    boolean hasUserWithUsername(String username);

    boolean hasUserWithEmail(String email);

    User validateAndGetUserByUsername(String username);

    User createUser(SignUpRequest signUpRequest);

    User saveUser(User user);

    void deleteUser(User user);

    Optional<User> validUsernameAndPassword(String username, String password);

    long countUsers();
}
