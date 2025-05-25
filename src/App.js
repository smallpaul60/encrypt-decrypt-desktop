
// src/App.js

import React, { useState } from 'react';
import FileEncryptor from './components/FileEncryptor.js';
import DecryptFile   from './components/DecryptFile.js';
import './App.css';

function App() {
  // start with no panel showing
  const [mode, setMode] = useState(null);

  return (
    <div className="App">
      <header>
        <h1>RaptorLockIP Encrypt/Decrypt</h1>
        <nav>
          <button onClick={() => setMode('encrypt')}>
            Encrypt File
          </button>
          <button onClick={() => setMode('decrypt')}>
            Decrypt File
          </button>
        </nav>
      </header>

      <main>
        {mode === 'encrypt' && <FileEncryptor />}
        {mode === 'decrypt' && <DecryptFile />}
      </main>
    </div>
  );
}

export default App;
