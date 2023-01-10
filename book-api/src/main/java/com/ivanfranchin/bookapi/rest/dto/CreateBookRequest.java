package com.ivanfranchin.bookapi.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBookRequest {

    @Schema(example = "9781849518260")
    @NotBlank
    private String isbn;

    @Schema(example = "Spring Security 3.1")
    @NotBlank
    private String title;
}
