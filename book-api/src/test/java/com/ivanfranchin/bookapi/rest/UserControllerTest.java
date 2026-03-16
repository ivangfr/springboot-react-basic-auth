package com.ivanfranchin.bookapi.rest;

import com.ivanfranchin.bookapi.security.CustomUserDetails;
import com.ivanfranchin.bookapi.security.CustomUserDetailsService;
import com.ivanfranchin.bookapi.security.SecurityConfig;
import com.ivanfranchin.bookapi.user.User;
import com.ivanfranchin.bookapi.user.UserNotFoundException;
import com.ivanfranchin.bookapi.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithSecurityContext;
import org.springframework.security.test.context.support.WithSecurityContextFactory;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    // -- GET /api/users/me --

    @WithCustomUserDetails(username = "alice", role = "USER")
    @Test
    void getCurrentUser_asUser_returns200() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void getCurrentUser_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    // -- GET /api/users --

    @WithMockUser(authorities = "ADMIN")
    @Test
    void getUsers_asAdmin_returns200() throws Exception {
        when(userService.getUsers()).thenReturn(List.of(
                newUser(1L, "admin", "ADMIN"),
                newUser(2L, "user", "USER")
        ));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[1].username").value("user"));
    }

    @WithMockUser(authorities = "USER")
    @Test
    void getUsers_asUser_returns403() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getUsers_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    // -- GET /api/users/{username} --

    @WithMockUser(authorities = "ADMIN")
    @Test
    void getUser_asAdmin_returns200() throws Exception {
        User user = newUser(2L, "alice", "USER");
        when(userService.validateAndGetUserByUsername("alice")).thenReturn(user);

        mockMvc.perform(get("/api/users/alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @WithMockUser(authorities = "ADMIN")
    @Test
    void getUser_notFound_returns404() throws Exception {
        when(userService.validateAndGetUserByUsername("ghost"))
                .thenThrow(new UserNotFoundException("User with username ghost not found"));

        mockMvc.perform(get("/api/users/ghost"))
                .andExpect(status().isNotFound());
    }

    // -- DELETE /api/users/{username} --

    @WithMockUser(authorities = "ADMIN")
    @Test
    void deleteUser_asAdmin_returns200() throws Exception {
        User user = newUser(2L, "alice", "USER");
        when(userService.validateAndGetUserByUsername("alice")).thenReturn(user);

        mockMvc.perform(delete("/api/users/alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @WithMockUser(authorities = "USER")
    @Test
    void deleteUser_asUser_returns403() throws Exception {
        mockMvc.perform(delete("/api/users/alice"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteUser_unauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/users/alice"))
                .andExpect(status().isUnauthorized());
    }

    private User newUser(Long id, String username, String role) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setName(username);
        user.setEmail(username + "@example.com");
        user.setRole(role);
        return user;
    }

    // -- Custom @WithSecurityContext for CustomUserDetails --

    @Retention(RetentionPolicy.RUNTIME)
    @WithSecurityContext(factory = WithCustomUserDetailsSecurityContextFactory.class)
    @interface WithCustomUserDetails {
        String username() default "user";
        String role() default "USER";
    }

    static class WithCustomUserDetailsSecurityContextFactory
            implements WithSecurityContextFactory<WithCustomUserDetails> {

        @Override
        public SecurityContext createSecurityContext(WithCustomUserDetails annotation) {
            String username = annotation.username();
            CustomUserDetails principal = new CustomUserDetails(
                    null,
                    username,
                    "password",
                    username,
                    username + "@example.com",
                    List.of(new SimpleGrantedAuthority(annotation.role()))
            );

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    principal, null, principal.getAuthorities());

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            return context;
        }
    }
}
