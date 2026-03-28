package com.ivanfranchin.bookapi.rest;

import com.ivanfranchin.bookapi.rest.dto.LoginRequest;
import com.ivanfranchin.bookapi.rest.dto.SignUpRequest;
import com.ivanfranchin.bookapi.security.CustomUserDetailsService;
import com.ivanfranchin.bookapi.security.Role;
import com.ivanfranchin.bookapi.security.SecurityConfig;
import com.ivanfranchin.bookapi.user.User;
import com.ivanfranchin.bookapi.user.UserService;

import tools.jackson.databind.ObjectMapper;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    UserService userService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    PasswordEncoder passwordEncoder;

    // -- POST /auth/authenticate --

    @Test
    void authenticate_validCredentials_returns200() throws Exception {
        User user = newUser(1L, "alice", "Alice", "alice@example.com", Role.USER);
        when(userService.validUsernameAndPassword("alice", "secret")).thenReturn(Optional.of(user));

        LoginRequest request = new LoginRequest("alice", "secret");

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void authenticate_invalidCredentials_returns401() throws Exception {
        when(userService.validUsernameAndPassword("alice", "wrong")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("alice", "wrong");

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticate_blankUsername_returns400() throws Exception {
        LoginRequest request = new LoginRequest("", "secret");

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authenticate_blankPassword_returns400() throws Exception {
        LoginRequest request = new LoginRequest("alice", "");

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // -- POST /auth/signup --

    @Test
    void signUp_newUser_returns201() throws Exception {
        when(userService.hasUserWithUsername("bob")).thenReturn(false);
        when(userService.hasUserWithEmail("bob@example.com")).thenReturn(false);

        User saved = newUser(3L, "bob", "Bob", "bob@example.com", Role.USER);
        when(userService.saveUser(any(User.class))).thenReturn(saved);

        SignUpRequest request = new SignUpRequest("bob", "pass", "Bob", "bob@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Bob"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void signUp_duplicateUsername_returns409() throws Exception {
        when(userService.hasUserWithUsername("alice")).thenReturn(true);

        SignUpRequest request = new SignUpRequest("alice", "pass", "Alice", "alice@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void signUp_duplicateEmail_returns409() throws Exception {
        when(userService.hasUserWithUsername("newuser")).thenReturn(false);
        when(userService.hasUserWithEmail("alice@example.com")).thenReturn(true);

        SignUpRequest request = new SignUpRequest("newuser", "pass", "New User", "alice@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void signUp_concurrentDuplicate_returns409() throws Exception {
        when(userService.hasUserWithUsername("bob")).thenReturn(false);
        when(userService.hasUserWithEmail("bob@example.com")).thenReturn(false);
        when(userService.saveUser(any(User.class)))
                .thenThrow(new DataIntegrityViolationException("unique constraint violation"));

        SignUpRequest request = new SignUpRequest("bob", "pass", "Bob", "bob@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void signUp_invalidEmail_returns400() throws Exception {
        SignUpRequest request = new SignUpRequest("bob", "pass", "Bob", "not-an-email");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_blankUsername_returns400() throws Exception {
        SignUpRequest request = new SignUpRequest("", "pass", "Bob", "bob@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_blankName_returns400() throws Exception {
        SignUpRequest request = new SignUpRequest("bob", "pass", "", "bob@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_blankPassword_returns400() throws Exception {
        SignUpRequest request = new SignUpRequest("bob", "", "Bob", "bob@example.com");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signUp_blankEmail_returns400() throws Exception {
        SignUpRequest request = new SignUpRequest("bob", "pass", "Bob", "");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    private User newUser(Long id, String username, String name, String email, Role role) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        return user;
    }
}
