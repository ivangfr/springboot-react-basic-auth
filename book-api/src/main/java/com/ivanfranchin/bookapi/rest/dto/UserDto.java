package com.ivanfranchin.bookapi.rest.dto;

import com.ivanfranchin.bookapi.security.CustomUserDetails;
import com.ivanfranchin.bookapi.security.Role;
import com.ivanfranchin.bookapi.user.User;

public record UserDto(Long id, String username, String name, String email, Role role) {

    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public static UserDto from(CustomUserDetails userDetails) {
        String authority = userDetails.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority())
                .orElse(null);
        return new UserDto(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getName(),
                userDetails.getEmail(),
                authority != null ? Role.valueOf(authority) : null
        );
    }
}
