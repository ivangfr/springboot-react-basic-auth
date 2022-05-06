package com.mycompany.bookapi.repository;

import com.mycompany.bookapi.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    List<Book> findAllByOrderByTitle();

    // Add @Param as a workaround for https://github.com/spring-projects/spring-data-jpa/issues/2512
    // Remove them when this issue https://github.com/spring-projects/spring-data-jpa/issues/2519 is closed
    List<Book> findByIsbnContainingOrTitleContainingOrderByTitle(@Param("isbn") String isbn, @Param("title") String title);
}
