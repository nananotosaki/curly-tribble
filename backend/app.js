require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");

// Middleware to parse JSON request bodies
app.use(cors({
  origin: process.env.REACT_APP, // Allow only frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Use the todo and auth routes
app.use('/api/v1/todo', require('./routes/todos.js'));
app.use('/api/v1/auth', require('./routes/auth.js'));

app.get("/", (req, res) => {
  res.json({ message: "Server active." });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;