# GIGGY - A Full-Stack Freelance Marketplace

<a href="https://giggy-9.web.app/" target="_blank">
  <img src="https://raw.githubusercontent.com/better-call-vee/giggy/main/giggy.png" alt="GIGGY Banner"/>
</a>

<p align="center">
  <a href="https://giggy-9.web.app/" target="_blank">
    <strong>View Live Demo »</strong>
  </a>
</p>

<p align="center">
  GIGGY started as a project to build a complete, full-stack freelance marketplace from the ground up. The goal was to create a seamless and intuitive platform that bridges the gap between clients needing work done and freelancers looking for their next opportunity. It's a testament to modern web development practices, featuring a responsive frontend, a robust backend, and a fantastic user experience.
</p>

---

## ✨ Key Features

GIGGY is packed with features designed for a fluid and interactive user journey.

- **🔐 Secure User Authentication:** Full sign-up, login (including Google Sign-In), and session management handled by Firebase, ensuring user data is safe.
- **📊 Dynamic User Dashboard:** A personalized hub for authenticated users, featuring:
  - **At-a-Glance Stats:** Visually appealing cards displaying key metrics like tasks created and bids placed.
  - **Recent Activity:** A real-time list of recent bids, linking directly to the tasks.
  - **Sleek Layout:** A modern two-column layout with dedicated navigation.
- **📝 Full Task Management (CRUD):** Users can create, view, update, and delete tasks they've posted.
- **💸 Interactive Bidding System:**
  - Users can place bids on tasks posted by others.
  - Built-in logic prevents users from bidding on their own tasks or placing duplicate bids.
- **🎨 Stunning & Responsive UI:**
  - Built with Tailwind CSS for a utility-first, fully responsive design.
  - **Light & Dark Mode:** A theme-toggle that persists across sessions, adapting all components for user comfort.
  - **Engaging Micro-interactions:** Subtle animations, hover effects, and a floating navbar create a modern, polished feel.
- **🔍 Advanced Sorting & Filtering:** The "Browse Tasks" page allows users to sort all open tasks by budget (ascending/descending) and visually distinguishes expired tasks.

---

## 🛠️ Tech Stack & Architecture

The project is built on a modern MERN-like stack, with each piece carefully chosen for its role.

### Architecture

GIGGY uses a classic client-server model. The **React frontend** is a pure Single-Page Application (SPA) deployed statically on Firebase Hosting. It communicates via a REST API with the **Node.js/Express backend**, which runs as a serverless function on Vercel for scalability and efficiency. **MongoDB Atlas** serves as the cloud-hosted NoSQL database.

### Frontend

| Technology       | Version   | Description                                                         |
| :--------------- | :-------- | :------------------------------------------------------------------ |
| **React**        | `^19.1.0` | The core UI library for building components.                        |
| **Vite**         | `^6.3.5`  | Next-generation frontend tooling for a blazing-fast dev experience. |
| **React Router** | `^7.6.0`  | For client-side routing and navigation.                             |
| **Tailwind CSS** | `^4.1.7`  | A utility-first CSS framework for rapid and custom UI design.       |
| **Firebase**     | `^11.7.3` | Handles all user authentication and session management.             |
| **React Icons**  | `^5.5.0`  | Provides a vast library of high-quality SVG icons.                  |
| **SweetAlert2**  | `^0.5.2`  | For creating beautiful, responsive, and accessible alert modals.    |

### Backend

| Technology          | Version    | Description                                                        |
| :------------------ | :--------- | :----------------------------------------------------------------- |
| **Node.js**         | `v20.x`    | JavaScript runtime for the server.                                 |
| **Express**         | `^5.1.0`   | Fast, unopinionated, minimalist web framework for Node.js.         |
| **MongoDB**         | `(Driver)` | The database driver for interacting with our NoSQL database.       |
| **CORS**            | `^2.8.5`   | Middleware to enable Cross-Origin Resource Sharing.                |
| **Dotenv**          | `^16.5.0`  | Manages environment variables for configuration and secrets.       |
| **Serverless-Http** | `^3.2.0`   | Allows an existing Express app to run in a serverless environment. |

---

## 🚀 Getting Started

To get a local copy up and running, please follow these steps.

### Prerequisites

- Node.js (v18 or later) and npm installed.
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
- A free [Firebase](https://firebase.google.com/) project with **Email/Password** and **Google** sign-in methods enabled.

### 1. Set Up the Backend (`server` directory)

```bash
git clone [https://github.com/better-call-vee/giggy.git](https://github.com/better-call-vee/giggy.git)
cd giggy/server

npm install

touch .env
```
