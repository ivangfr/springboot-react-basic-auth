package com.mycompany.bookapi.mapper;

import com.mycompany.bookapi.model.Book;
import com.mycompany.bookapi.rest.dto.BookDto;
import com.mycompany.bookapi.rest.dto.CreateBookRequest;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.context.annotation.Configuration;

@Configuration
@Mapper(
  componentModel = "spring",
  unmappedTargetPolicy = ReportingPolicy.IGNORE,
  nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface BookMapper {

  Book toBook(CreateBookRequest createBookRequest);

  BookDto toBookDto(Book book);

}