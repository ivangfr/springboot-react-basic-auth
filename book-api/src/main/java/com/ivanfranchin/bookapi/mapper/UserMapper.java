package com.ivanfranchin.bookapi.mapper;

import com.ivanfranchin.bookapi.model.User;
import com.ivanfranchin.bookapi.rest.dto.UserDto;

public interface UserMapper {

    UserDto toUserDto(User user);
}