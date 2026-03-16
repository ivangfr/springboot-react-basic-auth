package com.ivanfranchin.bookapi.rest;

import com.ivanfranchin.bookapi.book.BookService;
import com.ivanfranchin.bookapi.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/public")
public class PublicController {

    private final UserService userService;
    private final BookService bookService;

    @GetMapping("/numberOfUsers")
    public long getNumberOfUsers() {
        return userService.countUsers();
    }

    @GetMapping("/numberOfBooks")
    public long getNumberOfBooks() {
        return bookService.countBooks();
    }
}
