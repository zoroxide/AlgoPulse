# Project Backend

This is the backend of the project. It provides various endpoints for managing users, sheets, problems, and contests. The backend is built using Node.js and Express.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
  - [General Routes](#general-routes)
  - [Admin Routes](#admin-routes)
- [Schemas](#schemas)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the backend directory:
    ```sh
    cd backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Create a `.env` file and configure the environment variables:
    ```env
    MONGO_URI=http://localhost:27017
    PORT=3000
    SESSION_SECRET=your_secret_key
    ```

## Configuration

Ensure you have MongoDB running and configured in `src/config/database.js`.

## Endpoints

### General Routes

- **GET /api/check_role**
  - Description: Check the role of the authenticated user.
  - Response: User object with role information.

- **GET /api/users**
  - Description: Fetch all users.
  - Response: List of users.

- **GET /api/users/:id**
  - Description: Fetch a single user by ID.
  - Response: User object.

### Admin Routes

- **POST /api/admin/sheet/create**
  - Description: Create a new sheet.
  - Request Body: `{ title, difficulty, content, img }`
  - Response: Created sheet object.

- **POST /api/admin/sheet/link**
  - Description: Link problems to a sheet.
  - Request Body: `{ sheetId, problemIds }`
  - Response: Success message and updated sheet object.

- **PUT /api/admin/sheet/edit/:id**
  - Description: Update a sheet by ID.
  - Request Body: `{ title, difficulty, content, img }`
  - Response: Updated sheet object.

## Schemas

### User Schema

- **User**
  - `id`: String
  - `phone`: String
  - `name`: String
  - `cf_handle`: String
  - `username`: String
  - `email`: String
  - `isAdmin`: Boolean

### Sheet Schema

- **Sheet**
  - `title`: String
  - `difficulty`: String
  - `content`: String
  - `img`: String
  - `problems`: Array of Problem IDs

### Problem Schema

- **Problem**
  - `title`: String
  - `description`: String
  - `difficulty`: String
  - `tags`: Array of Strings

### Contest Schema

- **Contest**
  - `name`: String
  - `date`: Date
  - `problems`: Array of Problem IDs

## Error Handling

The backend uses a custom error handling middleware to handle errors and send appropriate responses.

## License

This project is licensed under the MIT License.