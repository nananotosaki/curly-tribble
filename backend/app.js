const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from Express!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); 