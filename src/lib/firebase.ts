import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBdyWyyVjW2XomvoGCX7KUtHVHoGhsfny0",
  authDomain: "araku-vally.firebaseapp.com",
  projectId: "araku-vally",
  storageBucket: "araku-vally.firebasestorage.app",
  messagingSenderId: "375750712163",
  appId: "1:375750712163:web:ea5107a247b14ea4801156",
  measurementId: "G-FY8G1PFPZ6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
