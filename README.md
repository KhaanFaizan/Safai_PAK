# SafaiPak - Professional Home Services Platform

SafaiPak is a robust, full-stack digital marketplace designed to revolutionize the local service economy in Pakistan. By seamlessly connecting verified professionals with households, it modernizes how essential services—from deep cleaning to pest control—are discovered, booked, and managed.

Built with a focus on security, scalability, and user experience, SafaiPak leverages the MERN stack to deliver a responsive, real-time application for three distinct user roles: Customers, Service Providers, and Administrators.

---

## 🚀 Key Features

### 👤 Customer Experience
*   **Service Discovery:** Browse a categorized marketplace of home services (Cleaning, Pest Control, Agriculture, etc.).
*   **Seamless Booking:** Intuitive booking flow with real-time status updates (Pending -> Accepted -> Completed).
*   **Transparent Pricing:** Clear cost structures for every service listed.
*   **Profile Management:** Secure dashboard to track booking history and manage account details.

### 💼 Provider Portal
*   **Professional Dashboard:** Interactive analytics for earnings, job completion rates, and client ratings.
*   **Service Management:** Tools to create, edit, and price service offerings dynamically.
*   **Booking Control:** Accept or reject job requests in real-time.
*   **Financial Tracking:** Detailed earnings reports and transaction history.

### 🛡️ Admin Command Center
*   **Platform Oversight:** Comprehensive dashboard visualizing total users, active providers, and system health.
*   **Verification Workflow:** Rigorous approval process for new providers to ensure safety and quality.
*   **User Management:** Global search and control to manage users, including suspension capabilities for policy enforcement.

---

## 🛠️ Technical Stack

### Frontend Architecture
*   **Framework:** React 19 + Vite (High-performance SPA)
*   **Styling:** Tailwind CSS v4 (Utility-first, responsive design with custom animations)
*   **State Management:** React Context API (Auth & Theme management)
*   **Routing:** React Router v7 (Secure, role-based navigation guards)
*   **Components:** Modular UI architecture with Lucide React icons

### Backend Infrastructure
*   **Runtime:** Node.js (v20+)
*   **Framework:** Express.js (RESTful API architecture)
*   **Database:** MongoDB + Mongoose (Complex relational data modeling)
*   **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies
*   **Security:**
    *   `bcryptjs` for password hashing
    *   Strict Role-Based Access Control (RBAC) middleware
    *   CORS configuration for secure cross-origin requests

---

## 📦 Installation & Setup

Follow these steps to deploy the application locally.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Local instance or Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/KhaanFaizan/Safai_PAK.git
cd SAFAI_PAK
```

### 2. Backend Configuration
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/safaipak
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Configuration
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## 🔒 Security & Best Practices

*   **Protected Routes:** Frontend route guards prevent unauthorized access to Admin and Provider dashboards.
*   **Data Validation:** Mongoose schemas ensure data integrity for users, services, and bookings.
*   **Error Handling:** Centralized error middleware in Express for consistent API responses.
*   **Clean Architecture:** Controller-Service-Repository pattern (adapted) for maintainable backend code.

---

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

**Developed by [Faizan Khan](https://github.com/KhaanFaizan)**
