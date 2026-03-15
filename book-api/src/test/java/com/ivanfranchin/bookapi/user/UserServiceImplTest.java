package com.ivanfranchin.bookapi.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserServiceImpl userService;

    @Test
    void getUsers_returnsAllUsers() {
        List<User> users = List.of(newUser("alice"), newUser("bob"));
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getUsers();

        assertThat(result).isEqualTo(users);
        verify(userRepository).findAll();
    }

    @Test
    void hasUserWithUsername_returnsTrue() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThat(userService.hasUserWithUsername("alice")).isTrue();
    }

    @Test
    void hasUserWithUsername_returnsFalse() {
        when(userRepository.existsByUsername("ghost")).thenReturn(false);

        assertThat(userService.hasUserWithUsername("ghost")).isFalse();
    }

    @Test
    void hasUserWithEmail_returnsTrue() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThat(userService.hasUserWithEmail("alice@example.com")).isTrue();
    }

    @Test
    void hasUserWithEmail_returnsFalse() {
        when(userRepository.existsByEmail("nobody@example.com")).thenReturn(false);

        assertThat(userService.hasUserWithEmail("nobody@example.com")).isFalse();
    }

    @Test
    void validateAndGetUserByUsername_found_returnsUser() {
        User user = newUser("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        User result = userService.validateAndGetUserByUsername("alice");

        assertThat(result).isEqualTo(user);
    }

    @Test
    void validateAndGetUserByUsername_notFound_throwsUserNotFoundException() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.validateAndGetUserByUsername("ghost"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("ghost");
    }

    @Test
    void saveUser_delegatesToRepository() {
        User user = newUser("alice");
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.saveUser(user);

        assertThat(result).isEqualTo(user);
        verify(userRepository).save(user);
    }

    @Test
    void deleteUser_delegatesToRepository() {
        User user = newUser("alice");

        userService.deleteUser(user);

        verify(userRepository).delete(user);
    }

    @Test
    void validUsernameAndPassword_correctPassword_returnsUser() {
        User user = newUser("alice");
        user.setPassword("{bcrypt}hashed");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "{bcrypt}hashed")).thenReturn(true);

        Optional<User> result = userService.validUsernameAndPassword("alice", "secret");

        assertThat(result).isPresent().contains(user);
    }

    @Test
    void validUsernameAndPassword_wrongPassword_returnsEmpty() {
        User user = newUser("alice");
        user.setPassword("{bcrypt}hashed");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "{bcrypt}hashed")).thenReturn(false);

        Optional<User> result = userService.validUsernameAndPassword("alice", "wrong");

        assertThat(result).isEmpty();
    }

    @Test
    void validUsernameAndPassword_unknownUser_returnsEmpty() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        Optional<User> result = userService.validUsernameAndPassword("ghost", "any");

        assertThat(result).isEmpty();
    }

    private User newUser(String username) {
        User user = new User();
        user.setUsername(username);
        user.setName(username);
        user.setEmail(username + "@example.com");
        user.setRole("USER");
        return user;
    }
}
