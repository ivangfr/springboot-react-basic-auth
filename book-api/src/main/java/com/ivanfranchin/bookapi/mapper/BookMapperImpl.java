package com.ivanfranchin.bookapi.mapper;

import com.ivanfranchin.bookapi.model.Book;
import com.ivanfranchin.bookapi.rest.dto.BookDto;
import com.ivanfranchin.bookapi.rest.dto.CreateBookRequest;
import org.springframework.stereotype.Service;

@Service
public class BookMapperImpl implements BookMapper {

    @Override
    public Book toBook(CreateBookRequest createBookRequest) {
        return new Book(createBookRequest.getIsbn(), createBookRequest.getTitle());
    }

    @Override
    public BookDto toBookDto(Book book) {
        return new BookDto(book.getIsbn(), book.getTitle());
    }
}
