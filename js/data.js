import { db } from './firebase.js';
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

function obrasRef(uid) {
  return collection(db, 'users', uid, 'obras');
}

export const obrasData = {
  unsub: null,

  observarObras(uid, callback) {
    const q = query(obrasRef(uid), orderBy('nome'));
    this.unsub && this.unsub();
    this.unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(lista);
    });
  },

  async adicionarObra(uid, { nome, valor }) {

    const q = query(obrasRef(uid), where('nome', '==', nome));
    const dup = await getDocs(q);
    if (!dup.empty) throw new Error('Essa obra já existe.');
    await addDoc(obrasRef(uid), {
      nome,
      valor,
      observacao: '',
      pagamentos: [],
    });
  },

  async excluirObra(uid, idObra) {
    await deleteDoc(doc(db, 'users', uid, 'obras', idObra));
  },

  async atualizarObservacao(uid, idObra, observacao) {
    await updateDoc(doc(db, 'users', uid, 'obras', idObra), { observacao });
  },

  async adicionarPagamento(uid, idObra, pagamento) {
    const ref = doc(db, 'users', uid, 'obras', idObra);
    const snap = await getDoc(ref);
    const obra = snap.data();
    const pagamentos = [...(obra.pagamentos || []), pagamento];
    await updateDoc(ref, { pagamentos });
  },

  async editarPagamento(uid, idObra, indexPagamento, novoPagamento) {
    const ref = doc(db, 'users', uid, 'obras', idObra);
    const snap = await getDoc(ref);
    const obra = snap.data();
    const pagamentos = [...(obra.pagamentos || [])];
    pagamentos[indexPagamento] = novoPagamento;
    await updateDoc(ref, { pagamentos });
  },

  async excluirPagamento(uid, idObra, indexPagamento) {
    const ref = doc(db, 'users', uid, 'obras', idObra);
    const snap = await getDoc(ref);
    const obra = snap.data();
    const pagamentos = [...(obra.pagamentos || [])];
    pagamentos.splice(indexPagamento, 1);
    await updateDoc(ref, { pagamentos });
  },
};
