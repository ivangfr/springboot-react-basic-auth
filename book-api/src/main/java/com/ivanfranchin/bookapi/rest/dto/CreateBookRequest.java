package com.ivanfranchin.bookapi.rest.dto;

import jakarta.validation.constraints.NotBlank;

import com.ivanfranchin.bookapi.book.Book;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateBookRequest(
    @Schema(example = "9781849518260") @NotBlank String isbn,
    @Schema(example = "Spring Security 3.1") @NotBlank String title) {

  public Book toDomain() {
    return new Book(isbn(), title());
  }
}
