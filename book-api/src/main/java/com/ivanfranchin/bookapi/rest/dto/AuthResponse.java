package com.ivanfranchin.bookapi.rest.dto;

import com.ivanfranchin.bookapi.security.Role;

public record AuthResponse(Long id, String name, Role role) {
}
