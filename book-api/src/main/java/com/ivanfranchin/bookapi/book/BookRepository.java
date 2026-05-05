package com.ivanfranchin.bookapi.book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, String> {

  List<Book> findAllByOrderByTitle();

  List<Book> findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(String isbn, String title);
}
