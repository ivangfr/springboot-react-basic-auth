package com.mycompany.bookapi.rest;

import com.mycompany.bookapi.mapper.BookMapper;
import com.mycompany.bookapi.model.Book;
import com.mycompany.bookapi.rest.dto.BookDto;
import com.mycompany.bookapi.rest.dto.CreateBookRequest;
import com.mycompany.bookapi.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final BookMapper bookMapper;

    public BookController(BookService bookService, BookMapper bookMapper) {
        this.bookService = bookService;
        this.bookMapper = bookMapper;
    }

    @GetMapping
    public List<BookDto> getBooks(@RequestParam(value = "text", required = false) String text) {
        List<Book> books = (text == null) ? bookService.getBooks() : bookService.getBooksContainingText(text);
        return books.stream()
                .map(book -> bookMapper.toBookDto(book))
                .collect(Collectors.toList());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public BookDto createBook(@Valid @RequestBody CreateBookRequest createBookRequest) {
        Book book = bookMapper.toBook(createBookRequest);
        return bookMapper.toBookDto(bookService.saveBook(book));
    }

    @DeleteMapping("/{isbn}")
    public BookDto deleteBook(@PathVariable String isbn) {
        Book book = bookService.validateAndGetBook(isbn);
        bookService.deleteBook(book);
        return bookMapper.toBookDto(book);
    }

}
