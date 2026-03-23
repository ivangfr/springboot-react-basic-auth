# AGENTS.md — Codebase Guide for AI Coding Agents

## Project Overview

Full-stack application with:
- **Backend**: `book-api/` — Spring Boot 4.0.3, Java 25, PostgreSQL, HTTP Basic Auth, stateless REST API
- **Frontend**: `book-ui/` — React 19, plain JavaScript (no TypeScript), Axios, Mantine v8

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
./book-api/test-endpoints.sh
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

# Run a single test file
npm test -- src/components/admin/AdminPage.test.jsx

# Run tests matching a name pattern
npm test -- -t "test description"

# Lint source files
npm run lint

# Lint and auto-fix safe issues
npm run lint -- --fix
```

> ESLint is configured via `eslint.config.js` (flat config) using `@eslint/js` recommended as a base,
> plus `eslint-plugin-react` and `eslint-plugin-react-hooks`. No Prettier config exists.

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
- **Entities**: Plain classes with Lombok annotations. `@Data` and `@NoArgsConstructor` are used on all entities; `@AllArgsConstructor` is added when all fields are needed in the constructor (e.g., `Book`). Entities that require a partial or custom constructor (e.g., `User`) use a hand-written constructor instead of `@AllArgsConstructor`. Use `@Slf4j` for logging where needed (e.g., `DatabaseInitializer`).
- **No `var`**: Avoid `var`; prefer explicit types for clarity.
- **Import ordering** (blank line between each group):
  1. Project-internal (`com.ivanfranchin.*`)
  2. Third-party libraries (`io.swagger.*`, `jakarta.*`, `lombok.*`)
  3. Spring Framework (`org.springframework.*`)
  4. Java standard library (`java.*`)
  5. Static imports last (after a blank line)
- **Validation**: Use Bean Validation annotations (`@NotBlank`, `@Email`) on record components and activate with `@Valid` on controller parameters.
- **Controllers**: Return plain domain objects or records where possible. Use `ResponseEntity` only when the HTTP status must be conditional at runtime.

### JavaScript (Frontend)

- **Language**: Plain JavaScript (ES2020+). No TypeScript.
- **File extensions**: React components use `.jsx`; non-component JS files (utilities, constants, config) use `.js`.
- **Indentation**: 2 spaces.
- **Quotes**: Single quotes for all strings and imports.
- **Semicolons**: None — the codebase uses a no-semicolon style consistently.
- **Components**: Functional components only. No class components.
- **Import ordering** (no blank-line separation enforced, but follow this order):
  1. React and react-* packages (`react`, `react-router-dom`)
  2. Third-party UI library (`@mantine/core`, `@tabler/icons-react`)
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
| Component files | `PascalCase.jsx` | `AdminPage.jsx`, `BookTable.jsx`, `PrivateRoute.jsx` |
| Utility/service files | `PascalCase.js` | `BookApi.js`, `Helpers.js` |
| Context files | `PascalCase` + `Context.jsx` | `AuthContext.jsx` |
| Component functions | `PascalCase` | `function AdminPage()` |
| Event handlers | `camelCase`, `handle` prefix | `handleSubmit`, `handleDeleteBook` |
| Boolean state/vars | `camelCase`, `is`/`has` prefix | `isAdmin`, `isError`, `isBooksLoading` |
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
- Wrap data-fetching async calls in `try/catch/finally`; reset loading state in `finally`. For delete handlers, set loading to `true` before the call and reset it to `false` in the `catch` block only — the chained `handleGet*` call resets it via its own `finally` on the happy path.
- Represent UI error state as a boolean `isError` (and optionally `errorMessage`) rendered via a Mantine `<Alert>` component.
- Inspect `error.response.data.status` for specific HTTP codes (e.g., `409` conflict, `400` validation) to display targeted error messages.

---

## Testing Patterns

### Backend (JUnit 5 + Spring Boot Test)

- Test classes live in `src/test/java/` mirroring the main package structure.
- Use `@SpringBootTest` for integration tests that require the full application context.
- Use `@Disabled` only temporarily; remove the annotation once a test is properly implemented.
- Prefer `MockMvc` with `@WebMvcTest(SomeController.class)` for controller-layer slice tests; use Mockito (`@ExtendWith(MockitoExtension.class)`) for unit tests of services.
- **Spring Boot 4 package changes**: `@WebMvcTest` is now imported from `org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest` (not the Boot 3 path `org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest`).
- Always pair `@WebMvcTest` with `@Import(SecurityConfig.class)` so the security filter chain is loaded in the slice context.
- Use `@MockitoBean` (Spring Boot 4 / `org.springframework.test.context.bean.override.mockito.MockitoBean`) to inject mocks into the Spring context — **not** `@MockBean` (Spring Boot 3, removed in Spring Boot 4).
- When a controller injects `@AuthenticationPrincipal CustomUserDetails`, the generic `@WithMockUser` is insufficient — define a custom `@WithSecurityContext` annotation and factory to populate a real `CustomUserDetails` principal in the security context.
- Available test libraries: JUnit 5, Mockito, AssertJ, MockMvc, `spring-security-test`.

### Frontend (Vitest + React Testing Library)

- Test files should be co-located with their components: `ComponentName.test.jsx` for components, `UtilityName.test.js` for plain JS utilities.
- **Import `render` from `../../test-utils`** (not directly from `@testing-library/react`) for any component that uses Mantine, routing, or auth context. `test-utils.jsx` exports `renderWithProviders` aliased as `render`, which wraps the component under `MantineProvider`, `MemoryRouter`, and `AuthProvider`. Justified exceptions: tests that exercise the providers themselves (e.g., `AuthContext.test.jsx`) or components that require a custom parent wrapper not provided by `test-utils` (e.g., `Navbar.test.jsx`) may import directly from `@testing-library/react`.
- Use `screen`, `fireEvent`, and `@testing-library/user-event` from `@testing-library/react` / `@testing-library/user-event` for querying and interacting with the DOM.
- Vitest globals (`describe`, `it`, `expect`, `beforeEach`, `vi`) are enabled project-wide via `vite.config.js` — no imports needed.
- Mock the entire `BookApi` module with `vi.mock('../misc/BookApi')`, then set per-test return values with `.mockResolvedValue()` / `.mockRejectedValue()`.
- Jest-dom matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.) are globally extended in `setupTests.js` — use them directly in `expect()`.
- `setupTests.js` also mocks `window.matchMedia` (required by Mantine) and replaces `window.localStorage` with an in-memory implementation to work around jsdom limitations.
