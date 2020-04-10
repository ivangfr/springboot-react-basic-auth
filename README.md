# springboot-react-basic-auth

The goal of this project is to implement an application called `book-app` to manage books. For it, we will implement a back-end application called `book-api` using [`Spring Boot`](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/) framework and a font-end application called `book-ui` using [ReactJS](https://reactjs.org/). Besides, we will use [`Basic Authentication`](https://en.wikipedia.org/wiki/Basic_access_authentication) (`username` and `password`) to secure both applications.

## Applications

- **book-api**

  `Spring Boot` Web Java backend application that exposes a Rest API to manage books. Its sensitive endpoints can just be just accessed if a user is authenticated and has autorization roles for it. `book-api` stores its data in [`MySQL`](https://www.mysql.com/) database.

  `book-api` has the following endpoints

  | Endpoint                                                 | Authenticated | Roles           |
  | -------------------------------------------------------- | ------------- | --------------- |
  | `GET /public/numberOfUsers`                              | No            |                 |
  | `GET /public/numberOfBooks`                              | No            |                 |
  | `GET /api/users`                                         | Yes           | `ADMIN`         |
  | `GET /api/users/{username}`                              | Yes           | `ADMIN`         |
  | `POST /api/users {"username": "...", "password": "..."}` | Yes           | `ADMIN`         |
  | `DELETE /api/users/{username}`                           | Yes           | `ADMIN`         |
  | `GET /api/books`                                         | Yes           | `ADMIN`, `USER` |
  | `GET /api/books/{isbn}`                                  | Yes           | `ADMIN`, `USER` |
  | `POST /api/books {"isbn": "...", "title": "..."}`        | Yes           | `ADMIN`         |
  | `DELETE /api/books/{isbn}`                               | Yes           | `ADMIN`         |

- **book-ui**

  `ReactJS` frontend application where `users` can see the list of books and `admins` can manage books and users. To login, the `user` must provide valid credentials (`username` and `password`). `book-ui` communicates with `book-api` to get `books` and `users` data. It uses [`Semantic UI React`](https://react.semantic-ui.com/) as CSS-styled framework.

## Start Environment

- Open a terminal and inside `springboot-react-basic-auth` root folder run
  ```
  docker-compose up -d
  ```
  
- Wait a little bit until `mysql` container is Up (healthy). You can check their status running
  ```
  docker-compose ps
  ```

## Running book-app using Maven & Npm

- **book-api**

  - Open a terminal and navigate to `springboot-react-basic-auth/book-api` folder

  - Run the following `Maven` command to start the application
    ```
    ./mvnw clean spring-boot:run
    ```

- **book-ui**

  - Open another terminal and navigate to `springboot-react-basic-auth/book-ui` folder

  - \[Optional\] Run the command below if you are running the application for the first time
    ```
    npm install
    ```

  - Run the `npm` command below to start the application
    ```
    npm start
    ```

## Applications URLs

| Application | URL                                   | Credentials                  |
| ----------- | ------------------------------------- | ---------------------------- |
| book-api    | http://localhost:8080/swagger-ui.html | `admin/admin` or `user/user` |
| book-ui     | http://localhost:3000                 | `admin/admin` or `user/user` |

## Demo

The gif below shows ...

## Testing book-api Endpoints

- **Manual Endpoints Test using Swagger**

  - Open a browser and access http://localhost:8080/swagger-ui.html

  - In the form login that will show, login with `admin` credentials (`admin/admin`) or `user` credentials (`user/user`)

  - Make some call to the endpoints

- **Manual Endpoints Test using curl**

  In a terminal, run the following `curl` commands

  - `GET /public/numberOfBooks`
    ```
    curl -i localhost:8080/public/numberOfBooks
    ```
    It should return
    ```
    HTTP/1.1 200
    1
    ```
    
  - `GET /api/books` without credentials
    ```
    curl -i localhost:8080/api/books
    ```
    As for this endpoint you must the authenticated, it should return
    ```
    HTTP/1.1 401
    {
      "timestamp": "...",
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/api/books"
    }
    ```
    
  - `GET /api/books` with `user` credentials
    ```
    curl -i -u user:user localhost:8080/api/books
    ```
    As for this endpoint you must the authenticated, it should return
    ```
    HTTP/1.1 200
    [
      {
        "isbn": "abc",
        "title": "Spring Security"
      }
    ]
    ```
    
  - `POST /api/books` with `user` credentials
    ```
    curl -i -u user:user -X POST localhost:8080/api/books \
    -H "Content-Type: application/json" -d '{"isbn": "xyz", "title": "Spring Boot"}'
    ```
    As `user` doesn't have the role `ADMIN`, it should return
    ```
    HTTP/1.1 403
    {
      "timestamp": "...",
      "status": 403,
      "error": "Forbidden",
      "message": "Forbidden",
      "path": "/api/books"
    }
    ```
    
  - `POST /api/books` with `admin` credentials
    ```
    curl -i -u admin:admin -X POST localhost:8080/api/books \
    -H "Content-Type: application/json" -d '{"isbn": "xyz", "title": "Spring Boot"}'
    ```
    It should return
    ```
    HTTP/1.1 201
    {
      "isbn": "xyz",
      "title": "Spring Boot"
    }
    ```

- **Automatic Endpoints Test**

  - Open a terminal and make sure you are in `springboot-react-basic-auth` root folder
  
  - Run the following script
    ```
    ./book-api/test-endpoints.sh
    ```
    It should return something like the output below, where it shows the http code for different requests 
    ```
                     Endoints | without creds |  user creds |  admin creds |
    ------------------------- + ------------- + ----------- + ------------ |
     GET public/numberOfUsers |           200 |         200 |          200 |
     GET public/numberOfBooks |           200 |         200 |          200 |
    ......................... + ............. + ........... + ............ |
               GET /api/users |           401 |         403 |          200 |
          GET /api/users/user |           401 |         403 |          200 |
              POST /api/users |           401 |         403 |          201 |
            DELETE /api/users |           401 |         403 |          200 |
    ......................... + ............. + ........... + ............ |
               GET /api/books |           401 |         200 |          200 |
           GET /api/books/abc |           401 |         200 |          200 |
              POST /api/books |           401 |         403 |          201 |
        DELETE /api/books/def |           401 |         403 |          200 |
    ------------------------------------------------------------------------
     [200] Success -  [201] Created -  [401] Unauthorized -  [403] Forbidden
    ```

## Util Commands

- **MySQL**
  ```
  docker exec -it mysql mysql -uroot -psecret --database=bookdb
  show tables;
  ```

## Shutdown

- Go to `book-api` and `book-ui` terminals and press `Ctrl+C` on each one

- To stop and remove docker-compose containers, networks and volumes, run the command below in `springboot-react-basic-auth` root folder
  ```
  docker-compose down -v
  ```

## How to upgrade book-ui dependencies to latest version

- In a terminal, make sure you are in `springboot-react-basic-auth/book-ui` folder

- Run the following commands
  ```
  npm i -g npm-check-updates
  ncu -u
  npm install
  ```