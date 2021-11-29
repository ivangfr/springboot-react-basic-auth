package com.mycompany.bookapi.repository;

import com.mycompany.bookapi.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    List<Book> findAllByOrderByTitle();

    List<Book> findByIsbnContainingOrTitleContainingOrderByTitle(String isbn, String title);
}
