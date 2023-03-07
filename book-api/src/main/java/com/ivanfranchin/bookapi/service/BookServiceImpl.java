package com.ivanfranchin.bookapi.service;

import com.ivanfranchin.bookapi.model.Book;
import com.ivanfranchin.bookapi.exception.BookNotFoundException;
import com.ivanfranchin.bookapi.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    public List<Book> getBooks() {
        return bookRepository.findAllByOrderByTitle();
    }

    @Override
    public List<Book> getBooksContainingText(String text) {
        return bookRepository.findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text);
    }

    @Override
    public Book validateAndGetBook(String isbn) {
        return bookRepository.findById(isbn)
                .orElseThrow(() -> new BookNotFoundException(String.format("Book with isbn %s not found", isbn)));
    }

    @Override
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Book book) {
        bookRepository.delete(book);
    }
}
