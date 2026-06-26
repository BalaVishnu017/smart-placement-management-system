# Smart Campus Placement Management System (SPMS)

A comprehensive, enterprise-ready web application for managing college campus recruitment drives, student registries, job applications, interview schedules, and historical placement statistics. This system is designed to streamline operations for both college **Placement Officers (Admins)** and **Students (Candidates)**.

---

## 🚀 Key Features

### 👤 Student Features
- **Job Board**: Browse active placement drives and check eligibility criteria (e.g., CGPA, backlogs) before applying.
- **Application Tracking**: Monitor real-time status of applied jobs (Applied, Shortlisted, Interview, Selected, Rejected).
- **Resume Portal**: Upload, view, or delete PDF resumes securely (no complex or faulty third-party ATS scanners).
- **Interview Planner**: Clean schedule tabs separating **Upcoming Interviews** and **Past Interviews**.
- **Placement Status**: Self-report placement offers (company and package details) directly from the profile.
- **Password Recovery**: Secure, offline password recovery by verifying Email, Roll Number, and registered Phone Number.

### 🛡️ Administrative Features
- **Hidden Admin Access**: Discreet admin entrance hidden from student view (accessible via `/login?role=admin` or a subtle footer link) for isolated student logins.
- **Academic Batch Transition**: Advanced reset functionality that increments the academic year, deletes outdated/unplaced student accounts (and their applications/interviews) to save system storage, and archives placed students to maintain placement history and statistics.
- **Resume Downloader**: Instant download/preview of student resumes directly from the student list or job applications tables.
- **CSV Data Exports**: One-click exports of candidate registries or job application pools into Excel-friendly `.csv` spreadsheets.
- **Advanced Candidate Filters**: Filter student pools dynamically by CGPA ranges (minimum/maximum) and backlog thresholds.
- **Audit Logging**: Security-first tracking of administrative actions (e.g., profile changes, placement status updates, batch resets) with timestamps, actor details, and IP address logs.
- **Drive & Notice Management**: Create, edit, and delete companies, job openings, notification notices, and resource study guides.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Built with Vite for rapid development and clean builds. |
| **Routing** | **React Router DOM** | Handles layout nesting and client-side page routing. |
| **Icons** | **React Icons** | Premium vector icons (`fa`, `io`, `md` libraries). |
| **Backend** | **Node.js + Express** | High-performance backend API routing and middleware pipelines. |
| **Database** | **MongoDB + Mongoose** | Document-based schema design with validation rules. |
| **Authentication** | **JWT (JSON Web Tokens)** | Stateless authentication with encrypted authorization headers. |
| **File Handling** | **Multer** | Secure backend multipart file uploads (limited to PDF documents). |
| **Security** | **Bcrypt.js** | Salted hash password storage. |

---

## 📁 Repository Structure

```
smart-placements/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # Shared components (Navbar, Sidebar, ProtectedRoute, Toast)
│   │   ├── context/            # AuthContext (Authentication & session states)
│   │   ├── pages/
│   │   │   ├── admin/          # Admin panels (Dashboard, ManageStudents, AuditLogs, etc.)
│   │   │   ├── student/        # Student panels (Dashboard, ResumeUpload, Profile, etc.)
│   │   │   ├── Landing.jsx     # Main public landing page
│   │   │   ├── Login.jsx       # Unified student & admin login screen
│   │   │   ├── Register.jsx    # Enforces active batch student registration
│   │   │   └── ForgotPassword.jsx # Offline password reset page
│   │   ├── services/           # Axios central API configuration
│   │   └── App.jsx             # Route declarations
│   ├── vite.config.js          # Port proxies to express server (http://localhost:5000)
│   └── package.json
│
├── server/                     # Node/Express Backend API
│   ├── config/                 # Mongoose DB connections
│   ├── controllers/            # Controller logic for users, drives, applications, logs
│   ├── middleware/             # Role authorization & JWT decoding middlewares
│   ├── models/                 # Mongoose database models (User, Drive, Resume, AuditLog, etc.)
│   ├── routes/                 # Express API endpoints
│   ├── uploads/                # Local secure folder for student resume PDFs (with .gitkeep)
│   ├── utils/                  # Mock database seeders
│   ├── server.js               # Express entrypoint
│   └── package.json
│
└── .gitignore                  # Global gitignore ignoring env, build files, and node_modules
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed (v16.x or higher recommended)
- MongoDB installed locally on your system, or an active MongoDB Atlas cloud URI.

### 1. Setup Database & Backend Server
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   - Duplicate the `.env.example` file and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your local/Atlas credentials inside `.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/placement_management
     JWT_SECRET=your_jwt_secret_key_here
     ```
4. Start the server (includes automatic mock database seeding on first start):
   ```bash
   # Production mode
   npm start
   
   # Development mode (nodemon)
   npm run dev
   ```

### 2. Setup Frontend Client
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 Security & Best Practices
- **Strict Gitignore**: The global `.gitignore` is pre-configured to block node modules (`node_modules/`), production bundles (`dist/`), sensitive environment settings (`.env`), and student files (`server/uploads/*.pdf`) from being uploaded to public git registries.
- **Input Sanitization**: Password inputs are processed strictly through Bcrypt.js pre-save hooks on the database model.
- **Isolated Admin Routing**: Avoids standard administrative links; admin page components utilize nested protected route components that decode JWT payloads for administrative validation.

---

## 📄 License
This project is licensed under the **ISC License**.
