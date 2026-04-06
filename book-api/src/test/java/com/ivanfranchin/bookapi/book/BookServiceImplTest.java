package com.ivanfranchin.bookapi.book;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    BookRepository bookRepository;

    @InjectMocks
    BookService bookService;

    @Test
    void getBooks_returnsAllBooksSorted() {
        List<Book> books = List.of(new Book("111", "Alpha"), new Book("222", "Beta"));
        when(bookRepository.findAllByOrderByTitle()).thenReturn(books);

        List<Book> result = bookService.getBooks();

        assertThat(result).isEqualTo(books);
        verify(bookRepository).findAllByOrderByTitle();
        verifyNoMoreInteractions(bookRepository);
    }

    @Test
    void getBooksContainingText_returnsFilteredList() {
        String text = "spy";
        List<Book> books = List.of(new Book("999", "Super Spy"));
        when(bookRepository.findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text)).thenReturn(books);

        List<Book> result = bookService.getBooksContainingText(text);

        assertThat(result).isEqualTo(books);
        verify(bookRepository).findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text);
        verifyNoMoreInteractions(bookRepository);
    }

    @Test
    void validateAndGetBook_found_returnsBook() {
        Book book = new Book("123", "Some Book");
        when(bookRepository.findById("123")).thenReturn(Optional.of(book));

        Book result = bookService.validateAndGetBook("123");

        assertThat(result).isEqualTo(book);
        verifyNoMoreInteractions(bookRepository);
    }

    @Test
    void validateAndGetBook_notFound_throwsBookNotFoundException() {
        when(bookRepository.findById("000")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.validateAndGetBook("000"))
                .isInstanceOf(BookNotFoundException.class)
                .hasMessageContaining("000");
        verifyNoMoreInteractions(bookRepository);
    }

    @Test
    void saveBook_delegatesToRepository() {
        Book book = new Book("123", "Some Book");
        when(bookRepository.save(book)).thenReturn(book);

        Book result = bookService.saveBook(book);

        assertThat(result).isEqualTo(book);
        verify(bookRepository).save(book);
        verifyNoMoreInteractions(bookRepository);
    }

    @Test
    void deleteBook_delegatesToRepository() {
        Book book = new Book("123", "Some Book");

        bookService.deleteBook(book);

        verify(bookRepository).delete(book);
        verifyNoMoreInteractions(bookRepository);
    }

    @Test
    void countBooks_delegatesToRepository() {
        when(bookRepository.count()).thenReturn(42L);

        long result = bookService.countBooks();

        assertThat(result).isEqualTo(42L);
        verify(bookRepository).count();
        verifyNoMoreInteractions(bookRepository);
    }
}
