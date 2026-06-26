# Smart Placement Management System - Backend Server

This directory contains the Node.js / Express backend server APIs for the Smart Campus Placement Management System (SPMS), built with MongoDB and Mongoose.

## 🛠️ Tech Stack
- **Node.js & Express** (HTTP server and REST API routes)
- **MongoDB & Mongoose** (NoSQL database and validation schemas)
- **JWT (JSON Web Tokens)** (Session authentication)
- **Bcrypt.js** (Secure salted password hashing)
- **Multer** (Multipart file upload middleware)

## 🏃 Quick Start

1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Customize the environment keys:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/placement_management
     JWT_SECRET=your_jwt_secret_key_here
     ```
3. Run the application:
   ```bash
   # Start in production mode
   npm start

   # Start in development mode with nodemon reload
   npm run dev
   ```

*Note: The server includes an automatic seeder (`utils/seedData.js`) that populates initial collections with mock placement data and a default Admin credentials account on the first launch if the database is empty.*

For full project details and deployment, refer to the [Root README](../README.md).
