import confetti from 'canvas-confetti';

function ToDoItem({ task, onToggle, onDelete }) {
  const handleToggle = () => {
    if (!task.done) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    onToggle();
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggle}
      />
      <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button onClick={onDelete} style={styles.deleteButton}>🗑️</button>
    </li>
  );
}

const styles = {
    deleteButton: {
      background: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
      fontSize: '1.2rem',
      lineHeight: 1,
      cursor: 'pointer',
      color: 'inherit',
    },
  };
  

export default TodoItem;
