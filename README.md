# Authentication and Comment Permission Service

A backend service that handles user authentication, authorization, session management, and comment-level access control using role-based permissions.

## Features

- User authentication (register/login)
- JWT token system with access/refresh tokens
- Password reset flow
- Role-based permissions (read, write, delete)
- Comments CRUD operations with permission checks
- API documentation with Swagger

## Technologies

- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- Jest for testing

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Start MongoDB server
5. Run the app: `npm start`

## POSTMAN images

![](assets/register1.jpg)