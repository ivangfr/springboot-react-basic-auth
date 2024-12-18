package com.ivanfranchin.bookapi.rest.dto;

import com.ivanfranchin.bookapi.model.Book;

public record BookDto(String isbn, String title) {

    public static BookDto from(Book book) {
        return new BookDto(book.getIsbn(), book.getTitle());
    }
}