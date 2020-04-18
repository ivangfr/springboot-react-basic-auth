package com.mycompany.bookapi.runner;

import com.mycompany.bookapi.model.Book;
import com.mycompany.bookapi.model.User;
import com.mycompany.bookapi.security.WebSecurityConfig;
import com.mycompany.bookapi.service.BookService;
import com.mycompany.bookapi.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserService userService;
    private final BookService bookService;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserService userService, BookService bookService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.bookService = bookService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userService.getUsers().isEmpty()) {
            return;
        }
        users.forEach(user -> {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userService.saveUser(user);
        });
        books.forEach(bookService::saveBook);
        log.info("Database initialized");
    }

    private final List<User> users = Arrays.asList(
            new User("admin", "admin", "Admin", "admin@mycompany.com", WebSecurityConfig.ADMIN),
            new User("user", "user", "User", "user@mycompany.com", WebSecurityConfig.USER)
    );

    private final List<Book> books = Collections.singletonList(
            new Book("abc", "Spring Security")
    );

}
