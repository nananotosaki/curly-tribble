import { useState, useEffect } from 'react';
import { getTodos, createTodo, deleteTodo, updateTodo } from '../services/todoService';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    // fetch todos
    const loadTodos =  async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to load Todos');
      }
    };
    loadTodos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    // create todo
    try {
      const newTodo = await createTodo({ title });
      setTodos([...todos, newTodo]);
    } catch(err) {
        setError(err.response?.data?.message || 'Failed to create Todo');
    }
  };

  const handleComplete = async (todoId, isCompleted) => {
    try {
      // FIX 1 & 2: Fix typo and capture the response
      const updatedTodo = await updateTodo(todoId, { completed: isCompleted });
      setTodos(todos.map(t => t._id === todoId ? updatedTodo : t));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (todoId) => { // FIX 3: Add todoId parameter
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(t => t._id !== todoId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete Todo');
    }
  };

  const startEdit = (todo) => {
  setEditingId(todo._id);
  setEditData({
    title: todo.title,
    description: todo.description || '',
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '' // Format for date input
  });
  };
  const handleSaveEdit = async (todoId) => {
  try {
    const updatedTodo = await updateTodo(todoId, editData);
    setTodos(todos.map(t => t._id === todoId ? updatedTodo : t));
    setEditingId(null);
  } catch (err) {
    setError('Failed to save changes');
  }
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  // calculate priority based on due date
  const isUrgent = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    const diffInHours = (due - now) / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 24; // Due within 24 hours
  };

  // calculate if passed due date
  const isDue = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    const diffInHours = (due - now) / (1000 * 60 * 60);
    return diffInHours < 0 && diffInHours != 0
  };
  

  return (
  <div>
    <h1>Todo Dashboard</h1>
    
    {/* Input Form */}
    <form onSubmit={handleCreate}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task..." />
      <button type="submit">Add</button>
    </form>

    {error && <p style={{color: 'red'}}>{error}</p>}

    {/* Section 1: Active Tasks */}
    <h2>Active ({activeTodos.length})</h2>
    {activeTodos.map(todo => (
      <div key={todo._id} className={`todo-item ${isDue(todo.dueDate) ? 'overdue-border' : isUrgent(todo.dueDate) ? 'urgent-border' : ''}`}>
        {isDue(todo.dueDate) && <span className="badge badge-overdue">😨 OVERDUE</span>}
        {isUrgent(todo.dueDate) && !isDue(todo.dueDate) && <span className="badge">🔥 URGENT</span>}

        {editingId === todo._id ? (
          /* --- EDIT MODE --- */
          <div className="edit-form">
            <input 
              type="text"
              value={editData.title} 
              onChange={(e) => setEditData({...editData, title: e.target.value})} 
            />
            <textarea 
              value={editData.description} 
              onChange={(e) => setEditData({...editData, description: e.target.value})} 
              placeholder="Description"
            />
            <input 
              type="date"
              value={editData.dueDate} 
              onChange={(e) => setEditData({...editData, dueDate: e.target.value})} 
            />
            <button onClick={() => handleSaveEdit(todo._id)}>Save</button>
            <button onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        ) : (
          /* --- DISPLAY MODE --- */
          <div className="todo-display">
            <div className="todo-content">
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => handleComplete(todo._id, true)} 
              />
              <span className="todo-title">{todo.title}</span>
              {todo.description && <p className="todo-desc">{todo.description}</p>}
              {todo.dueDate && <small>Due: {new Date(todo.dueDate).toLocaleDateString()}</small>}
            </div>
            
            <div className="todo-actions">
              <button onClick={() => startEdit(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          </div>
        )}
      </div>
    ))}

    <hr />

      {/* Section 2: Completed Tasks */}
      <h2>Completed ({completedTodos.length})</h2>
      <div className="completed-list">
        {completedTodos.map(todo => (
          <div key={todo._id} className="todo-item completed-item">
      {/* Grouping these two keeps them on the left together */}
      <div className="todo-content">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => handleComplete(todo._id, false)} 
        />
        <strike className="todo-title">{todo.title}</strike>
      </div>
      
      {/* This will now be pushed to the far right */}
      <div className="todo-actions">
        <button className="btn-delete" onClick={() => handleDelete(todo._id)}>
          Delete
        </button>
      </div>
    </div>
        ))}
    </div>
  </div>
);
}

export default Todos;