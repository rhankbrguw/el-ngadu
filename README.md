<div align="center">

# El-Ngadu: Public Complaint Management System

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/PHP-RESTful_API-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

A full-stack digital governance application that streamlines complaint submission, tracking, and resolution between citizens and government institutions. Designed with strict security, performance, and accessibility standards.

</div>

---

## Key Features

- **Citizen Portal:** Submit detailed complaints with multimedia support, track case status in real-time, and receive official responses.
- **Officer Workstation:** Manage, filter, and respond to cases utilizing structured workflows and a complete audit trail.
- **Admin Dashboard:** Full system oversight, comprehensive role-based access control (RBAC), and statistical CSV/PDF data exports.
- **Modern UI/UX:** Fully responsive design with semantic light/dark modes, smooth micro-animations, and accessible components.
- **Robust Security:** JWT-based stateless authentication, OTP verification, rigorous request validation, and global exception handling.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS (v4), shadcn/ui, Radix UI, Framer Motion, React Hook Form, Zod |
| **Backend** | Native PHP 8+ (Custom MVC/RESTful Architecture), Rakit Validation, JWT Authentication |
| **Database** | SQLite (Production-ready optimized) / MySQL |

---

## Getting Started

### Prerequisites
- Node.js v18+
- PHP 8.1+
- Composer (Optional)
- Git

### 1. Database Setup
The project comes pre-configured with a zero-setup SQLite database. To initialize or reset it:
```bash
cd server
rm -f el_ngadu.sqlite
sqlite3 el_ngadu.sqlite < sqlite_init.sql
```

### 2. Backend Configuration
1. Start your PHP server pointing to the `server/public` directory. If using PHP's built-in server:
```bash
cd server/public
php -S localhost:8000
```
2. *(Optional)* Copy `server/.env.example` to `server/.env` to configure custom database/JWT secrets.

### 3. Frontend Configuration
1. Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```
2. Create a `.env` file in the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```
3. Start the development server:
```bash
npm run dev
# The app will be running at http://localhost:5173
```

---

## Project Architecture

```text
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

---

## License

Created for academic purposes. Not licensed for public or commercial use without prior authorization.
