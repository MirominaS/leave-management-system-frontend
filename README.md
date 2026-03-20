# Leave Management System – Frontend

This repository contains the **frontend application** for the ABC Company Leave Management System.

The frontend is built using **React** and communicates with the Golang backend through REST APIs.  
It provides an interface for employees and administrators to manage leave requests.

---

# Technologies Used

- React
- JavaScript
- Tailwind CSS
- React Router
- Fetch API

---

# Project Structure

```
leave-management-system-frontend
│
├ src
│   ├ pages
│   │   ├ Dashboard.jsx
│   │   ├ Employee.jsx
│   │   ├ Login.jsx
│   │   └ LeaveRequests.jsx
│   │
│   ├ App.jsx
│   └ main.jsx
│
├ public
├ package.json
├ vite.config.js
└ README.md
```

---

# Prerequisites

Make sure the following software is installed on your system:

- Node.js (v18 or higher recommended)
- npm or yarn
- Git

Check installations:

```bash
node -v
npm -v
```

---

# Step 1 – Clone the Repository

```bash
git clone https://github.com/MirominaS/leave-management-system-frontend
cd leave-management-system-frontend
```

---

# Step 2 – Install Dependencies

Install required packages using npm.

```bash
npm install
```

---

# Step 3 – Start the Development Server

Run the following command:

```bash
npm run dev
```

The application will start at:

```
http://localhost:5173
```

---

# Backend Requirement

The frontend communicates with the backend API.  
Make sure the **backend server is running before using the application**.

Default backend server address:

```
http://localhost:3300
```

---

# Features

- Employee Management
- Leave Request Submission
- Leave Approval / Rejection (Admin)
- Dashboard Overview
- Responsive UI for desktop and mobile devices

---

# Notes

- Ensure the backend server is running before starting the frontend.
- The frontend connects to the backend using API endpoints such as:

```
/
/employees
/leave
/dashboard
/activities
```

---

# Author

Software Engineer Intern Technical Assessment  
Miromina Sritharan



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


