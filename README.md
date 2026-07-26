# el-ngadu

A public complaint management system.

## tech stack

- frontend: react 19, typescript, tailwind css 4, vite
- backend: php 8+, sqlite, bramus router

## local setup

1. environments
   cp server/.env.example server/.env
   cp client/.env.example client/.env

2. server
   cd server
   composer install
   php -S localhost:8000 -t public

3. client
   cd client
   npm install
   npm run dev
