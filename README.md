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


**My Design Choices for This Project**

When working on this project, my main focus was on **maintainability, scalability, and performance**. I structured it in a way that makes it easy to extend, debug, and handle real-world scenarios efficiently.

1.  **Modular Structure**

    -   I organized the codebase into **clear, separate modules** to keep things structured and maintainable. Each module handles a specific responsibility, making it easy to debug and scale.
    -   This approach ensures that if a feature needs to be modified or extended in the future, it can be done without affecting unrelated parts of the system.
2.  **Authentication & Authorization**

    -   I used **JWT authentication** to securely manage user sessions. The authentication middleware verifies tokens and ensures users are authenticated before accessing protected routes.
    -   By keeping authentication logic separate, the code remains clean and reusable across different parts of the application.
3.  **Queue System for Background Processing**

    -   I implemented a **queue system** to handle tasks that don't need to be processed immediately, like sending emails, booking confirmations, and retries for failed operations.
    -   Without the queue, these tasks would slow down user interactions, making the system feel sluggish. By offloading them to a background process, the application stays **responsive and scalable**.
4.  **Error Handling & Validation**

    -   I used **Zod** for input validation, ensuring that requests have the correct structure before they hit the business logic. This helps catch issues early and provides clear error messages to the user.
    -   The centralized **error handler** ensures that errors are properly formatted and logged, making debugging easier and improving the overall user experience.
5.  **Performance & Asynchronous Processing**

    -   To keep things fast and non-blocking, I used `async/await` for database queries, API calls, and queue processing.
    -   This prevents bottlenecks and ensures the application can handle multiple requests efficiently, without blocking the main thread.
6.  **Testing & Reliability**

    -   I wrote unit tests to cover **core functionalities**, making sure everything works as expected.
    -   Mocks are used to isolate dependencies, ensuring tests focus on specific components without external interference. This improves reliability and makes refactoring safer.
7.  **Scalability & Maintainability**

    -   I designed the project with **scalability in mind**, using clean architecture principles to keep concerns separate.
    -   Configurations are handled with environment variables, making deployments across different environments (development, staging, production) smooth and hassle-free.

### Final Thoughts

This project is structured to **grow and adapt** over time. Whether it's adding new features, optimizing performance, or debugging an issue, the modular and scalable approach makes it easy to manage. I always prioritize **clarity, efficiency, and future-proofing**, and I believe this design reflects that.
---

## Contact
For issues or questions, reach out to:

- **Author**: Eunice Jacob  
- **Email**: jacobeunice40@gmail.com, eunice.gigij@gmail.com  
- **GitHub**: [Eunice Jacob](https://github.com/eunicegigijacob)

