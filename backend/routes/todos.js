const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});
// get a single todo 
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({ error: 'Invalid todo ID' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
// Create a new todo
router.post('/', async (req, res) => {
    try {
        // input validation 
        for (key in req.body) {
            // check if the key is a valid field in the todo schema
            if (!['title', 'description', 'completed', 'dueDate'].includes(key)) {
                return res.status(400).json({ error: `Invalid field: ${key}` });
            }
            // chceck if the value is of the correct type
            if (key === 'title' && typeof req.body[key] !== 'string') {
                return res.status(400).json({ error: 'Title must be a string' });
            }
            if (key === 'description' && typeof req.body[key] !== 'string') {
                return res.status(400).json({ error: 'Description must be a string' });
            }
            if (key === 'completed' && typeof req.body[key] !== 'boolean') {
                return res.status(400).json({ error: 'Completed must be a boolean' });
            }
            if (key === 'dueDate' && typeof req.body[key] !== 'string') {
                return res.status(400).json({ error: 'Due date must be a string' });
            }
        }
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        console.error(error.message);
        if (error.message === 'Todo validation failed: title: Path `title` is required.') {
            return res.status(400).json({ error: 'Title is required' });
        }
        else if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'invalid todo data' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
// Update and delete routes for a specific todo by ID
router.put('/:id', async (req, res) => {
    try {
        // input validation 
        for (key in req.body) {
            // check if the key is a valid field in the todo schema
            if (!['title', 'description', 'completed', 'dueDate'].includes(key)) {
                return res.status(400).json({ error: `Invalid field: ${key}` });
            }
            // chceck if the value is of the correct type
            if (key === 'title' && typeof req.body[key] !== 'string') {
                return res.status(400).json({ error: 'Title must be a string' });
            }
            if (key === 'description' && typeof req.body[key] !== 'string') {
                return res.status(400).json({ error: 'Description must be a string' });
            }
            if (key === 'completed' && typeof req.body[key] !== 'boolean') {
                return res.status(400).json({ error: 'Completed must be a boolean' });
            }
            if (key === 'dueDate' && typeof req.body[key] !== 'string') {
                return res.status(400).json({ error: 'Due date must be a string' });
            }
        }
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({ error: 'Invalid todo ID' });
        }
        else if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid todo data' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});
// Catch all other routes
router.all('/{*any}', (req, res) => {
    res.status(404).json({ error: '404 - Page not found' });
});

module.exports = router;