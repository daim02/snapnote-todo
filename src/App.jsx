import { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import ToDoList from './components/ToDoList';
import RecycleBin from './components/RecycleBin';
import logo from './assets/snapnote-logo.png'; // 👈 Logo import

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [recycleBin, setRecycleBin] = useState([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Sign-up successful! You can now log in.');
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTodos([]);
    setRecycleBin([]);
  };

  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading todos:', error);
        return;
      }

      setTodos(data.filter(t => !t.deleted));
      setRecycleBin(data.filter(t => t.deleted));
    };

    fetchTodos();
  }, [user]);

  const saveTodo = async (todo) => {
    const { error } = await supabase.from('todos').upsert(todo);
    if (error) console.error('Save error:', error);
  };

  const deleteTodo = async (id) => {
    const toDelete = todos.find(t => t.id === id);
    const updated = { ...toDelete, deleted: true, done: true };
    setTodos(prev => prev.filter(t => t.id !== id));
    setRecycleBin(prev => [...prev, updated]);
    await saveTodo(updated);
  };

  const restoreTodo = async (id) => {
    const toRestore = recycleBin.find(t => t.id === id);
    const updated = { ...toRestore, deleted: false, done: false };
    setRecycleBin(prev => prev.filter(t => t.id !== id));
    setTodos(prev => [...prev, updated]);
    await saveTodo(updated);
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="Snapnote Logo" style={styles.logo} />

      <h1 style={styles.title}>To-Do List</h1>

      {!user ? (
        <div style={styles.authBox}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
          />
          <div style={{ marginTop: '1rem' }}>
            {isLogin ? (
              <button onClick={handleLogin} style={styles.authButton}>
                Log In
              </button>
            ) : (
              <button onClick={handleSignUp} style={styles.authButton}>
                Sign Up
              </button>
            )}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={styles.toggleButton}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.main}>
            {!showRecycleBin ? (
              <ToDoList
                todos={todos}
                setTodos={setTodos}
                setRecycleBin={setRecycleBin}
                onDelete={deleteTodo}
                onSave={saveTodo}
                userId={user.id}
              />
            ) : (
              <RecycleBin
                items={recycleBin}
                onRestore={restoreTodo}
              />
            )}
          </div>

          <button
            onClick={() => setShowRecycleBin(prev => !prev)}
            style={styles.fab}
            title={showRecycleBin ? "Back to To-Do List" : "Open Recycle Bin"}
          >
            {showRecycleBin ? '📋' : '🗑️'}
          </button>

          <button
            onClick={handleLogout}
            style={styles.logoutFab}
            title="Log Out"
          >
            📤
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    backgroundColor: '#a3a3a3',
    minHeight: '100vh',
  },
  logo: {
    width: '320px',
    marginTop: '-9rem',
    marginBottom: '6rem',
    display: 'block',
  },
  title: {
    fontSize: '2rem',
    marginTop: '-1rem',
    marginBottom: '0rem',
    color: 'white',
  },
  authBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '400px',
    marginTop: '2rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  authButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6a6a6a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#6a6a6a',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
    width: '100%',
  },
  fab: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    backgroundColor: '#ffffff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  logoutFab: {
    position: 'fixed',
    bottom: '2rem',
    left: '2rem',
    backgroundColor: '#ffffff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
};

export default App;
