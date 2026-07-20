# Contributing to SmartBloodLife

We welcome contributions to the **SmartBloodLife** healthcare network project! To ensure clean integration, please review the contribution guidelines below.

## Code Standards & Architecture

### 1. Web Application (`/web`)

- Built with **React**, **Vite**, and **TailwindCSS**.
- Keep CSS variables unified in `index.css`.
- Ensure all Firebase transactions are handled asynchronously with detailed error state feedback.

### 2. Mobile Application (`/mobile`)

- Built with **Flutter 3.x** and **Material 3**.
- State management: **Riverpod** is required. Do not introduce custom setState blocks for global parameters.
- Routing: Add paths strictly inside `AppRouter` configuration.
- Linting: Ensure `flutter analyze` returns zero warnings or errors before committing.

---

## Workflow Instructions

### 1. Branch Naming

- Features: `feature/your-feature-name`
- Bug Fixes: `bugfix/issue-description`
- Documentation: `docs/changes-summary`

### 2. Commit Guidelines

- Use descriptive commit names:
  - `feat: integrate Google Sign-in authentication`
  - `fix: resolve maps fine location access permission crash`
  - `docs: update setup steps for iOS configuration`

### 3. Submitting Pull Requests

- Ensure local tests pass (`npm run lint` for Web, `flutter test` for Mobile).
- Link open issues inside the description.
- Wait for a maintainer review before merging.
