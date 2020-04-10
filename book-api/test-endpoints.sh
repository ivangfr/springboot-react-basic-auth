#!/usr/bin/env bash

declare -A public_number_of_users
declare -A public_number_of_books
declare -A user_get_users
declare -A user_get_user
declare -A user_create_user
declare -A user_delete_user
declare -A book_get_books
declare -A book_get_book
declare -A book_create_book
declare -A book_delete_book

public_number_of_users[without_creds]=$(curl -w %{http_code} -s -o /dev/null localhost:8080/public/numberOfUsers)
public_number_of_users[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user localhost:8080/public/numberOfUsers)
public_number_of_users[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin localhost:8080/public/numberOfUsers)

public_number_of_books[without_creds]=$(curl -w %{http_code} -s -o /dev/null localhost:8080/public/numberOfBooks)
public_number_of_books[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user localhost:8080/public/numberOfBooks)
public_number_of_books[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin localhost:8080/public/numberOfBooks)

user_get_users[without_creds]=$(curl -w %{http_code} -s -o /dev/null localhost:8080/api/users)
user_get_users[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user localhost:8080/api/users)
user_get_users[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin localhost:8080/api/users)

user_get_user[without_creds]=$(curl -w %{http_code} -s -o /dev/null localhost:8080/api/users/user)
user_get_user[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user localhost:8080/api/users/user)
user_get_user[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin localhost:8080/api/users/user)

user_create_user[without_creds]=$(curl -w %{http_code} -s -o /dev/null -X POST localhost:8080/api/users -H "Content-Type: application/json" -d '{"username": "user2", "password": "user2"}')
user_create_user[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user -X POST localhost:8080/api/users -H "Content-Type: application/json" -d '{"username": "user2", "password": "user2"}')
user_create_user[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin -X POST localhost:8080/api/users -H "Content-Type: application/json" -d '{"username": "user2", "password": "user2"}')

user_delete_user[without_creds]=$(curl -w %{http_code} -s -o /dev/null -X DELETE localhost:8080/api/users/user2)
user_delete_user[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user -X DELETE localhost:8080/api/users/user2)
user_delete_user[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin -X DELETE localhost:8080/api/users/user2)

book_get_books[without_creds]=$(curl -w %{http_code} -s -o /dev/null localhost:8080/api/books)
book_get_books[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user localhost:8080/api/books)
book_get_books[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin localhost:8080/api/books)

book_get_book[without_creds]=$(curl -w %{http_code} -s -o /dev/null localhost:8080/api/books/abc)
book_get_book[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user localhost:8080/api/books/abc)
book_get_book[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin localhost:8080/api/books/abc)

book_create_book[without_creds]=$(curl -w %{http_code} -s -o /dev/null -X POST localhost:8080/api/books -H "Content-Type: application/json" -d '{"isbn": "def", "title": "java 8"}')
book_create_book[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user -X POST localhost:8080/api/books -H "Content-Type: application/json" -d '{"isbn": "def", "title": "java 8"}')
book_create_book[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin -X POST localhost:8080/api/books -H "Content-Type: application/json" -d '{"isbn": "def", "title": "java 8"}')

book_delete_book[without_creds]=$(curl -w %{http_code} -s -o /dev/null -X DELETE localhost:8080/api/books/def)
book_delete_book[user_creds]=$(curl -w %{http_code} -s -o /dev/null -u user:user -X DELETE localhost:8080/api/books/def)
book_delete_book[admin_creds]=$(curl -w %{http_code} -s -o /dev/null -u admin:admin -X DELETE localhost:8080/api/books/def)

printf "\n"
printf "%25s | %13s | %11s | %12s |\n" "Endoints" "without creds" "user creds" "admin creds"
printf "%25s + %13s + %11s + %12s |\n" "-------------------------" "-------------" "-----------" "------------"
printf "%25s | %13s | %11s | %12s |\n" "GET public/numberOfUsers" ${public_number_of_users[without_creds]} ${public_number_of_users[user_creds]} ${public_number_of_users[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "GET public/numberOfBooks" ${public_number_of_users[without_creds]} ${public_number_of_users[user_creds]} ${public_number_of_users[admin_creds]}
printf "%25s + %13s + %11s + %12s |\n" "........................." "............." "..........." "............"
printf "%25s | %13s | %11s | %12s |\n" "GET /api/users" ${user_get_users[without_creds]} ${user_get_users[user_creds]} ${user_get_users[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "GET /api/users/user" ${user_get_user[without_creds]} ${user_get_user[user_creds]} ${user_get_user[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "POST /api/users" ${user_create_user[without_creds]} ${user_create_user[user_creds]} ${user_create_user[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "DELETE /api/users" ${user_delete_user[without_creds]} ${user_delete_user[user_creds]} ${user_delete_user[admin_creds]}
printf "%25s + %13s + %11s + %12s |\n" "........................." "............." "..........." "............"
printf "%25s | %13s | %11s | %12s |\n" "GET /api/books" ${book_get_books[without_creds]} ${book_get_books[user_creds]} ${book_get_books[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "GET /api/books/abc" ${book_get_book[without_creds]} ${book_get_book[user_creds]} ${book_get_book[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "POST /api/books" ${book_create_book[without_creds]} ${book_create_book[user_creds]} ${book_create_book[admin_creds]}
printf "%25s | %13s | %11s | %12s |\n" "DELETE /api/books/def" ${book_delete_book[without_creds]} ${book_delete_book[user_creds]} ${book_delete_book[admin_creds]}
printf "%72s\n" "------------------------------------------------------------------------"
printf " [200] Success -  [201] Created -  [401] Unauthorized -  [403] Forbidden"
printf "\n"