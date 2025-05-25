
// src/components/FileEncryptor.js

import React, { useState } from 'react';
import styles from '../styles/FileEncryptor.module.css';

/** Helpers to Base64‐encode ArrayBuffers/Uint8Arrays */
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

export default function FileEncryptor() {
  const [filePath, setFilePath] = useState('');
  const [plainBytes, setPlainBytes] = useState(null);
  const [encryptedBytes, setEncryptedBytes] = useState(null);
  const [keyIv, setKeyIv] = useState({ key: '', iv: '' });
  const [status, setStatus] = useState('');

  const handleSelect = async () => {
    const path = await window.electronAPI.openFile();
    if (!path) return;
    setFilePath(path);
    const buf = await window.electronAPI.readFile(path);
    setPlainBytes(
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    );
    setEncryptedBytes(null);
    setKeyIv({ key: '', iv: '' });
    setStatus('');
  };

  const handleEncrypt = async () => {
    if (!plainBytes) return;
    setStatus('Encrypting…');
    const cryptoKey = await window.crypto.subtle.generateKey(
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const rawKey = await window.crypto.subtle.exportKey('raw', cryptoKey);
    const ivArr = window.crypto.getRandomValues(new Uint8Array(16));
    const cipherBuf = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivArr },
      cryptoKey,
      plainBytes
    );
    setEncryptedBytes(new Uint8Array(cipherBuf));
    setKeyIv({
      key: arrayBufferToBase64(rawKey),
      iv: arrayBufferToBase64(ivArr.buffer),
    });
    setStatus('Encryption complete');
  };

  const handleSave = async () => {
    if (!encryptedBytes) return;
    const saved = await window.electronAPI.saveFile({
      dataBuffer: encryptedBytes,
      defaultPath: filePath ? `${filePath}.encrypted` : undefined,
    });
    if (saved) setStatus(`File saved to ${saved}`);
  };

  const copyText = txt => navigator.clipboard.writeText(txt);
  const copyBoth = () =>
    copyText(`Key: ${keyIv.key}\nIV:  ${keyIv.iv}`);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Encrypt a File</h2>

      <div className={styles.selectRow}>
        <button onClick={handleSelect}>Select File</button>
        <div className={styles.fileBox}>
          {filePath || <em>No file selected</em>}
        </div>
      </div>

      <div className={styles.encryptRow}>
        <button onClick={handleEncrypt} disabled={!plainBytes}>
          Encrypt
        </button>
        <div
          className={
            status === 'Encryption complete'
              ? `${styles.statusBox} ${styles.success}`
              : styles.statusBox
          }
        >
          {status || <em>Ready to encrypt</em>}
        </div>
      </div>

      {keyIv.key && (
        <>
          <div className={styles.keyRow}>
            <label>Key (Base64)</label>
            <div className={styles.keyBox}>{keyIv.key}</div>
            <button onClick={() => copyText(keyIv.key)}>Copy</button>
          </div>

          <div className={styles.keyRow}>
            <label>IV (Base64)</label>
            <div className={styles.keyBox}>{keyIv.iv}</div>
            <button onClick={() => copyText(keyIv.iv)}>Copy</button>
          </div>

          <div className={styles.copyBothRow}>
            <button onClick={copyBoth}>Copy Both</button>
          </div>
        </>
      )}

      <div className={styles.saveRow}>
        <button onClick={handleSave} disabled={!encryptedBytes}>
          Save Encrypted File
        </button>
      </div>
    </div>
  );
}
