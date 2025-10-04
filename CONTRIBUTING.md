# Contributing to Seven Boson Group

Thank you for your interest in contributing to the Seven Boson Group project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

By participating in this project, you agree to maintain a professional and respectful environment. Please be considerate of others and their contributions.

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/seven-boson-group.git
   cd seven-boson-group
   ```
3. **Run setup script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Project Structure

```
seven-boson-group/
├── src/                 # Main React website
├── backend/             # Node.js API server
├── admin-panel/         # React admin interface
├── database/            # Database schema and documentation
└── e2e-tests/          # End-to-end testing
```

### Running the Development Environment

```bash
# Start all services
./start-cms.sh

# Or start individually
cd backend && npm run dev      # API server (port 5001)
cd admin-panel && npm run dev  # Admin panel (port 3001)
npm run dev                    # Main website (port 5173)
```

### Making Changes

1. **Frontend Changes** (`src/`):
   - Follow React/TypeScript best practices
   - Use Tailwind CSS for styling
   - Maintain responsive design patterns
   - Update components in `src/components/` and pages in `src/pages/`

2. **Backend Changes** (`backend/`):
   - Follow Node.js/Express patterns
   - Add route handlers in `backend/routes/`
   - Include appropriate middleware
   - Update API documentation

3. **Admin Panel Changes** (`admin-panel/`):
   - Use Material UI components
   - Follow React Hook Form patterns
   - Maintain consistent UI/UX

4. **Database Changes** (`database/`):
   - Create migration files for schema changes
   - Update `database/schema.sql`
   - Test migrations thoroughly

## Coding Standards

### TypeScript/JavaScript

- **Use TypeScript** for all new code
- **Follow ESLint rules** configured in the project
- **Use meaningful variable names** and function names
- **Add JSDoc comments** for complex functions
- **Prefer functional components** with hooks over class components

### Styling

- **Use Tailwind CSS** utility classes
- **Follow mobile-first** responsive design
- **Maintain consistent spacing** and typography
- **Use the established color scheme** (slate + amber)

### API Design

- **RESTful endpoints** with appropriate HTTP methods
- **Consistent error handling** and response formats
- **Input validation** for all endpoints
- **Proper authentication** and authorization

### Database

- **Use migrations** for schema changes
- **Include proper indexes** for performance
- **Follow PostgreSQL best practices**
- **Document schema changes**

## Testing Guidelines

### Unit Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests (if available)
npm test
```

### End-to-End Tests

```bash
cd e2e-tests
npm test
```

### Test Requirements

- **Write tests** for new features
- **Update tests** when modifying existing functionality
- **Ensure tests pass** before submitting PRs
- **Include test data** and fixtures as needed

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(api): add portfolio company endpoints
fix(admin): resolve image upload validation issue
docs(readme): update installation instructions
refactor(frontend): improve team member component structure
```

## Pull Request Process

### Before Submitting

1. **Run tests** and ensure they pass
2. **Run linting** and fix any issues
3. **Update documentation** if needed
4. **Test your changes** thoroughly
5. **Rebase your branch** on the latest main

### PR Template

When creating a pull request, include:

- **Clear description** of changes
- **Related issue numbers** (if applicable)
- **Screenshots** for UI changes
- **Testing instructions**
- **Breaking changes** (if any)

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** from at least one maintainer
5. **Merge** to main branch

## Issue Reporting

### Bug Reports

Include:
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots or error logs**

### Feature Requests

Include:
- **Clear description** of the feature
- **Use case** and justification
- **Proposed implementation** (if applicable)
- **Mockups or examples** (if UI-related)

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `good first issue`: Suitable for newcomers
- `help wanted`: Extra attention needed

## Development Tips

### VS Code Setup

Recommended extensions:
- ESLint
- Prettier
- TypeScript Importer
- Tailwind CSS IntelliSense
- PostgreSQL

### AI Coding Guidelines

This project includes AI coding instructions at `.github/copilot-instructions.md`. Please review these for consistent development patterns when using AI assistance.

### Database Development

- **Use transactions** for data consistency
- **Test migrations** on sample data
- **Backup database** before major changes
- **Use the provided scripts** in `backend/scripts/`

### Performance Considerations

- **Optimize database queries**
- **Implement proper caching**
- **Minimize bundle sizes**
- **Use lazy loading** where appropriate

## Getting Help

- **Documentation**: Check README.md and docs/ folder
- **Issues**: Search existing issues on GitHub
- **Community**: Create a discussion for questions
- **Maintainers**: Tag @maintainers for urgent issues

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Seven Boson Group! 🚀