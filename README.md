
A professional, full-stack Dashboard application built to demonstrate core full-stack capabilities, including secure authentication, role-based access control, and responsive design.

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Distinct functionalities and views for Students and Teachers using Mongoose Discriminators.
* **Comprehensive Auth System:** Secure JWT-based authentication stored in `httpOnly` cookies.
* **User Management:** Advanced Profile and Settings pages for account updates and password management.
* **Responsive Design:** Fully fluid UI optimized for Desktop, Tablet, and Mobile devices.
* **Security Hardening:** Protection against XSS and CSRF, secure cookie handling, and input normalization.

## 🛠️ Tech Stack

### Frontend
* **React.js & Vite:** Modern UI library and lightning-fast build tool.
* **Redux Toolkit:** Centralized state management for user sessions and data.
* **Tailwind CSS:** Utility-first CSS framework for custom, responsive styling.
* **Axios:** Promise-based HTTP client for API communication.

### Backend
* **Node.js & Express.js:** Scalable server-side environment and web framework.
* **MongoDB & Mongoose:** NoSQL database with advanced schema modeling (Discriminators, Population).
* **JSON Web Token (JWT):** Secure token-based authentication.
* **CORS & Helmet:** Middleware for cross-origin resource sharing and security headers.

### Deployment & DevOps
* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

## 🔒 Security Implementations

* **HTTP-Only Cookies:** Prevents client-side scripts from accessing sensitive tokens (Anti-XSS).
* **SameSite Cookie Policy:** Configured to mitigate CSRF attacks.
* **Password Hashing:** Utilizing `bcrypt` for secure credential storage.
* **Input Validation:** Strict server-side validation and email normalization.

## 📂 Project Structure

```text
├── backend/
│   ├── controllers/   # Business logic
│   ├── models/        # Mongoose schemas (Student, Teacher, Course)
│   ├── routes/        # API Endpoints
│   └── middleware/    # Auth & Security checks
└── frontend/
    ├── src/
    │   ├── pages/     # Profile, Settings, Lessons, Dashboard
    │   ├── store/     # Redux slices
    │   └── components/# Reusable UI elements
```
## 📬 Contact Me

I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.

* **Email:** [islam2010ghazy@gmail.com]
* **LinkedIn:** [www.linkedin.com/in/islam-mahmoud-abdel-hay-ghazy-3a8461385]
* **Phone:** [+20 10641186453]
