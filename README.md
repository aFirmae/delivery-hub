# Delivery Hub

Delivery Hub is a full-stack application designed to facilitate delivery operations. It features a comprehensive backend API, a mobile application for end-users, and a robust database schema. This project also serves as a demonstration of Quality Assurance (QA) practices with included test artifacts.

## Features

### Mobile Application
-   **Authentication**: Secure user registration and login functionality.
-   **Order Management**:
    -   Create new delivery orders.
    -   View visual status of orders.
    -   Browse order history on the Home Screen.
    -   View detailed information for specific orders.
-   **User Interface**: Built with React Native and Expo for a smooth cross-platform experience.

### Backend API
-   **RESTful Architecture**: Built with Node.js and Express.
-   **Secure Authentication**: JSON Web Token (JWT) based authentication.
-   **Database Integration**: MySQL database integration for persistent storage.
-   **API Routes**:
    -   `/api/auth`: Handles user registration and login.
    -   `/api/orders`: Manages order creation, retrieval, and updates.

### Quality Assurance (QA)
-   **Postman Collection**: A complete collection of API requests for testing backend endpoints (`qa/postman`).
-   **Test Cases**: Documentation of test scenarios (`qa/test-cases`).

## Tech Stack

-   **Backend**: Node.js, Express.js, MySQL, JWT
-   **Mobile**: React Native, Expo, React Navigation, Axios
-   **Database**: MySQL
-   **Tools**: Postman (API Testing)

## Prerequisites

Before running the project, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v14 or later)
-   [MySQL](https://www.mysql.com/)
-   [Expo Go](https://expo.dev/client) app on your mobile device (or an emulator)

## Installation & Setup

### 1. Database Setup
1.  Navigate to the database directory: `cd backend/db`
2.  Login to your MySQL server.
3.  Run the `schema.sql` script to create the database and tables:
    ```sql
    source schema.sql;
    ```
    *(Alternatively, copy the contents of `schema.sql` and execute them in your preferred SQL client).*
4.  Update the database configuration in `backend/db/db.js` or `backend/.env` with your credentials.

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    -   Ensure the `.env` file contains the necessary DB credentials and JWT secret.
4.  Start the server:
    ```bash
    node server.js
    ```
    The server typically runs on port 3000 (check `server.js` to confirm).

### 3. Mobile App Setup
1.  Navigate to the mobile directory:
    ```bash
    cd mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npx expo start
    ```
4.  Scan the QR code with the Expo Go app (Android/iOS) or press `a` for Android Emulator / `i` for iOS Simulator.

## API Documentation

The project includes a Postman collection located at:
`qa/postman/Delivery-Hub-Collection.json`

Import this file into Postman to explore and test the available API endpoints.
