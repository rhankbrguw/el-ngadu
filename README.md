<div align="center">

# El-Ngadu: Public Complaint Management System

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/PHP-RESTful_API-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Apache](https://img.shields.io/badge/Apache-Laragon-D22128?style=flat-square&logo=apache&logoColor=white)](https://laragon.org/)

A full-stack digital governance application that streamlines complaint submission, tracking, and resolution between citizens and government institutions.

</div>

---

## Features

**Citizen Portal** — Submit complaints with multimedia support, track case status, and receive official responses.

**Officer Workstation** — Manage and respond to cases with structured workflows and audit trails.

**Admin Panel** — Full system oversight, officer and citizen account management, and CSV data exports.

**General** — Role-based access control, real-time notifications, dark/light mode, and fully responsive UI.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router v6, Axios, React Hook Form + Zod |
| Backend | Native PHP (RESTful API), MySQL, Apache via Laragon |

---

## Getting Started

**Prerequisites:** Laragon or XAMPP, Node.js v18+, MySQL

### Backend

1. Place the `SERVER` folder in your web root (e.g. `C:/laragon/www/`).
2. Import `Skrip Database Final El-Ngadu` into your database tool.
3. Point your virtual host to `SERVER/public` and confirm `mod_rewrite` is enabled.

### Frontend

1. Install dependencies and configure environment:
```bash
cd CLIENT/
npm install
```
```env
VITE_API_BASE_URL=http://el-ngadu.test
```

2. Start the development server:
```bash
npm run dev
# Runs at http://el-ngadu.test:5173
```

---

## License

Created for academic purposes only. Not licensed for public or commercial use.
