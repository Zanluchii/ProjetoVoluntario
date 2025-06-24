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

let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const formVoluntario = document.getElementById('formVoluntario');
  if (formVoluntario) {
    formVoluntario.addEventListener('submit', cadastrarVoluntario);
  }
});

function cadastrarVoluntario(e) {
  e.preventDefault();

  const voluntario = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    tipoAjuda: document.getElementById('tipoAjuda').value
  };

  if (!voluntario.nome || !voluntario.email || !voluntario.telefone || !voluntario.tipoAjuda) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  voluntarios.push(voluntario);
  localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
  alert('Voluntário cadastrado com sucesso!');
  e.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const listaVoluntarios = document.getElementById('listaVoluntarios');
  const pesquisaVoluntario = document.getElementById('pesquisaVoluntario');

  if (listaVoluntarios) {
    exibirVoluntarios();
    pesquisaVoluntario.addEventListener('input', exibirVoluntarios);
  }
});

function exibirVoluntarios() {
  const lista = document.getElementById('listaVoluntarios');
  const termo = document.getElementById('pesquisaVoluntario').value.toLowerCase();
  lista.innerHTML = '';

  const filtrados = voluntarios.filter(v =>
    v.nome.toLowerCase().includes(termo) || v.tipoAjuda.toLowerCase().includes(termo)
  );

  filtrados.forEach((v, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${v.nome}</h3>
      <p><strong>Email:</strong> ${v.email}</p>
      <p><strong>Telefone:</strong> ${v.telefone}</p>
      <p><strong>Tipo de Ajuda:</strong> ${v.tipoAjuda}</p>
      <button onclick="editarVoluntario(${index})">Editar</button>
      <button onclick="excluirVoluntario(${index})">Excluir</button>
    `;
    lista.appendChild(card);
  });
}


  filtrados.forEach((v, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${v.nome}</h3>
      <p><strong>Email:</strong> ${v.email}</p>
      <p><strong>Telefone:</strong> ${v.telefone}</p>
      <p><strong>Tipo de Ajuda:</strong> ${v.tipoAjuda}</p>
      <button onclick="excluirVoluntario(${index})">Excluir</button>
    `;
    lista.appendChild(card);
  });

function excluirVoluntario(index) {
  if (confirm('Tem certeza que deseja excluir este voluntário?')) {
    voluntarios.splice(index, 1);
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
    exibirVoluntarios();
  }
}

let indiceEdicao = null;

function editarVoluntario(index) {
  const voluntario = voluntarios[index];
  indiceEdicao = index;

  document.getElementById('editarNome').value = voluntario.nome;
  document.getElementById('editarEmail').value = voluntario.email;
  document.getElementById('editarTelefone').value = voluntario.telefone;
  document.getElementById('editarTipoAjuda').value = voluntario.tipoAjuda;

  document.getElementById('modalEditar').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

document.getElementById('formEditarVoluntario').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('editarNome').value;
  const email = document.getElementById('editarEmail').value;
  const telefone = document.getElementById('editarTelefone').value;
  const tipoAjuda = document.getElementById('editarTipoAjuda').value;

  voluntarios[indiceEdicao] = { nome, email, telefone, tipoAjuda };
  localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

  fecharModal();
  exibirVoluntarios();
});

function editarVoluntario(index) {
  const voluntario = voluntarios[index];

  document.getElementById('editarNome').value = voluntario.nome;
  document.getElementById('editarEmail').value = voluntario.email;
  document.getElementById('editarTelefone').value = voluntario.telefone;
  document.getElementById('editarTipoAjuda').value = voluntario.tipoAjuda;

  document.getElementById('modalEditar').style.display = 'block';

  const formEditar = document.getElementById('formEditarVoluntario');
  formEditar.onsubmit = function (e) {
    e.preventDefault();

    voluntarios[index] = {
      nome: document.getElementById('editarNome').value.trim(),
      email: document.getElementById('editarEmail').value.trim(),
      telefone: document.getElementById('editarTelefone').value.trim(),
      tipoAjuda: document.getElementById('editarTipoAjuda').value.trim()
    };

    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
    document.getElementById('modalEditar').style.display = 'none';
    exibirVoluntarios();
  };
}

function excluirVoluntario(index) {
  if (confirm("Tem certeza que deseja excluir este voluntário?")) {
    voluntarios.splice(index, 1);
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
    exibirVoluntarios();
  }
}

function fecharModal() {
  document.getElementById('modalEditar').style.display = 'none';
}
