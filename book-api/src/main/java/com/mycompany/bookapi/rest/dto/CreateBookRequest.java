package com.mycompany.bookapi.rest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateBookRequest {

    @ApiModelProperty(example = "9781849518260")
    @NotBlank
    private String isbn;

    @ApiModelProperty(position = 1, example = "Spring Security 3.1")
    @NotBlank
    private String title;

}
