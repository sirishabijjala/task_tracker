# 📝 Task Tracker

A full-stack Task Tracker web application built using **React.js** (frontend), **Express.js** (backend), **MySQL** (database), and **JWT authentication**.

Users can:
- Register and log in
- Create up to 4 projects
- Add, view, and track tasks under each project

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Axios, React Router
- **Backend:** Express.js, JWT, Bcrypt, MySQL2
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)

---

## 📁 Folder Structure




tasktracker/
├── backend/ # Express backend
│ └── server.js
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Signup.js
│ │ │ ├── Login.js
│ │ │ ├── Dashboard.js
│ │ │ ├── Tasks.js
│ │ │ └── Navbar.js
│ │ ├── App.js
│ │ └── index.js
└── README.md


🛠️ Create MySQL database and tables

CREATE DATABASE task_tracker;

USE task_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(100),
  country VARCHAR(100)
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  title VARCHAR(100),
  description TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);



🔐 Configure DB and JWT
In server.js, update:



const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'M@kesql#55',
  database: 'task_tracker'
});

const JWT_SECRET = 'your_jwt_secret';
🚀 Start backend server

node server.js


2️⃣ Frontend (React)

📦 Install dependencies
cd frontend
npm install
🚀 Start frontend server
npm start
Frontend runs at: http://localhost:3000


🔐 Authentication
JWT is used to protect API routes (e.g., /api/projects, /api/tasks).

Tokens are stored in localStorage.

Authorization headers are sent in each request.

📷 Screenshots
![Screenshot (121)](https://github.com/user-attachments/assets/ff61b0d7-5c3f-461b-b9f8-859623f1af87)

![Screenshot (123)](https://github.com/user-attachments/assets/fb30f890-b431-44bb-aa36-514359dfea1b)

![Screenshot (122)](https://github.com/user-attachments/assets/01ebbc76-7f9d-40a5-b4f2-7a91a7902756)

![Screenshot (124)](https://github.com/user-attachments/assets/208ade94-341c-4d5d-b3af-d86db8178298)

![Screenshot (125)](https://github.com/user-attachments/assets/f86357d2-6600-430e-b1e7-1919adb8e29b)
maximum a user can add 4 projects
![Screenshot (126)](https://github.com/user-attachments/assets/62950fe3-84e0-483d-9435-5e3efc1016f1)



✨ Features
User Signup & Login (JWT)

Create up to 4 projects per user

Add, view, and manage tasks within each project

Responsive UI
