# RaptorLockIP Encryptor

**Offline Electron app for AES-256-CBC file encryption/decryption**

RaptorLockIP Encryptor is a fully offline, cross-platform Electron desktop app built with React. It lets you:

- Securely encrypt any file (AES-256-CBC via WebCrypto) and export an encrypted file
- Generate and securely copy your Base64-encoded key and IV
- Decrypt previously encrypted files locally with the correct key and IV
- Operate 100% offline—no server calls, no data ever leaves your machine

Whether you need to protect sensitive documents before sharing them, or simply want a standalone tool to handle encryption and decryption without a network, RaptorLockIP Encryptor has you covered.

## 🚀 Installation

1. Download the latest installer from the [Releases](https://github.com/smallpaul60/encrypt-decrypt-desktop/releases).
2. Run the installer (`.exe` on Windows, `.dmg` on macOS, `.AppImage` or `.deb` on Linux).
3. Launch the app from your applications menu or desktop shortcut.

## 🛡️ Usage Guide

1. **Encrypt a File**
   - Open the app and click **"Encrypt File"**.
   - Select the file you want to encrypt.
   - Click **"Encrypt"**.
   - Your encrypted file will be saved, and your key/IV displayed. Copy or save them securely.

2. **Decrypt a File**
   - Click **"Decrypt File"**.
   - Select the encrypted file.
   - Paste your Base64-encoded key and IV.
   - Click **"Decrypt & Download"** to restore the original file.

## 📄 Included User Guide

A detailed user guide is bundled with the app as **User-Guide.pdf** in the installation directory. You can open it at any time for more in-depth instructions.

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
