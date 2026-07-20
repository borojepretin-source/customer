import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// ─────────────────────────────────────────────────────────────────────────────
// Replace these values with your actual Firebase project config.
// Copy .env.local.example to .env.local and fill in the values from:
//   Firebase Console → Project Settings → Your Apps → Firebase SDK snippet
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? 'placeholder-api-key',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? 'placeholder.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? 'placeholder-project',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? 'placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? '1:000:web:000',
};

// Avoid reinitializing in Next.js hot-reload (reloaded with .env.local values)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
console.log('[Firebase] Connected to project:', firebaseConfig.projectId);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Hubungkan ke emulator lokal HANYA jika NEXT_PUBLIC_USE_EMULATOR=true
// Tanpa flag ini, Firebase akan menggunakan project production bahkan saat dev.
if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  const globalStorage = global as any;
  if (!globalStorage._emulatorConnected) {
    globalStorage._emulatorConnected = true;
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      
      const functionsInstance = getFunctions(app);
      connectFunctionsEmulator(functionsInstance, 'localhost', 5001);
      
      console.log('[Firebase] 🚀 Connected to local emulators: Firestore (8080), Storage (9199), Functions (5001)');
    } catch (e) {
      console.warn('[Firebase] Failed to connect to emulators:', e);
    }
  }
}

export default app;
