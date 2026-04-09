const Todo = require('../models/todo');

// Get all todos
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getTodos = async (req, res) => {
  await getAllTodos(req, res);
};
// get a single todo 
const getTodoById = async (req, res) => {
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
    }    res.status(500).json({ error: 'Server error' });
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
                title: req.body.title,
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
const updateTodo = (prop, value) => async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { [prop]: value } },
      { new: true, useFindAndModify: false }
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);  // Or call getAllTodos(req, res) if you want all todos
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.markDone = updateTodo("completed", true);

exports.markUnDone = updateTodo("completed", false);

exports.changeTitle = (req, res) => updateTodo("title", req.body.title)(req, res);
exports.changeDescription = (req, res) => updateTodo("description", req.body.description)(req, res);

// delete a todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
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