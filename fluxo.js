let obras = [];

function salvarObras() {
  localStorage.setItem('obras', JSON.stringify(obras));
}

function carregarObras() {
  const dados = localStorage.getItem('obras');
  if (dados) {
    obras = JSON.parse(dados);
    renderizarObras();
  }
}

function adicionarObra() {
  const nome = document.getElementById('obraInput').value.trim();
  const valor = parseFloat(document.getElementById('valorInput').value);

  if (!nome || isNaN(valor)) {
    alert('Preencha o nome e o valor corretamente.');
    return;
  }

  obras.push({ nome: `Obra: ${nome}`, valor, pagamentos: [], observacao: '' });
  salvarObras();
  renderizarObras();

  document.getElementById('obraInput').value = '';
  document.getElementById('valorInput').value = '';
}

function adicionarPagamento(indexObra) {
  const mes = prompt('Mês do pagamento:');
  const valor = parseFloat(prompt('Valor do pagamento:'));

  if (!mes || isNaN(valor)) {
    alert('Dados inválidos.');
    return;
  }

  const obra = obras[indexObra];
  const totalPago = obra.pagamentos.reduce((soma, p) => soma + p.valor, 0);
  const saldoAtual = obra.valor - totalPago;

  if (valor > saldoAtual) {
    alert('Pagamento excede o saldo restante.');
    return;
  }

  obra.pagamentos.push({ mes, valor });
  salvarObras();
  renderizarObras();
}

function editarPagamento(indexObra, indexPagamento) {
  const pagamento = obras[indexObra].pagamentos[indexPagamento];
  const novoMes = prompt('Editar mês:', pagamento.mes);
  const novoValor = parseFloat(prompt('Editar valor:', pagamento.valor));

  if (!novoMes || isNaN(novoValor)) {
    alert('Dados inválidos.');
    return;
  }

  obras[indexObra].pagamentos[indexPagamento] = {
    mes: novoMes,
    valor: novoValor,
  };
  salvarObras();
  renderizarObras();
}

function excluirObra(indexObra) {
  const nome = obras[indexObra].nome;
  if (confirm(`Tem certeza que deseja excluir a ${nome}?`)) {
    obras.splice(indexObra, 1);
    salvarObras();
    renderizarObras();
  }
}

function exportarObra(indexObra) {
  const obra = obras[indexObra];
  const dados = [
    ['Nome da Obra', obra.nome],
    ['Valor Total', obra.valor],
    [
      'Saldo Restante',
      obra.valor - obra.pagamentos.reduce((s, p) => s + p.valor, 0),
    ],
    [],
    ['Mês', 'Valor do Pagamento'],
  ];

  obra.pagamentos.forEach((p) => {
    dados.push([p.mes, p.valor]);
  });

  dados.push([]);
  dados.push(['Observações', obra.observacao || '']);

  const worksheet = XLSX.utils.aoa_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Obra');

  XLSX.writeFile(workbook, `${obra.nome.replace('Obra: ', '')}.xlsx`);
}

function excluirPagamento(indexObra, indexPagamento) {
  if (confirm('Deseja realmente excluir este pagamento?')) {
    obras[indexObra].pagamentos.splice(indexPagamento, 1);
    salvarObras();
    renderizarObras();
  }
}

function renderizarObras() {
  const container = document.getElementById('tabelaObras');
  container.innerHTML = '';

  let totalGeral = 0;
  let saldoGeral = 0;

  obras.forEach((obra, indexObra) => {
    const totalPago = obra.pagamentos.reduce((soma, p) => soma + p.valor, 0);
    const saldo = obra.valor - totalPago;
    totalGeral += obra.valor;
    saldoGeral += saldo;

    const saldoClass = saldo === 0 ? 'saldo-zero' : '';

    let html = `<table class="${saldoClass}">
      <tr><th colspan="4">${obra.nome}</th></tr>
      <tr><td><strong>Valor Total</strong></td><td colspan="3">R$ ${obra.valor.toFixed(
        2
      )}</td></tr>
      <tr><td><strong>Saldo Restante</strong></td><td colspan="3">R$ ${saldo.toFixed(
        2
      )}</td></tr>
      <tr><th>Mês</th><th>Pagamento</th><th colspan="2">Ações</th></tr>`;

    obra.pagamentos.forEach((p, indexPagamento) => {
      html += `<tr>
        <td>${p.mes}</td>
        <td>R$ ${p.valor.toFixed(2)}</td>
        <td><button onclick="editarPagamento(${indexObra}, ${indexPagamento})">✏️ Editar</button></td>
        <td><button onclick="excluirPagamento(${indexObra}, ${indexPagamento})">🗑️ Excluir</button></td>
      </tr>`;
    });

    html += `<tr><td colspan="4">
      <button onclick="adicionarPagamento(${indexObra})" ${
      saldo === 0 ? 'disabled' : ''
    }>➕ Adicionar Pagamento</button>
      <button onclick="exportarObra(${indexObra})">📤 Exportar para Excel</button>
      <button onclick="excluirObra(${indexObra})">🗑️ Excluir Obra</button>
    </td></tr>
    <tr>
      <td colspan="4">
        <textarea placeholder="Observações da obra..." rows="3" style="width: 100%;"
          oninput="atualizarObservacao(${indexObra}, this.value)">${
      obra.observacao || ''
    }</textarea>
      </td>
    </tr>
    </table><br>`;

    container.innerHTML += html;
  });

  container.innerHTML += `<h3>Total Geral das Obras: R$ ${totalGeral.toFixed(
    2
  )}</h3>`;
  container.innerHTML += `<h3>Saldo Geral Restante: R$ ${saldoGeral.toFixed(
    2
  )}</h3>`;
}

function atualizarObservacao(indexObra, texto) {
  obras[indexObra].observacao = texto;
  salvarObras();
}

carregarObras();
