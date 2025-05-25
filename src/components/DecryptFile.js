
// src/components/DecryptFile.js

import React, { useState } from 'react';
import styles from './DecryptFile.module.css';

/** Helpers to Base64‐decode into ArrayBuffers */
function base64ToArrayBuffer(base64) {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function DecryptFile() {
  const [filePath, setFilePath] = useState(null);
  const [encryptedBytes, setEncryptedBytes] = useState(null);
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [status, setStatus] = useState('');

  // 1) Pick & read the encrypted file
  const handleSelect = async () => {
    const path = await window.electronAPI.openFile();
    if (!path) return;
    setFilePath(path);
    const buf = await window.electronAPI.readFile(path);
    const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    setEncryptedBytes(new Uint8Array(arrayBuf));
    setStatus(`Loaded ${path}`);
  };

  // 2) Decrypt with WebCrypto
  const handleDecrypt = async () => {
    if (!encryptedBytes || !key || !iv) {
      setStatus('Please load a file and enter both key & IV');
      return;
    }
    setStatus('Decrypting file…');
    try {
      // Convert Base64 → ArrayBuffer
      const keyBuf = base64ToArrayBuffer(key);
      const ivBuf  = base64ToArrayBuffer(iv);
      // Import the raw AES key
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuf,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
      );
      // Perform decryption
      const plainBuf = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: new Uint8Array(ivBuf) },
        cryptoKey,
        encryptedBytes
      );
      const plainBytes = new Uint8Array(plainBuf);

      // signal decryption finished
      setStatus('Decryption complete!');

      // 3) Save decrypted file
      const saved = await window.electronAPI.saveFile({
        dataBuffer: plainBytes,
        // strip “.encrypted” or default to “.decrypted”
        defaultPath: filePath?.replace(/\.encrypted$/, '') + '.decrypted'
      });
      if (saved) {
        setStatus(`Decrypted file saved to ${saved}`);
      } else {
        setStatus('Save cancelled');
      }
    } catch (e) {
      console.error(e);
      setStatus(`Decryption failed: ${e.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Decrypt a File</h2>

      <div className={styles.buttonRow}>
        <button onClick={handleSelect}>Select Encrypted File</button>
      </div>
      {filePath && (
        <p className={styles.path}><code>{filePath}</code></p>
      )}

      <div className={styles.formRow}>
        <label>Base64 Key</label>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value.trim())}
          placeholder="Paste your Base64 key"
        />
      </div>

      <div className={styles.formRow}>
        <label>Base64 IV</label>
        <input
          type="text"
          value={iv}
          onChange={e => setIv(e.target.value.trim())}
          placeholder="Paste your Base64 IV"
        />
      </div>

      <div className={styles.buttonRow}>
        <button onClick={handleDecrypt} disabled={!encryptedBytes || !key || !iv}>
          Decrypt &amp; Download
        </button>
      </div>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
