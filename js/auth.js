import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = '/app/index.html';
  }
});

window.login = async function () {
  const email = document.getElementById('emailInput').value.trim();
  const senha = document.getElementById('senhaInput').value;

  if (!email || !senha) {
    alert('Preencha email e senha.');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    // onAuthStateChanged fará o redirect
  } catch (error) {
    alert('Erro ao fazer login: ' + (error?.message || error));
  }
};

window.registrar = async function () {
  const email = document.getElementById('emailInput').value.trim();
  const senha = document.getElementById('senhaInput').value;

  if (!email || !senha) {
    alert('Preencha email e senha.');
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert('Conta criada! Você já está logado.');
    // onAuthStateChanged fará o redirect
  } catch (error) {
    alert('Erro ao criar conta: ' + (error?.message || error));
  }
};

window.loginGoogle = async function () {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // onAuthStateChanged fará o redirect
  } catch (error) {
    alert('Erro no login com Google: ' + (error?.message || error));
  }
};
