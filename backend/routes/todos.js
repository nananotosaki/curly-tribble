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
        res.status(500).json({ error: 'Server error' });
    }
});
// Create a new todo
router.post('/', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        console.error(error.message);
        if (error.message === 'Todo validation failed: title: Path `title` is required.') {
            return res.status(400).json({ error: 'Title is required' });
        }
        else if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        // res.status(500).json({ error: 'Server error' });
    }
});
// Update and delete routes for a specific todo by ID
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        console.error(error.message);
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