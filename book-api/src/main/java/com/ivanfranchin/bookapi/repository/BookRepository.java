package com.ivanfranchin.bookapi.repository;

import com.ivanfranchin.bookapi.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    List<Book> findAllByOrderByTitle();

    List<Book> findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(String isbn, String title);
}
