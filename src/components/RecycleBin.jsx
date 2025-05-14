// RecycleBin.jsx

function RecycleBin({ items = [], onRestore }) {
    return (
      <div>
        <h2 style={{ color: 'white' }}>🗑️ Recycle Bin</h2>
  
        {items.length === 0 ? (
          <p>No deleted tasks.</p>
        ) : (
          <ul>
            {items.map(task => (
              <li key={task.id} style={styles.item}>
                <span>{task.text}</span>
                <button onClick={() => onRestore(task.id)} style={styles.button}>
                  ♻️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  const styles = {
    item: {
      backgroundColor: 'white',
      padding: '0.75rem',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#10b981',
      border: 'none',
      color: 'white',
      padding: '0.4rem 0.7rem',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };
  
  export default RecycleBin;
  