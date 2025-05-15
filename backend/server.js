const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup (replace with your actual creds)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'M@kesql#55',
  database: 'task_tracker',  // your MySQL database name
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

const JWT_SECRET = '3bafe6be77d2d5022bfbc2b6d8a565a07532ffa7e82cfa6df0313510af2241415011b87cb79d2f0750d7ffd55720c56442e71d0d7824b8a366cc31b44e764115';

// Signup route
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, country } = req.body;
  if (!name || !email || !password || !country) {
    return res.status(400).json({ msg: 'All fields required' });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error' });
    if (results.length > 0) return res.status(400).json({ msg: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (name, email, password, country) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, country],
      err => {
        if (err) return res.status(500).json({ msg: 'Insert failed' });
        res.status(201).json({ msg: 'User registered successfully' });
      }
    );
  });
});

// Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password required' });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error' });
    const user = results[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});
// Auth middleware to verify JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

// Create project route
app.post('/api/projects', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Project name required' });

  // Check number of existing projects
  db.query('SELECT COUNT(*) AS count FROM projects WHERE user_id = ?', [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error' });
    const projectCount = result[0].count;

    if (projectCount >= 4) {
      return res.status(400).json({ msg: 'Max 4 projects allowed' });
    }

    // Insert project
    db.query(
      'INSERT INTO projects (user_id, name) VALUES (?, ?)',
      [req.user.id, name],
      (err, result) => {
        if (err) return res.status(500).json({ msg: 'Insert failed' });
        res.json({ id: result.insertId, name });
      }
    );
  });
});
// POST /api/tasks - Create a new task
app.post('/api/tasks', authMiddleware, (req, res) => {
  const { project_id, title, description, status } = req.body;

  if (!project_id || !title || !status) {
    return res.status(400).json({ msg: 'project_id, title, and status are required' });
  }

  const sql = 'INSERT INTO tasks (project_id, title, description, status, created_at) VALUES (?, ?, ?, ?, NOW())';

  db.query(sql, [project_id, title, description || '', status], (err, result) => {
    if (err) {
      console.error('Task creation failed:', err);
      return res.status(500).json({ msg: 'Database error while adding task' });
    }
    res.status(201).json({ msg: 'Task added successfully', id: result.insertId });
  });
});

// GET tasks for a project
app.get('/api/tasks/:projectId', authMiddleware, (req, res) => {
  const projectId = req.params.projectId;

  const sql = 'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC';

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ msg: 'Database error fetching tasks' });
    }
    res.json(results);
  });
});
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
