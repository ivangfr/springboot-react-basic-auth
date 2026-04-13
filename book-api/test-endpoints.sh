#!/usr/bin/env bash
set -euo pipefail

for cmd in curl; do
  if ! command -v "${cmd}" > /dev/null 2>&1; then
    printf 'error: %s is required but not found in PATH.\n' "${cmd}" >&2
    exit 1
  fi
done

BASE_URL="${BASE_URL:-http://localhost:8080}"

if ! curl -sf --max-time 3 "${BASE_URL}/public/numberOfUsers" > /dev/null 2>&1; then
  printf 'error: Cannot reach %s — is the book-api running?\n' "${BASE_URL}" >&2
  exit 1
fi

declare -A public_number_of_users
declare -A public_number_of_books

declare -A user_get_me
declare -A user_get_users
declare -A user_get_user
declare -A user_delete_user

declare -A book_get_books
declare -A book_create_book
declare -A book_delete_book


ADMIN_AUTH_RESP=$(curl -s -X POST "${BASE_URL}/auth/authenticate" -H 'Content-Type: application/json' -d '{"username": "admin", "password": "admin"}')
USER_AUTH_RESP=$(curl -s -X POST "${BASE_URL}/auth/authenticate" -H 'Content-Type: application/json' -d '{"username": "user", "password": "user"}')

# Ensure user2 does not exist before signup so the script is idempotent on re-runs
existing_user2=$(curl -s -o /dev/null -w '%{http_code}' -u admin:admin "${BASE_URL}/api/users/user2")
if [[ "${existing_user2}" == "200" ]]; then
  curl -s -o /dev/null -X DELETE -u admin:admin "${BASE_URL}/api/users/user2"
fi

USER2_AUTH_RESP=$(curl -s -X POST "${BASE_URL}/auth/signup" -H 'Content-Type: application/json' -d '{"username": "user2", "password": "user2", "name": "User2", "email": "user2@mycompany.com"}')

public_number_of_users[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null "${BASE_URL}/public/numberOfUsers")
public_number_of_users[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user "${BASE_URL}/public/numberOfUsers")
public_number_of_users[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin "${BASE_URL}/public/numberOfUsers")

public_number_of_books[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null "${BASE_URL}/public/numberOfBooks")
public_number_of_books[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user "${BASE_URL}/public/numberOfBooks")
public_number_of_books[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin "${BASE_URL}/public/numberOfBooks")

user_get_me[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null "${BASE_URL}/api/users/me")
user_get_me[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user "${BASE_URL}/api/users/me")
user_get_me[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin "${BASE_URL}/api/users/me")

user_get_users[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null "${BASE_URL}/api/users")
user_get_users[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user "${BASE_URL}/api/users")
user_get_users[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin "${BASE_URL}/api/users")

user_get_user[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null "${BASE_URL}/api/users/user")
user_get_user[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user "${BASE_URL}/api/users/user")
user_get_user[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin "${BASE_URL}/api/users/user")

user_delete_user[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null -X DELETE "${BASE_URL}/api/users/user2")
user_delete_user[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user -X DELETE "${BASE_URL}/api/users/user2")
user_delete_user[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin -X DELETE "${BASE_URL}/api/users/user2")

book_get_books[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null "${BASE_URL}/api/books")
book_get_books[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user "${BASE_URL}/api/books")
book_get_books[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin "${BASE_URL}/api/books")

book_create_book[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null -X POST "${BASE_URL}/api/books" -H "Content-Type: application/json" -d '{"isbn": "abc", "title": "java 8"}')
book_create_book[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user -X POST "${BASE_URL}/api/books" -H "Content-Type: application/json" -d '{"isbn": "abc", "title": "java 8"}')
book_create_book[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin -X POST "${BASE_URL}/api/books" -H "Content-Type: application/json" -d '{"isbn": "abc", "title": "java 8"}')

book_delete_book[without_creds]=$(curl -w '%{http_code}' -s -o /dev/null -X DELETE "${BASE_URL}/api/books/abc")
book_delete_book[user_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u user:user -X DELETE "${BASE_URL}/api/books/abc")
book_delete_book[admin_creds]=$(curl -w '%{http_code}' -s -o /dev/null -u admin:admin -X DELETE "${BASE_URL}/api/books/abc")

printf "\n"
printf "%s\n" "POST auth/authenticate"
printf "%s\n" "======================"
printf "%s\n" "admin Auth Resp: ${ADMIN_AUTH_RESP}"
printf "\n"
printf "%s\n" "POST auth/authenticate"
printf "%s\n" "======================"
printf "%s\n" "user Auth Resp: ${USER_AUTH_RESP}"
printf "\n"
printf "%s\n" "POST auth/signup"
printf "%s\n" "================"
printf "%s\n" "user2 Auth Resp: ${USER2_AUTH_RESP}"
printf "\n"
printf "%s\n" "Authorization"
printf "%s\n" "============="
printf "%25s | %13s | %11s | %12s |\n" "Endpoints" "without creds" "user creds" "admin creds"
printf "%25s + %13s + %11s + %12s |\n" "-------------------------" "-------------" "-----------" "------------"
printf "%25s | %13s | %11s | %12s |\n" "GET public/numberOfUsers" "${public_number_of_users[without_creds]}" "${public_number_of_users[user_creds]}" "${public_number_of_users[admin_creds]}"
printf "%25s | %13s | %11s | %12s |\n" "GET public/numberOfBooks" "${public_number_of_books[without_creds]}" "${public_number_of_books[user_creds]}" "${public_number_of_books[admin_creds]}"
printf "%25s + %13s + %11s + %12s |\n" "........................." "............." "..........." "............"
printf "%25s | %13s | %11s | %12s |\n" "GET /api/users/me" "${user_get_me[without_creds]}" "${user_get_me[user_creds]}" "${user_get_me[admin_creds]}"
printf "%25s | %13s | %11s | %12s |\n" "GET /api/users" "${user_get_users[without_creds]}" "${user_get_users[user_creds]}" "${user_get_users[admin_creds]}"
printf "%25s | %13s | %11s | %12s |\n" "GET /api/users/user2" "${user_get_user[without_creds]}" "${user_get_user[user_creds]}" "${user_get_user[admin_creds]}"
printf "%25s | %13s | %11s | %12s |\n" "DELETE /api/users/user2" "${user_delete_user[without_creds]}" "${user_delete_user[user_creds]}" "${user_delete_user[admin_creds]}"
printf "%25s + %13s + %11s + %12s |\n" "........................." "............." "..........." "............"
printf "%25s | %13s | %11s | %12s |\n" "GET /api/books" "${book_get_books[without_creds]}" "${book_get_books[user_creds]}" "${book_get_books[admin_creds]}"
printf "%25s | %13s | %11s | %12s |\n" "POST /api/books" "${book_create_book[without_creds]}" "${book_create_book[user_creds]}" "${book_create_book[admin_creds]}"
printf "%25s | %13s | %11s | %12s |\n" "DELETE /api/books/abc" "${book_delete_book[without_creds]}" "${book_delete_book[user_creds]}" "${book_delete_book[admin_creds]}"
printf "%72s\n" "------------------------------------------------------------------------"
printf " [200] Success -  [201] Created -  [204] No Content -  [401] Unauthorized -  [403] Forbidden"
printf "\n"
