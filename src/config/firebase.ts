import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWLur8hX6KGDdi88KNhYDvLbAQ51GAkSY",
  authDomain: "damadba-d44a6.firebaseapp.com",
  projectId: "damadba-d44a6",
  storageBucket: "damadba-d44a6.firebasestorage.app",
  messagingSenderId: "94145577768",
  appId: "1:94145577768:web:d775415bfe35ee79f1461d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);