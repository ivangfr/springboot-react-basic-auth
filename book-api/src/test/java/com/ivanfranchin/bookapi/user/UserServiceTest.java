package com.ivanfranchin.bookapi.user;

import com.ivanfranchin.bookapi.security.Role;
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
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;

    @Test
    void getUsers_returnsAllUsers() {
        List<User> users = List.of(newUser("alice"), newUser("bob"));
        when(userRepository.findAllByOrderByUsername()).thenReturn(users);

        List<User> result = userService.getUsers();

        assertThat(result).isEqualTo(users);
        verify(userRepository).findAllByOrderByUsername();
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void hasUserWithUsername_returnsTrue() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThat(userService.hasUserWithUsername("alice")).isTrue();
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void hasUserWithUsername_returnsFalse() {
        when(userRepository.existsByUsername("ghost")).thenReturn(false);

        assertThat(userService.hasUserWithUsername("ghost")).isFalse();
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void hasUserWithEmail_returnsTrue() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThat(userService.hasUserWithEmail("alice@example.com")).isTrue();
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void hasUserWithEmail_returnsFalse() {
        when(userRepository.existsByEmail("nobody@example.com")).thenReturn(false);

        assertThat(userService.hasUserWithEmail("nobody@example.com")).isFalse();
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void validateAndGetUserByUsername_found_returnsUser() {
        User user = newUser("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        User result = userService.validateAndGetUserByUsername("alice");

        assertThat(result).isEqualTo(user);
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void validateAndGetUserByUsername_notFound_throwsUserNotFoundException() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.validateAndGetUserByUsername("ghost"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("ghost");
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void saveUser_delegatesToRepository() {
        User user = newUser("alice");
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.saveUser(user);

        assertThat(result).isEqualTo(user);
        verify(userRepository).save(user);
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void deleteUser_delegatesToRepository() {
        User user = newUser("alice");

        userService.deleteUser(user);

        verify(userRepository).delete(user);
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void validUsernameAndPassword_correctPassword_returnsUser() {
        User user = newUser("alice");
        user.setPassword("{bcrypt}hashed");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "{bcrypt}hashed")).thenReturn(true);

        Optional<User> result = userService.validUsernameAndPassword("alice", "secret");

        assertThat(result).isPresent().contains(user);
        verify(userRepository).findByUsername("alice");
        verify(passwordEncoder).matches("secret", "{bcrypt}hashed");
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void validUsernameAndPassword_wrongPassword_returnsEmpty() {
        User user = newUser("alice");
        user.setPassword("{bcrypt}hashed");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "{bcrypt}hashed")).thenReturn(false);

        Optional<User> result = userService.validUsernameAndPassword("alice", "wrong");

        assertThat(result).isEmpty();
        verify(userRepository).findByUsername("alice");
        verify(passwordEncoder).matches("wrong", "{bcrypt}hashed");
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void validUsernameAndPassword_unknownUser_returnsEmpty() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        Optional<User> result = userService.validUsernameAndPassword("ghost", "any");

        assertThat(result).isEmpty();
        verify(userRepository).findByUsername("ghost");
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void getUserByUsername_delegatesToRepository() {
        User user = newUser("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByUsername("alice");

        assertThat(result).isPresent().contains(user);
        verify(userRepository).findByUsername("alice");
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void countUsers_delegatesToRepository() {
        when(userRepository.count()).thenReturn(7L);

        long result = userService.countUsers();

        assertThat(result).isEqualTo(7L);
        verify(userRepository).count();
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    @Test
    void countAdmins_delegatesToRepository() {
        when(userRepository.countByRole(Role.ADMIN)).thenReturn(2L);

        long result = userService.countAdmins();

        assertThat(result).isEqualTo(2);
        verify(userRepository).countByRole(Role.ADMIN);
        verifyNoMoreInteractions(userRepository, passwordEncoder);
    }

    private User newUser(String username) {
        User user = new User();
        user.setUsername(username);
        user.setName(username);
        user.setEmail(username + "@example.com");
        user.setRole(Role.USER);
        return user;
    }
}
