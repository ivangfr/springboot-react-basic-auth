package com.ivanfranchin.bookapi;

import com.ivanfranchin.bookapi.book.BookRepository;
import com.ivanfranchin.bookapi.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class BookApiApplicationTests {

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    BookRepository bookRepository;

    @MockitoBean
    PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }
}
