# springboot-react-basic-auth

The goal of this project is to implement an application called `book-app` to create and manage books. For it, we will implement a back-end application called `book-api` using [`Spring Boot`](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/) and a font-end application called `book-ui` using [ReactJS](https://reactjs.org/). Besides, we will use [`Basic Authentication`](https://en.wikipedia.org/wiki/Basic_access_authentication) to secure both applications.

## Applications

- **book-api**

  `Spring Boot` Web Java backend application that exposes a Rest API to create, retrieve and delete books. If a user has `ADMIN` role he/she can also retrieve information of other users or delete them. The application secured endpoints can just be just accessed if a user has valid credentials (`username` and `password`) and has autorization roles for it. `book-api` stores its data in [`MySQL`](https://www.mysql.com/) database.

  `book-api` has the following endpoints

  | Endpoint                                                      | Authenticated | Roles           |
  | ------------------------------------------------------------- | ------------- | --------------- |
  | `POST /auth/signup -d {"username","password","name","email"}` | No            |                 |
  | `GET /public/numberOfUsers`                                   | No            |                 |
  | `GET /public/numberOfBooks`                                   | No            |                 |
  | `GET /api/users/me`                                           | Yes           | `ADMIN`, `USER` |
  | `GET /api/users`                                              | Yes           | `ADMIN`         |
  | `GET /api/users/{username}`                                   | Yes           | `ADMIN`         |
  | `DELETE /api/users/{username}`                                | Yes           | `ADMIN`         |
  | `GET /api/books`                                              | Yes           | `ADMIN`, `USER` |
  | `GET /api/books/{isbn}`                                       | Yes           | `ADMIN`, `USER` |
  | `POST /api/books -d {"isbn","title"}`                         | Yes           | `ADMIN`         |
  | `DELETE /api/books/{isbn}`                                    | Yes           | `ADMIN`         |

- **book-ui**

  `ReactJS` frontend application where a user with role `USER` can retrieve the information of a specific book or a list of books. On the other hand, a user with role `ADMIN` as access to all secured endpoints. To login, a `user` or `admin` must provide valid `username` and `password` credentials. `book-ui` communicates with `book-api` to get `books` and `users` data. It uses [`Semantic UI React`](https://react.semantic-ui.com/) as CSS-styled framework.

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

> **Note:** the credentials shown in the table are the ones already pre-defined. You can signup new users

## Demo

The gif below shows ...

## Testing book-api Endpoints

- **Manual Endpoints Test using Swagger**

  - Open a browser and access http://localhost:8080/swagger-ui.html. All endpoints with the lock sign are secured. In order to access them, you need a valid `username` and `password` credentials.

  - Click on `Authorize` button (green one, almost on the top of the page, on the right)

  - In the `Basic authentication` form that will open, provide the `admin` credentials (`admin/admin`) or `user` ones (`user/user`). Then, click on `Authorize` and finally on `Close`

  - Make some call to the endpoints

- **Manual Endpoints Test using curl**

  - Open a terminal

  - Call `GET /public/numberOfBooks`
    ```
    curl -i localhost:8080/public/numberOfBooks
    ```
    It should return
    ```
    HTTP/1.1 200
    1
    ```
    
  - Call `GET /api/books` without credentials
    ```
    curl -i localhost:8080/api/books
    ```
    As this endpoint requires authentication, it should return
    ```
    HTTP/1.1 401
    { "timestamp": "...", "status": 401, "error": "Unauthorized", "message": "Unauthorized", "path": "/api/books" }
    ```
    
  - Call again `GET /api/books` but now with `user` credentials
    ```
    curl -i -u user:user localhost:8080/api/books
    ```
    It should return
    ```
    HTTP/1.1 200
    [ { "isbn": "abc", "title": "Spring Security" } ]
    ```
    
  - Call `POST /api/books` with `user` credentials
    ```
    curl -i -u user:user -X POST localhost:8080/api/books \
    -H "Content-Type: application/json" -d '{"isbn": "xyz", "title": "Spring Boot"}'
    ```
    As `user` doesn't have the role `ADMIN`, it should return
    ```
    HTTP/1.1 403
    { "timestamp": "...", "status": 403, "error": "Forbidden", "message": "Forbidden", "path": "/api/books" }
    ```
    
  - Call `POST /api/books` with `admin` credentials
    ```
    curl -i -u admin:admin -X POST localhost:8080/api/books \
    -H "Content-Type: application/json" -d '{"isbn": "xyz", "title": "Spring Boot"}'
    ```
    It should return
    ```
    HTTP/1.1 201
    { "isbn": "xyz", "title": "Spring Boot" }
    ```

- **Automatic Endpoints Test**

  - Open a terminal and make sure you are in `springboot-react-basic-auth` root folder
  
  - Run the following script
    ```
    ./book-api/test-endpoints.sh
    ```
    It should return something like the output below, where it shows the http code for different requests 
    ```
    POST auth/signup
    ================
    user2 Auth Resp: {"id":3}
    
    Authorization
    =============
                    Endpoints | without creds |  user creds |  admin creds |
    ------------------------- + ------------- + ----------- + ------------ |
     GET public/numberOfUsers |           200 |         200 |          200 |
     GET public/numberOfBooks |           200 |         200 |          200 |
    ......................... + ............. + ........... + ............ |
            GET /api/users/me |           401 |         200 |          200 |
               GET /api/users |           401 |         403 |          200 |
          GET /api/users/user |           401 |         403 |          200 |
       DELETE /api/users/user |           401 |         403 |          200 |
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
