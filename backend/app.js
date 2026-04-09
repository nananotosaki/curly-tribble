require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./config/db.js');
const cors = require("cors");

// Middleware to parse JSON request bodies
app.use(cors());
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

// Start the server after connecting to the database
// connectDB().then(() => {
//   app.listen(port, () => {
//     console.log(`app listening at http://localhost:${port}`);
//   });
// }); 
module.exports = app;