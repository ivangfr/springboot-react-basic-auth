package com.mycompany.bookapi.rest.dto;

import lombok.Data;

@Data
public class UserDto {
  
  private Long id;
  private String username;
  private String name;
  private String email;
  private String role;
}