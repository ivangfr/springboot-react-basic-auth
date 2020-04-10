package com.mycompany.bookapi.rest;

import com.mycompany.bookapi.exception.BookNotFoundException;
import com.mycompany.bookapi.model.Book;
import com.mycompany.bookapi.rest.dto.CreateBookDto;
import com.mycompany.bookapi.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getBooks() {
        return bookService.getBooks();
    }

    @GetMapping("/{isbn}")
    public Book getBook(@PathVariable String isbn) throws BookNotFoundException {
        return bookService.validateAndGetBook(isbn);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Book createBook(@Valid @RequestBody CreateBookDto createBookDto) {
        return bookService.saveBook(new Book(createBookDto.getIsbn(), createBookDto.getTitle()));
    }

    @DeleteMapping("/{isbn}")
    public Book deleteBook(@PathVariable String isbn) throws BookNotFoundException {
        Book book = bookService.validateAndGetBook(isbn);
        bookService.deleteBook(book);
        return book;
    }

}
