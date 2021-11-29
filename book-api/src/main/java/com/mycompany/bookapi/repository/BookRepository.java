package com.mycompany.bookapi.repository;

import java.util.List;

import com.mycompany.bookapi.model.Book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

  List<Book> findAllByOrderByTitle();

  List<Book> findByIsbnContainingOrTitleContainingOrderByTitle(String isbn, String title);
}
