package com.mycompany.bookapi.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id
    private String isbn;

    private String title;

    public Book(String isbn, String title) {
        this.isbn = isbn;
        this.title = title;
    }
}
