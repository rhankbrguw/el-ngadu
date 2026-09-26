# El Ngadu

Public complaint management system. PHP backend, React frontend. SQLite for storage, Bramus for routing.

---

Clone it, copy `.env.example` to `.env` in each of `server`, `client`, then install dependencies.

Server: `cd server && composer install && php -S localhost:8000 -t public` (runs on `:8000`).

Client: `cd client && npm install && npm run dev`.

Production: `npm run build && npm run preview` for the client.

---

Requires PHP 8+, Node 18+, Composer, SQLite.
