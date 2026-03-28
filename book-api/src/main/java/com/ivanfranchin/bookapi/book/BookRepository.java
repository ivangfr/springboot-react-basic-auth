package com.ivanfranchin.bookapi.book;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, String> {

    List<Book> findAllByOrderByTitle();

    List<Book> findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(String isbn, String title);
}
