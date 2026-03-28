package com.ivanfranchin.bookapi.rest;

import com.ivanfranchin.bookapi.user.User;
import com.ivanfranchin.bookapi.rest.dto.UserDto;
import com.ivanfranchin.bookapi.security.CustomUserDetails;
import com.ivanfranchin.bookapi.security.Role;
import com.ivanfranchin.bookapi.user.UserDeletionNotAllowedException;
import com.ivanfranchin.bookapi.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.ivanfranchin.bookapi.config.SwaggerConfig.BASIC_AUTH_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping("/me")
    public UserDto getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return UserDto.from(currentUser);
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping
    public List<UserDto> getUsers() {
        return userService.getUsers().stream()
                .map(UserDto::from)
                .toList();
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping("/{username}")
    public UserDto getUser(@PathVariable String username) {
        return UserDto.from(userService.validateAndGetUserByUsername(username));
    }

    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{username}")
    public void deleteUser(@PathVariable String username,
                           @AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userService.validateAndGetUserByUsername(username);
        if (currentUser.getUsername().equals(username)) {
            throw new UserDeletionNotAllowedException("You cannot delete your own account");
        }
        if (Role.ADMIN == user.getRole() && userService.countAdmins() == 1) {
            throw new UserDeletionNotAllowedException("Cannot delete the last admin account");
        }
        userService.deleteUser(user);
    }
}
