package com.ivanfranchin.bookapi.service;

import com.ivanfranchin.bookapi.model.Book;

import java.util.List;

public interface BookService {

    List<Book> getBooks();

    List<Book> getBooksContainingText(String text);

    Book validateAndGetBook(String isbn);

    Book saveBook(Book book);

    void deleteBook(Book book);
}
