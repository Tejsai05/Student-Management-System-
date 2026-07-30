# Academia - Student Dashboard Project 

Welcome to the **Academia Student Dashboard** repository. This document serves as a Knowledge Transfer (KT) guide to help you understand the architecture, setup, and features of the project.

## 📌 Project Overview

Academia is a full-stack web application designed for managing student records. It allows administrators to view a student directory, register new students, execute bulk uploads, and perform batch operations such as assigning grades and class sections based on percentage scores.

The project is split into two primary modules:
1. **`demo_spring_boot_project`**: The Java/Spring Boot backend REST API.
2. **`student-frontend`**: The React/Vite frontend UI.

---

## 🏗️ Architecture & Tech Stack

### Backend (`demo_spring_boot_project`)
- **Framework**: Spring Boot 3
- **Language**: Java 21
- **Database**: H2 Database (Persistent, file-based)
- **Data Access**: Spring Data JPA
- **Key Features**:
  - Exposes RESTful endpoints at `http://localhost:8080/student`
  - Handles single inserts, bulk array inserts, deletes, and complex batch `PATCH` updates.
  - The database is configured to persist data locally in the `./data/student_db` directory instead of memory, ensuring data isn't lost between restarts.

### Frontend (`student-frontend`)
- **Framework**: React 19 (via Vite)
- **Language**: JavaScript (ES6+)
- **Networking**: Axios (for clean HTTP request handling)
- **Styling**: Custom CSS (`index.css`) with native CSS variables for Light/Dark mode.
- **Icons**: `lucide-react` (Strictly no emojis; all visual indicators use professional SVGs).
- **Key Features**:
  - Clean, professional "administrative dashboard" aesthetic.
  - Native Light/Dark theme toggle (defaults to Light mode).
  - Four main tabs: Directory (View/Search/Sort), Register, Bulk Upload, and Batch Ops.

---

## 🚀 Getting Started

### 1. Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd demo_spring_boot_project
   ```
2. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The server will start on port `8080`)*

### 2. Running the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd student-frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The UI will typically be available at `http://localhost:5173`)*

---

## 📂 Core Functionality & Workflows

- **Database Connection**: The frontend uses an Axios instance configured in `src/api.js` pointing to `http://localhost:8080/student`. 
- **Trailing Slashes**: Spring Boot 3 is strict about trailing slashes. All Axios routes are configured precisely without trailing slashes to prevent `404 Not Found` errors.
- **Batch Operations**: 
  - Administrators can batch-assign letter grades based on a minimum and maximum percentage score.
  - Administrators can batch-assign classroom sections based on a specific letter grade.
  - Administrators can perform a bulk delete of students falling within a specific percentage range.

## 🎨 Theme & UI Guidelines
- The UI defaults to **Light Mode** but remembers user preference via `localStorage` if they manually toggle to Dark Mode.
- To maintain the professional look of the dashboard, **do not introduce emojis** to the codebase. Use the `lucide-react` icon set for any new buttons, headers, or alerts. 
