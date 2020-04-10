package com.mycompany.bookapi.runner;

import com.mycompany.bookapi.model.Book;
import com.mycompany.bookapi.model.User;
import com.mycompany.bookapi.security.WebSecurityConfig;
import com.mycompany.bookapi.service.BookService;
import com.mycompany.bookapi.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserService userService;
    private final BookService bookService;

    public DatabaseInitializer(UserService userService, BookService bookService) {
        this.userService = userService;
        this.bookService = bookService;
    }

    @Override
    public void run(String... args) {
        users.forEach(userService::saveUser);
        books.forEach(bookService::saveBook);
        log.info("Database initialized");
    }

    private final List<User> users = Arrays.asList(
            new User("admin", "admin", WebSecurityConfig.ADMIN),
            new User("user", "user", WebSecurityConfig.USER)
    );

    private final List<Book> books = Collections.singletonList(
            new Book("abc", "Spring Security")
    );

}
