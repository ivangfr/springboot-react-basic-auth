# AGENTS.md — Codebase Guide for AI Coding Agents

## Project Overview

Full-stack application with:
- **Backend**: `book-api/` — Spring Boot 4.x, Java 25, PostgreSQL, HTTP Basic Auth, stateless REST API
- **Frontend**: `book-ui/` — React 19, plain JavaScript (no TypeScript), Axios, Mantine

---

## Repository Structure

```
springboot-react-basic-auth/
├── book-api/                  # Spring Boot backend
│   ├── mvnw                   # Maven wrapper (use this, not system mvn)
│   ├── pom.xml
│   ├── test-endpoints.sh      # Manual curl-based integration smoke test
│   └── src/
│       ├── main/java/com/ivanfranchin/bookapi/
│       │   ├── book/          # Entity, Repository, Service, Exception
│       │   ├── user/          # Entity, Repository, Service, Exceptions
│       │   ├── rest/          # Controllers (Auth, Book, User, Public)
│       │   │   └── dto/       # Java records: request/response DTOs
│       │   ├── security/      # SecurityConfig, CorsConfig, CustomUserDetails
│       │   ├── config/        # SwaggerConfig, ErrorAttributesConfig
│       │   └── runner/        # DatabaseInitializer (seeds data on startup)
│       └── test/
└── book-ui/                   # React frontend
    ├── package.json
    └── src/
        ├── components/
        │   ├── admin/         # AdminPage, BookForm, BookTable, UserTable
        │   ├── context/       # AuthContext (React Context + localStorage)
        │   ├── home/          # Home, Login, Signup
        │   ├── misc/          # BookApi (axios), Helpers, Navbar, PrivateRoute
        │   └── user/          # UserPage, BookList
        └── Constants.js       # API base URL config
```

---

## Build, Lint, and Test Commands

### Backend (`book-api/`)

```bash
# Run the application (requires PostgreSQL running via docker compose)
./mvnw clean spring-boot:run

# Build a JAR
./mvnw clean package

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=BookApiApplicationTests

# Run a single test method
./mvnw test -Dtest=BookApiApplicationTests#contextLoads

# Run tests matching a pattern
./mvnw test -Dtest="BookApi*"

# Manual integration test (requires running app + DB)
./test-endpoints.sh
```

> There is no Checkstyle or linting plugin configured. No lint command exists.

### Frontend (`book-ui/`)

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Production build
npm run build

# Run all tests (non-interactive, single pass)
npm test

# Run in watch mode
npm run test:watch

# Run a single test file
npm test -- src/components/admin/AdminPage.test.js

# Run tests matching a name pattern
npm test -- -t "test description"
```

> No separate ESLint or Prettier scripts exist. ESLint is configured via `eslint.config.js`
> (flat config) using `eslint-plugin-react` and `eslint-plugin-react-hooks`.

### Infrastructure

```bash
# Start PostgreSQL (required before running backend)
docker compose up -d
```

---

## Code Style Guidelines

### Java (Backend)

- **Java version**: 25. Use modern Java features appropriately.
- **Indentation**: 4 spaces.
- **DTOs**: Use Java `record` types for all request and response DTOs. Never use mutable classes for DTOs.
- **Entities**: Plain classes with Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`). Use `@Slf4j` for logging.
- **No `var`**: Avoid `var`; prefer explicit types for clarity.
- **Import ordering** (blank line between each group):
  1. Project-internal (`com.ivanfranchin.*`)
  2. Third-party libraries (`io.swagger.*`, `jakarta.*`, `lombok.*`)
  3. Spring Framework (`org.springframework.*`)
  4. Java standard library (`java.*`)
  5. Static imports last (after a blank line)
- **Validation**: Use Bean Validation annotations (`@NotBlank`, `@Email`, `@Size`) on record components and activate with `@Valid` on controller parameters.
- **Controllers**: Return plain domain objects or records where possible. Use `ResponseEntity` only when the HTTP status must be conditional at runtime.

### JavaScript (Frontend)

- **Language**: Plain JavaScript (ES2020+). No TypeScript. No JSX files use `.tsx`.
- **Indentation**: 2 spaces.
- **Quotes**: Single quotes for all strings and imports.
- **Semicolons**: None — the codebase uses a no-semicolon style consistently.
- **Components**: Functional components only. No class components.
- **Import ordering** (no blank-line separation enforced, but follow this order):
  1. React and react-* packages (`react`, `react-router-dom`)
  2. Third-party UI library (`@mantine/core`, `@mantine/hooks`, `@tabler/icons-react`)
  3. Internal context (`../context/AuthContext`)
  4. Internal services/utilities (`../misc/BookApi`, `../misc/Helpers`)
  5. Sibling components
- **No Prettier config** — match the existing style of the file being edited.

---

## Naming Conventions

### Java

| Artifact | Convention | Examples |
|---|---|---|
| Classes | `PascalCase` + role suffix | `BookController`, `BookServiceImpl`, `DatabaseInitializer` |
| Interfaces | `PascalCase`, no prefix/suffix | `BookService`, `UserService` |
| Records (DTOs) | `PascalCase` + `Request`/`Response`/`Dto` | `CreateBookRequest`, `BookDto`, `AuthResponse` |
| Exceptions | `PascalCase` + `Exception` | `BookNotFoundException`, `DuplicatedUserInfoException` |
| Methods | `camelCase`, verb-first | `getBooks`, `validateAndGetBook`, `hasUserWithUsername` |
| Variables | `camelCase`, descriptive nouns | `bookRepository`, `authenticatedUser` |

### JavaScript / React

| Artifact | Convention | Examples |
|---|---|---|
| Component files | `PascalCase.js` | `AdminPage.js`, `BookTable.js`, `PrivateRoute.js` |
| Utility/service files | `PascalCase.js` | `BookApi.js`, `Helpers.js` |
| Context files | `PascalCase` + `Context.js` | `AuthContext.js` |
| Component functions | `PascalCase` | `function AdminPage()` |
| Event handlers | `camelCase`, `handle` prefix | `handleSubmit`, `handleDeleteBook` |
| Boolean functions | `camelCase`, `is`/`has` prefix | `userIsAuthenticated`, `isAdmin` |
| State variables | `[value, setValue]` from `useState` | `[books, setBooks]`, `[isError, setIsError]` |
| Loading state | `is*Loading` pattern | `isBooksLoading`, `isUsersLoading` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL` |

---

## Error Handling Patterns

### Backend

- Define domain errors as `RuntimeException` subclasses annotated with `@ResponseStatus`:
  ```java
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public class BookNotFoundException extends RuntimeException { ... }
  ```
- Use `Optional.orElseThrow()` to find entities or raise domain exceptions:
  ```java
  return bookRepository.findById(isbn)
      .orElseThrow(() -> new BookNotFoundException(String.format("Book with isbn %s not found", isbn)));
  ```
- Do not add a `@ControllerAdvice` unless a new cross-cutting concern requires it. Spring Boot's default error handling is intentionally used.
- Never swallow exceptions silently in service or controller layers.

### Frontend

- Use the shared `handleLogError(error)` from `Helpers.js` in every `catch` block — never call `console.log` directly on errors.
- Wrap all async API calls in `try/catch/finally`; always reset loading state in `finally`.
- Represent UI error state as a boolean `isError` (and optionally `errorMessage`) rendered via a Mantine `<Alert>` component.
- Inspect `error.response.data.status` for specific HTTP codes (e.g., `409` conflict, `400` validation) to display targeted error messages.

---

## Testing Patterns

### Backend (JUnit 5 + Spring Boot Test)

- Test classes live in `src/test/java/` mirroring the main package structure.
- Use `@SpringBootTest` for integration tests that require the full application context.
- Use `@Disabled` only temporarily; remove the annotation once a test is properly implemented.
- Prefer `MockMvc` (via `@AutoConfigureMockMvc`) for controller-layer tests; use Mockito for unit tests of services.
- Available test starters: JUnit 5, Mockito, AssertJ, Hamcrest, MockMvc, `spring-security-test`.

### Frontend (Vitest + React Testing Library)

- Test files should be co-located with their components: `ComponentName.test.js`.
- Use `@testing-library/react` (`render`, `screen`, `fireEvent`) and `@testing-library/user-event`.
- Extend Vitest matchers by importing `@testing-library/jest-dom` (already configured in `setupTests.js`).
- Mock Axios calls rather than making real HTTP requests in unit tests.
