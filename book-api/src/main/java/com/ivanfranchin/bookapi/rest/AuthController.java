package com.ivanfranchin.bookapi.rest;

import com.ivanfranchin.bookapi.rest.dto.AuthResponse;
import com.ivanfranchin.bookapi.rest.dto.LoginRequest;
import com.ivanfranchin.bookapi.rest.dto.SignUpRequest;
import com.ivanfranchin.bookapi.user.DuplicatedUserInfoException;
import com.ivanfranchin.bookapi.user.User;
import com.ivanfranchin.bookapi.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return userService.validUsernameAndPassword(loginRequest.username(), loginRequest.password())
                .map(user -> ResponseEntity.ok(new AuthResponse(user.getId(), user.getName(), user.getRole())))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/signup")
    public AuthResponse signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userService.hasUserWithUsername(signUpRequest.username())) {
            throw new DuplicatedUserInfoException(String.format("Username %s is already in use", signUpRequest.username()));
        }
        if (userService.hasUserWithEmail(signUpRequest.email())) {
            throw new DuplicatedUserInfoException(String.format("Email %s is already in use", signUpRequest.email()));
        }

        User user = userService.createUser(signUpRequest);
        return new AuthResponse(user.getId(), user.getName(), user.getRole());
    }
}
