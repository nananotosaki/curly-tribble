const express = require('express');
const app = express();
const port = 3000;
const router = require('./routes/todos.js');
// Middleware to parse JSON request bodies
app.use(express.json());

// Use the todos routes
app.use('/api/v1/todo', router);

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from Express!' });
});

// Start the server after connecting to the database
require('dotenv').config();
const connectDB = require('./config/db.js');
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });
}); 