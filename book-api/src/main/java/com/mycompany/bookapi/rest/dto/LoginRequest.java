package com.mycompany.bookapi.rest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @ApiModelProperty(example = "user3")
    @NotBlank
    private String username;

    @ApiModelProperty(position = 1, example = "user3")
    @NotBlank
    private String password;

}
