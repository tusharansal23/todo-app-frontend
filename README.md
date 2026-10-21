# To-Do Application

A full-stack to-do app with user signup and login. Each user sees only their own to-dos.

## Features

- Sign up and log in with email and password
- Passwords hashed with bcrypt; sessions use JSON Web Tokens (JWT, 7-day expiry)
- Add, edit (double-click a title or press Edit), complete and delete to-dos
- Filter by all, active or done, and see how many are left
- To-dos are stored per user in MongoDB
- The login session survives a page refresh

## Tech stack

| Layer    | Tools                                              |
| -------- | -------------------------------------------------- |
| Frontend | React, Redux Toolkit, React Router, Vite, plain CSS |
| Backend  | Node.js, Express 4, Mongoose                       |
| Database | MongoDB (Atlas or local)                           |
| Auth     | bcryptjs, jsonwebtoken                             |

## Project structure

todo-app/
├── server/
│ ├── index.js # Express app and MongoDB connection
│ ├── middleware/auth.js # Verifies the JWT on protected routes
│ ├── models/ # User and Todo schemas
│ └── routes/ # auth.js and todos.js
└── client/
└── src/
├── api.js # fetch wrapper that adds the token
├── store.js # Redux store
├── features/ # authSlice and todosSlice
└── pages/ # AuthForm (login and signup) and Todos


## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB connection string (a free MongoDB Atlas cluster works)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env     # then fill in the values below
npm run dev
```

Environment variables (`server/.env`):

| Variable     | Description                                  |
| ------------ | -------------------------------------------- |
| `PORT`       | Port for the API (default 5000)              |
| `MONGO_URI`  | MongoDB connection string                    |
| `JWT_SECRET` | Long random string used to sign tokens       |

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. In development, Vite proxies `/api` requests to http://localhost:5000.

## API

All `/api/todos` routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint            | Body                         | Description              |
| ------ | ------------------- | ---------------------------- | ------------------------ |
| POST   | `/api/auth/signup`  | `name`, `email`, `password`  | Create an account        |
| POST   | `/api/auth/login`   | `email`, `password`          | Log in                   |
| GET    | `/api/todos`        |                              | List your to-dos         |
| POST   | `/api/todos`        | `title`                      | Create a to-do           |
| PUT    | `/api/todos/:id`    | `title` and/or `completed`   | Update a to-do           |
| DELETE | `/api/todos/:id`    |                              | Delete a to-do           |

Signup and login return `{ token, user: { id, name, email } }`.

## Security notes

- Passwords are never stored in plain text.
- Every to-do query includes the logged-in user's id, so users cannot read or change each other's data.
- Keep `.env` out of Git (it is in `.gitignore`).
- For production, set a strong `JWT_SECRET`, serve over HTTPS, and restrict CORS to your frontend's origin.

## Possible improvements

- Refresh tokens and a "forgot password" flow
- Due dates, priorities and drag-and-drop ordering
- Automated tests for the API and the Redux slices