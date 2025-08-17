import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyByKpkruV84s6QsVexEgymzV4c5VipUhVo',
  authDomain: 'fluxo-de-obras.firebaseapp.com',
  projectId: 'fluxo-de-obras',
  storageBucket: 'fluxo-de-obras.appspot.com', // ← corrigido aqui!
  messagingSenderId: '112722513082',
  appId: '1:112722513082:web:25a97ea0a099c7f57d0683',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
