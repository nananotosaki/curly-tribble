const Todo = require('../models/todo');

// Get all todos
exports.getTodos = async (req, res) => {
  try {
        const todos = await Todo.find({ userId: req.userId });
        res.json(todos);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};
// get a single todo 
const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) { 
        console.error(error.message);
        if (error.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({ error: 'Invalid todo ID' });
        }
        else {
            res.status(500).json({ error: 'Server error' });
        }
    }    
};
exports.getTodo = async (req, res) => {
  await getTodoById(req, res);
};
// Create a new todo
const createTodo = async (req, res) => {
    try {
            // input validation 
            for (let key in req.body) {
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
            const todo = new Todo({
                userId: req.userId,
                ...req.body
            });
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
};
exports.createTodo = async (req, res) => {
  await createTodo(req, res);
};
// update a todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { $set: req.body },
        { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// delete a todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteTodo = async (req, res) => {
    await deleteTodo(req, res);
};