# SafaiPak

SafaiPak is a comprehensive digital marketplace designed to bridge the gap between skilled service providers and households in Pakistan. Built on the robust MERN stack, this platform facilitates seamless booking of essential home services—ranging from deep cleaning to pest control—while ensuring a secure and verified environment for all users.

## Project Overview

The platform addresses the fragmentation in the local service economy by offering a centralized, easy-to-use interface. It serves three distinct user groups, each with a tailored experience:

### 1. Customers
Customers can browse a curated list of services, view transparent pricing, and book appointments with confidence. The interface supports both English and Urdu, ensuring accessibility across different demographics.
- **Service Discovery:** Easy navigation through categories like House Cleaning, Pest Control, and Agricultural Services.
- **Booking Management:** Real-time tracking of booking status and history.
- **Secure Access:** Personal dashboard for managing profiles and active requests.

### 2. Service Providers
Independent workers and small businesses use SafaiPak to expand their reach and manage their operations digitally.
- **Professional Dashboard:** A dedicated portal to view earnings, manage service listings, and respond to booking requests.
- **Performance Metrics:** Visualization of completed jobs and revenue.
- **Identity Verification:** Automated and manual verification processes to build trust with customers.

### 3. Administrators
Platform administrators maintain the integrity of the ecosystem through high-level oversight tools.
- **User Management:** Full control to view, verify, or suspend users based on platform policies.
- **Provider Verification:** A rigorous workflow to approve credentials before providers can accept bookings.
- **System Health:** Real-time statistics on total network growth and activity.

## Technical Architecture

SafaiPak is engineered for performance, scalability, and maintainability.

**Frontend Ecosystem**
- **React 19 & Vite:** Delivers a lightning-fast, reactive user interface.
- **Tailwind CSS v4:** Utilizes the latest utility-first framework for a modern, responsive design system.
- **Context API:** Manages global state for authentication and language preferences efficiently.

**Backend Infrastructure**
- **Node.js & Express:** Provides a high-throughput RESTful API layer.
- **MongoDB:** Stores complex relational data between users, services, and bookings.
- **Security:** Implements industry-standard JWT authentication and password hashing (BCrypt) to protect user data.

## Getting Started

To run this project locally for development or testing:

1.  **Prerequisites:** Ensure Node.js and MongoDB are installed on your machine.
2.  **Environment Setup:**
    - Create a `.env` file in the `backend` directory.
    - Define `PORT`, `MONGO_URI`, and `JWT_SECRET`.
3.  **Installation:**
    - Run `npm install` in both the `frontend` and `backend` directories.
4.  **Launch:**
    - Start the backend: `npm run dev` (in /backend).
    - Start the frontend: `npm run dev` (in /frontend).

## Security Measures

Reference to security is integral to our architecture. The platform enforces strict Role-Based Access Control (RBAC) to ensure that sensitive admin routes and provider data are completely inaccessible to unauthorized users. Additionally, users can be instantly suspended by administrators in response to policy violations, immediately revoking their system access.

---

*SafaiPak is committed to modernizing the service industry through reliable technology and user-centric design.*
