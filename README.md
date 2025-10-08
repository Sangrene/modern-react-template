# Modern React Enterprise Template

A comprehensive React template designed to help enterprise developers transition to modern web development. This template provides enterprise-grade standards, proper architecture, and comprehensive tooling to accelerate your team's journey into contemporary web technologies.

## 🎯 How This Template Helps Your Team


This template serves as a **bridge between traditional enterprise development and modern web practices**:

- **Familiar Architecture Patterns**: Implements hexagonal architecture (Ports & Adapters) that enterprise developers will recognize from clean architecture principles
- **Type Safety**: Full TypeScript implementation provides build-time safety and better developer experience, along with Arktype for runtime type safety
- **SOLID Principles**: Code organization follows familiar SOLID principles with clear separation of concerns
- **Dependency Injection**: Uses injection patterns similar to enterprise DI containers
- **Error Handling**: Explicit error handling with `Result<T, E>` pattern for robust error management

### Learning Modern Web Development

- **Component-Based Architecture**: Learn React's component model through practical examples
- **Test-Driven Development**: Comprehensive testing setup with Vitest, following TDD practices
- **Modern Build Tools**: Experience Vite's fast development and build processes
- **State Management**: Learn MobX for reactive state management without deep diving in Redux event-driven architecture
- **Form Handling**: React Hook Form integration with validation for efficient forms
- **Internationalization**: Complete i18n setup for global applications

## 🏗️ Architecture Overview

### Hexagonal Architecture (Ports & Adapters)

This template implements **hexagonal architecture**, see [the dedicated wiki page](https://github.com/Sangrene/modern-react-template/wiki/Hexagonal-Architecture) for more informations.


### Key Architectural Principles

1. **Dependency Inversion**: Core business logic doesn't depend on external frameworks
2. **Interface Segregation**: Clear contracts between layers
3. **Single Responsibility**: Each module has one reason to change
4. **Open/Closed**: Easy to extend without modifying existing code

### Project Structure

```
src/
├── shared/                    # Shared infrastructure
│   ├── app/                  # Application core
│   ├── httpClient/           # HTTP abstraction
│   ├── persistentKvStore/    # Storage abstraction
│   └── schema/               # Validation utilities
├── user/                     # User domain
│   ├── features/             # Use cases
│   ├── tests/                # Test doubles
│   ├── ui/                   # React components
│   ├── user.core.ts          # Domain logic
│   ├── user.model.ts         # Domain models
│   └── user.repository.ts    # Data access interface
└── authentication/           # Auth domain
    ├── oauth/                # OAuth implementation
    └── ui/                   # Auth components
```

## 🧪 Test-Driven Development (TDD)

### Testing Philosophy

- **Core-First Testing**: `.core.ts` files are tested in isolation with in-memory mokes, ensuring that whole features are tested without dependencies on implementation details
- **Dependency Injection**: All dependencies are mocked for pure unit tests
- **Red-Green-Refactor**: Tests are written before implementation
- **Comprehensive Coverage**: Every use case is thoroughly tested

### Testing Stack

- **Vitest**: Fast, modern testing framework
- **Happy DOM**: Lightweight DOM implementation for testing
- **Fake Implementations**: Complete test doubles for all external dependencies

### Example Test Structure

```typescript
describe("UserCore", () => {
  let userStore: UserStore;
  let userRepository: ReturnType<typeof createFakeUserRepository>;
  let userCore: ReturnType<typeof createUserCore>;

  beforeEach(() => {
    // Arrange: Setup test dependencies
    userStore = new UserStore();
    userRepository = createFakeUserRepository();
    userCore = createUserCore({ userStore, userRepository });
  });

  it("should set the correct state when request succeeds", async () => {
    // Act & Assert: Test the behavior
    const result = await userCore.queryCurrentUser();
    expect(result.isOk()).toBe(true);
  });
});
```

## 🔐 Authentication & Security

### OAuth2 OpenID Connect Implementation

- **Complete OAuth2 Flow**: Authorization code flow
- **Token Management**: Automatic refresh token handling
- **Secure Storage**: Encrypted token storage with expiration
- **State Validation**: CSRF protection through state parameter
- **Environment Separation**: Server/client environment variable management

### Security Features

- **CSP Headers**: Content Security Policy implementation
- **Cookie Security**: HttpOnly, Secure, SameSite cookie settings
- **Input Validation**: Schema-based validation using ArkType
- **Error Boundaries**: Graceful error handling without information leakage

## 🌍 Internationalization (i18n)

- **React i18next**: Industry-standard i18n solution
- **Server-Side Rendering**: Full SSR support for i18n
- **Language Detection**: Automatic browser language detection
- **Namespace Management**: Organized translation files

## 🚀 Features

- 🔐 **OAuth2 OpenID Connect Authentication** - Production-ready auth flow
- 🌍 **Internationalization** - Complete i18n setup with SSR support
- 🛡️ **Security Standards** - CSP, secure cookies, input validation
- 🧪 **Test-Driven Development** - Comprehensive testing with TDD practices
- 🏗️ **Hexagonal Architecture** - Clean, maintainable, testable code structure
- 📐 **SOLID Principles** - Well-organized, extensible codebase
- 🔧 **Environment Management** - Secure server/client environment separation
- ⚠️ **Explicit Error Handling** - Result-based error handling throughout
- 📝 **Logging & Telemetry** - OpenTelemetry integration for observability
- 🎨 **Component Library** - Storybook integration for component development
- 🔄 **State Management** - MobX for reactive state management
- 📱 **Responsive Design** - Tailwind CSS for modern, responsive UIs

## 🛠️ Technology Stack

### Core Technologies
- **Frontend Library**: React 19 (latest)
- **Language**: TypeScript 
- **Build Tool**: Vite
- **State Management**: MobX
- **Error Handling**: neverthrow (Result-based error handling)
- **Validation**: ArkType (runtime type validation)

### Development Tools
- **Testing**: Vitest (fast unit testing)
- **Component Development**: Storybook 9 (isolated component development)
- **Code Quality**: Husky (git hooks), Knip (unused code detection)
- **Package Manager**: Yarn 4 (fast, reliable dependency management)
- **Containerization**: Docker (consistent deployment)

### React tooling
- **Routing**: React Router v7
- **Forms**: React Hook Form (performant forms)
- **Internationalization**: i18next with SSR support
- **Observability**: OpenTelemetry (distributed tracing)


## 📚 Getting Started

1. **Clone the template**:
   ```bash
   git clone <your-repo-url>
   cd react-template-app
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Configure your OAuth2 provider settings
   ```

4. **Start development**:
   ```bash
   yarn dev
   ```

5. **Run tests**:
   ```bash
   yarn test
   ```

6. **Start Storybook**:
   ```bash
   yarn storybook
   ```

## 📖 Documentation

See the [Wiki](https://github.com/Sangrene/modern-react-template/wiki) for detailed documentation on:
- Architecture patterns and best practices
- Authentication setup and configuration
- Internationalization implementation
- Deployment and production considerations

## 🤝 Contributing

This template is designed to evolve with your team's needs. Contributions are welcome, especially:
- Additional architectural patterns
- More comprehensive examples
- Integration guides for other technologies
- Performance optimizations

## 📄 License

This template is provided as-is for educational and commercial use. Feel free to adapt it to your team's specific needs.

---

**Ready to modernize your development practices?** This template provides the foundation your enterprise team needs to successfully transition to modern web development while maintaining the architectural principles you already know and trust.
