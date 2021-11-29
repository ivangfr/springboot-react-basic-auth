package com.mycompany.bookapi.mapper;

import com.mycompany.bookapi.model.User;
import com.mycompany.bookapi.rest.dto.UserDto;

import org.mapstruct.Mapper;
import org.springframework.context.annotation.Configuration;

@Configuration
@Mapper(componentModel = "spring")
public interface UserMapper {

  UserDto toUserDto(User user);
}