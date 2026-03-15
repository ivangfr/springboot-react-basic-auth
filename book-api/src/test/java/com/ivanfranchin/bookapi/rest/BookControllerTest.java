package com.ivanfranchin.bookapi.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ivanfranchin.bookapi.book.Book;
import com.ivanfranchin.bookapi.book.BookNotFoundException;
import com.ivanfranchin.bookapi.book.BookService;
import com.ivanfranchin.bookapi.rest.dto.CreateBookRequest;
import com.ivanfranchin.bookapi.security.CustomUserDetailsService;
import com.ivanfranchin.bookapi.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
@Import(SecurityConfig.class)
class BookControllerTest {

    @Autowired
    MockMvc mockMvc;

    ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    BookService bookService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    // -- GET /api/books --

    @WithMockUser(authorities = "USER")
    @Test
    void getBooks_noText_asUser_returns200() throws Exception {
        when(bookService.getBooks()).thenReturn(List.of(
                new Book("111", "Alpha"),
                new Book("222", "Beta")
        ));

        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].isbn").value("111"))
                .andExpect(jsonPath("$[0].title").value("Alpha"));
    }

    @WithMockUser(authorities = "USER")
    @Test
    void getBooks_withText_asUser_returns200() throws Exception {
        when(bookService.getBooksContainingText("spy")).thenReturn(List.of(
                new Book("999", "Super Spy")
        ));

        mockMvc.perform(get("/api/books").param("text", "spy"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Super Spy"));
    }

    @Test
    void getBooks_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isUnauthorized());
    }

    // -- POST /api/books --

    @WithMockUser(authorities = "ADMIN")
    @Test
    void createBook_asAdmin_returns201() throws Exception {
        Book saved = new Book("123", "Spring in Action");
        when(bookService.saveBook(any(Book.class))).thenReturn(saved);

        CreateBookRequest request = new CreateBookRequest("123", "Spring in Action");

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isbn").value("123"))
                .andExpect(jsonPath("$.title").value("Spring in Action"));
    }

    @WithMockUser(authorities = "USER")
    @Test
    void createBook_asUser_returns403() throws Exception {
        CreateBookRequest request = new CreateBookRequest("123", "Spring in Action");

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @WithMockUser(authorities = "ADMIN")
    @Test
    void createBook_blankIsbn_returns400() throws Exception {
        CreateBookRequest request = new CreateBookRequest("", "Spring in Action");

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @WithMockUser(authorities = "ADMIN")
    @Test
    void createBook_blankTitle_returns400() throws Exception {
        CreateBookRequest request = new CreateBookRequest("123", "");

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createBook_unauthenticated_returns401() throws Exception {
        CreateBookRequest request = new CreateBookRequest("123", "Spring in Action");

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // -- DELETE /api/books/{isbn} --

    @WithMockUser(authorities = "ADMIN")
    @Test
    void deleteBook_asAdmin_returns200() throws Exception {
        Book book = new Book("123", "Spring in Action");
        when(bookService.validateAndGetBook("123")).thenReturn(book);

        mockMvc.perform(delete("/api/books/123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isbn").value("123"))
                .andExpect(jsonPath("$.title").value("Spring in Action"));
    }

    @WithMockUser(authorities = "ADMIN")
    @Test
    void deleteBook_notFound_returns404() throws Exception {
        when(bookService.validateAndGetBook("000")).thenThrow(new BookNotFoundException("Book with isbn 000 not found"));

        mockMvc.perform(delete("/api/books/000"))
                .andExpect(status().isNotFound());
    }

    @WithMockUser(authorities = "USER")
    @Test
    void deleteBook_asUser_returns403() throws Exception {
        mockMvc.perform(delete("/api/books/123"))
                .andExpect(status().isForbidden());
    }
}
