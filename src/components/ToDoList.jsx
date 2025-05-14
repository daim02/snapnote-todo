import { useState } from 'react';
import ToDoItem from './ToDoItem';

function ToDoList({ todos, setTodos, setRecycleBin, onDelete, onSave, userId }) {
  const [newTask, setNewTask] = useState('');

  const handleAdd = async () => {
    if (newTask.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: newTask,
      done: false,
      deleted: false,
      user_id: userId,
    };

    setTodos(prev => [...prev, newTodo]);
    setNewTask('');
    await onSave(newTodo);
  };

  const handleToggleDone = async (taskId) => {
    const task = todos.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, done: true, deleted: true };

    setTodos(prev => prev.filter(t => t.id !== taskId));
    setRecycleBin(prev => [...prev, updatedTask]);

    await onSave(updatedTask);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Active Tasks</h2>

      {todos.length === 0 ? (
        <p style={styles.emptyText}>No tasks yet. Add one!</p>
      ) : (
        <ul style={styles.list}>
          {todos.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleDone(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </ul>
      )}

      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAdd} style={styles.button}>
          Add Task
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1.5rem',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    maxWidth: '400px',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default TodoList;
