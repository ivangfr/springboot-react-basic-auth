package com.mycompany.bookapi.rest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateBookDto {

    @ApiModelProperty(example = "ghi")
    @NotBlank
    private String isbn;

    @ApiModelProperty(position = 1, example = "Kafka & Zookeeper")
    @NotBlank
    private String title;

}
