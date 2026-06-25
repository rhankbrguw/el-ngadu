# AGENTS.md

> Read this file before every task. The global `engineering-standards` skill applies
> to all code. This file provides project-specific context that overrides or extends it.

---

## Project

```
name    : El-Ngadu
stack   : React 19 + TypeScript + Vite + TailwindCSS 4 + PHP 8+
arch    : REST API + SPA Web App
db      : SQLite
```

## Active Stack Rules

```
stacks: [react, php]
```

## Folder Structure

```
el-ngadu/
├── client/                 # React Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI elements (shadcn)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities, constants, and validators
│   │   ├── pages/          # View components
│   │   └── services/       # API abstraction layer
│   └── index.css           # Semantic design tokens and Tailwind config
└── server/                 # PHP RESTful Backend
    ├── public/             # Entry point (index.php)
    ├── src/
    │   ├── components/     # Database and mailer services
    │   ├── constants/      # Unified string and error constants
    │   ├── controllers/    # Request handlers
    │   ├── core/           # Routing and Exception handling
    │   └── services/       # Core business logic
    └── sqlite_init.sql     # Database schema and seed data
```

## Error Code Registry

| Code               | Status | Meaning                           |
| ------------------ | ------ | --------------------------------- |
| `VALIDATION_ERROR` | 422    | Input validation failed           |
| `UNAUTHENTICATED`  | 401    | Missing or invalid token          |
| `UNAUTHORIZED`     | 403    | Insufficient permissions          |
| `NOT_FOUND`        | 404    | Resource does not exist           |
| `CONFLICT`         | 409    | Duplicate or constraint violation |
| `INTERNAL_ERROR`   | 500    | Unexpected failure                |

## Agent Constraints

Must:

- Propose approach before touching more than one file.
- Add new strings/colors to constants files before referencing them.
- Ask before installing a new dependency.
- Validate inputs at the boundary (controllers) using Zod (Frontend) / Rakit (Backend).
- Use centralized constants (`client/src/lib/` or `server/src/constants/`).

Must not:

- Create or rename folders without approval.
- Leave any TODO, placeholder, or debug output in final code.
- Write inline color values, string literals, or magic numbers.
- Exceed 150 lines per file or 30 lines per function.
