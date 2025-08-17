import { auth } from './firebase.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '../auth/login.html';
    return;
  }

  window.currentUser = user;

  document.dispatchEvent(new Event('user-authenticated'));
});

window.logout = async function () {
  await signOut(auth);
};
