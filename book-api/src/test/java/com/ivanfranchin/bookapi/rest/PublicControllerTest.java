package com.ivanfranchin.bookapi.rest;

import com.ivanfranchin.bookapi.book.BookService;
import com.ivanfranchin.bookapi.security.CustomUserDetailsService;
import com.ivanfranchin.bookapi.security.SecurityConfig;
import com.ivanfranchin.bookapi.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicController.class)
@Import(SecurityConfig.class)
class PublicControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @MockitoBean
    BookService bookService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @Test
    void getNumberOfUsers_noAuth_returns200() throws Exception {
        when(userService.countUsers()).thenReturn(2L);

        mockMvc.perform(get("/public/numberOfUsers"))
                .andExpect(status().isOk())
                .andExpect(content().string("2"));
    }

    @Test
    void getNumberOfBooks_noAuth_returns200() throws Exception {
        when(bookService.countBooks()).thenReturn(3L);

        mockMvc.perform(get("/public/numberOfBooks"))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));
    }
}
