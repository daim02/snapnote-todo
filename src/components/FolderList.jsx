import { useState } from 'react';

function FolderList({ folders, setSelectedFolder, setFolders }) {
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;

    const newFolder = {
      id: Date.now(),
      name,
      todos: []
    };

    setFolders(prev => [...prev, newFolder]);
    setSelectedFolder(newFolder);
    setNewFolderName('');
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setSelectedFolder(null);
  };

  return (
    <div>
      <h2>📁 Folders</h2>
      <ul>
        {folders.map(folder => (
          <li key={folder.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setSelectedFolder(folder)}>{folder.name}</button>
            <button onClick={() => handleDeleteFolder(folder.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
        />
        <button onClick={handleCreateFolder} style={{ marginLeft: '0.5rem' }}>
          ➕ Add Folder
        </button>
      </div>
    </div>
  );
}

export default FolderList;
