let necessidades = JSON.parse(localStorage.getItem('necessidades')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastro');
  const lista = document.getElementById('listaNecessidades');
  const filtro = document.getElementById('filtroTipoAjuda');
  const pesquisa = document.getElementById('pesquisa');

  if (form) {
    document.getElementById('cep').addEventListener('blur', buscarEndereco);
    form.addEventListener('submit', salvarNecessidade);
  }

  if (lista) {
    exibirNecessidades();
    filtro.addEventListener('change', exibirNecessidades);
    pesquisa.addEventListener('input', exibirNecessidades);
  }
});

function buscarEndereco() {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('rua').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('cidade').value = data.localidade || '';
      document.getElementById('estado').value = data.uf || '';
    });
}

function salvarNecessidade(e) {
  e.preventDefault();

  const nova = {
    instituicao: document.getElementById('instituicao').value,
    tipoAjuda: document.getElementById('tipoAjuda').value,
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    cep: document.getElementById('cep').value,
    rua: document.getElementById('rua').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value,
    contato: document.getElementById('contato').value
  };

  if (!nova.instituicao || !nova.tipoAjuda || !nova.titulo || !nova.descricao || !nova.cep || !nova.contato) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  necessidades.push(nova);
  localStorage.setItem('necessidades', JSON.stringify(necessidades));
  alert('Necessidade cadastrada com sucesso!');
  e.target.reset();
}

function exibirNecessidades() {
  const lista = document.getElementById('listaNecessidades');
  const filtro = document.getElementById('filtroTipoAjuda').value;
  const termo = document.getElementById('pesquisa').value.toLowerCase();

  lista.innerHTML = '';
  const filtradas = necessidades.filter(n => {
    return (!filtro || n.tipoAjuda === filtro) &&
           (n.titulo.toLowerCase().includes(termo) || n.descricao.toLowerCase().includes(termo));
  });

  filtradas.forEach(n => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${n.titulo}</h3>
      <p><strong>Instituição:</strong> ${n.instituicao}</p>
      <p><strong>Tipo:</strong> ${n.tipoAjuda}</p>
      <p><strong>Descrição:</strong> ${n.descricao}</p>
      <p><strong>Endereço:</strong> ${n.rua}, ${n.bairro} - ${n.cidade}/${n.estado}</p>
      <p><strong>Contato:</strong> ${n.contato}</p>
    `;
    lista.appendChild(card);
  });
}
