const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/authCheck');
const todoController = require('../controllers/todocontroller');

//check login and use authentication middleware for all routes in this router
// Get all todos
router.get('/', [authCheck.verifyToken], todoController.getTodos);
// Get a single todo by ID
router.get('/:id', [authCheck.verifyToken], todoController.getTodo);
// Create a new todo
router.post('/', [authCheck.verifyToken], todoController.createTodo);
// Update a todo
router.put('/:id', [authCheck.verifyToken], todoController.updateTodo);
// Delete a todo
router.delete('/:id', [authCheck.verifyToken], todoController.deleteTodo);
// Catch all other routes
router.all('/{*any}', (req, res) => {
    res.status(404).json({ error: '404 - Page not found' });
});

module.exports = router;