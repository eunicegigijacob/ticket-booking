# Event Booking API

## Overview

The **Event Booking API** is a backend service for managing events, bookings, and authentication. It allows users to create and manage events, book tickets, and handle authentication-related actions like signup, login, and password resets.

This project is built with **Node.js** and **Express.js**, and it uses **PostgreSQL** as the database with Prisma ORM for database interactions.

---

## Features

- **Event Management**: Create, retrieve, and manage events.
- **Booking System**: Users can book and cancel event tickets.
- **Authentication**: Signup, login, logout, and password reset functionality.
- **Middleware Security**: Routes requiring authentication are protected.
- **Health Check**: Endpoint to verify if the server is running.

---

## Installation

### Prerequisites

1. **Node.js** (v14 or higher)
2. **PostgreSQL** installed and running
3. **NPM** for dependency management

### Setup

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd event-booking-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file and add the required environment variables:
    ```sh
    DATABASE_URL=your_database_url
    REDIS_URL=your_redis_url
    JWT_SECRET=your_jwt_secret
    ```

4. Ensure your PostgreSQL database is running and matches the connection details in the `.env` file.

5. Run database migrations:
    ```sh
    npx prisma migrate dev --name init
    ```

6. Start the server:
    ```sh
    npm start
    ```

The server will run on port `3000` or the port specified in your `.env` file.

---

## API Endpoints

### Health Check
| Method | Endpoint     | Description                |
|--------|-------------|----------------------------|
| GET    | `/api/health` | Check if the server is running |

### Event Management
| Method | Endpoint                 | Description                 |
|--------|---------------------------|-----------------------------|
| GET    | `/api/event`              | Get all events              |
| POST   | `/api/event/initialize`   | Create an event (Auth required) |
| GET    | `/api/event/status/:eventId` | Get details of an event (Auth required) |

### Booking Management
| Method | Endpoint                 | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/booking`            | Get all bookings (Auth required) |
| GET    | `/api/booking/status/:bookingId` | Get details of a booking |
| POST   | `/api/booking/book`       | Create a booking            |
| PATCH  | `/api/booking/cancel`     | Cancel a booking (Auth required) |

### Authentication
| Method | Endpoint               | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | `/api/auth/signup`      | Register a new user            |
| POST   | `/api/auth/login`       | Login and receive a token      |
| POST   | `/api/auth/logout`      | Logout the user                |
| POST   | `/api/auth/reset-password` | Reset the user's password |

---

## Project Structure

```plaintext
__tests__/
  ├── e2e/
  ├── integration/
  ├── unit/
node_modules/
prisma/
src/
  ├── middleware/
  │   ├── auth.middleware.js
  │   ├── error.middleware.js
  ├── modules/
  │   ├── auth/
  │   │   ├── auth.controller.js
  │   │   ├── auth.repository.js
  │   │   ├── auth.routes.js
  │   │   ├── auth.service.js
  │   ├── bookings/
  │   │   ├── jobs/
  │   │   ├── queues/
  │   │   ├── schemas/
  │   │   ├── bookings.controller.js
  │   │   ├── bookings.repository.js
  │   │   ├── bookings.routes.js
  │   │   ├── bookings.service.js
  │   ├── events/
  │   │   ├── schema/
  │   │   │   ├── add-event.schema.js
  │   │   ├── events.controller.js
  │   │   ├── events.repository.js
  │   │   ├── events.routes.js
  │   │   ├── events.service.js
  │   ├── user/
  │   │   ├── user.controller.js
  │   │   ├── user.repository.js
  │   │   ├── user.routes.js
  │   │   ├── user.service.js
  ├── redis/
  │   ├── redis.service.js
  ├── routes/
  │   ├── index.js
  ├── app.js
  ├── prisma.js
  ├── server.js
.env
.gitignore
jest.config.js
package-lock.json
package.json
README.md
```



---

## Contact
For issues or questions, reach out to:

- **Author**: Eunice Jacob  
- **Email**: jacobeunice40@gmail.com, eunice.gigij@gmail.com  
- **GitHub**: [Eunice Jacob](https://github.com/eunicegigijacob)

