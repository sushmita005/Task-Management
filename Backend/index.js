import express from 'express';
import mysql from 'mysql2';
import { Server } from 'socket.io';  // Use to create a WebSocket server.
import http from 'http';
import cors from 'cors';
import fs from "fs"
import dotenv from "dotenv";

dotenv.config()

// Create express app
const app = express();

// Setup MySQL connection
const uri = process.env.MYSQL_URI
const caCertificatePath = './ca (3).pem'

const match = uri.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)\?ssl-mode=REQUIRED/);
const config = {
  host: match[3],
  user: match[1],
  password: match[2],
  database: match[5],
  port: parseInt(match[4]),
  ssl: {
    ca: fs.readFileSync(caCertificatePath),  // CA certificate file
    // ca: caCertificatePath,
    rejectUnauthorized: true  // SSL verification is enabled
  }
};

// Creates a connection to database
const db = mysql.createConnection(config);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Exit if the database connection fails
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins or specify allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Track connected clients
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// API to fetch all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err.message);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    res.json(results);
  });
});

// API to add a new task
app.post('/tasks', (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: 'Task name and status are required' });
  }

  db.query(
    'INSERT INTO tasks (name, status) VALUES (?, ?)',
    [name, status],
    (err, result) => {
      if (err) {
        console.error('Error adding task:', err.message);
        return res.status(500).json({ error: 'Failed to add task' });
      }
      const newTask = {
        id: result.insertId,
        name,
        status,
        created_at: new Date(),
        message: "Task Added Successfully",
      };
      io.emit('taskAdded', newTask); // Emit new task event
      res.status(201).json(newTask);
    }
  );
});

// API to update a task
app.put('/tasks/:id', (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: 'Task name and status are required' });
  }

  db.query(
    'UPDATE tasks SET name = ?, status = ? WHERE id = ?',
    [name, status, req.params.id],
    (err) => {
      if (err) {
        console.error('Error updating task:', err.message);
        return res.status(500).json({ error: 'Failed to update task' });
      }
      const updatedTask = {
        id: req.params.id,
        name,
        status,
        message: "Task Updated Successfully",
      };
      io.emit('taskUpdated', updatedTask); // Emit updated task event
      res.status(200).json(updatedTask);
    }
  );
});

// API to delete a task
app.delete('/tasks/:id', (req, res) => {
  db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting task:', err.message);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    const data = {
      id: req.params.id,
      message: "Task Deleted Successfully",
    };
    io.emit('taskDeleted', data); // Emit task deletion event
    res.status(200).send(data);
  });
});

// Start the server
server.listen(5000, (err) => {
  if (err) {
    console.error('Error starting server:', err.message);
  } else {
  console.log(`Server running on https}`);
  }
});
