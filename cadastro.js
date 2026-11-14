var formCadastro = document.getElementById('formCadastro');
var erroCadastro = document.getElementById('erroCadastro');

// se já está logado, não precisa cadastrar de novo
if (usuarioAtual()) {
  window.location.href = 'perfil.html';
}

// ---------- máscaras simples ----------
document.getElementById('cadCpf').addEventListener('input', function () {
  var numeros = this.value.replace(/\D/g, '').slice(0, 11);

  numeros = numeros.replace(/(\d{3})(\d)/, '$1.$2');
  numeros = numeros.replace(/(\d{3})(\d)/, '$1.$2');
  numeros = numeros.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  this.value = numeros;
});

document.getElementById('cadTelefone').addEventListener('input', function () {
  var numeros = this.value.replace(/\D/g, '').slice(0, 11);

  numeros = numeros.replace(/^(\d{2})(\d)/, '($1) $2');
  numeros = numeros.replace(/(\d{5})(\d{1,4})$/, '$1-$2');

  this.value = numeros;
});

// ---------- enviar o cadastro ----------
formCadastro.addEventListener('submit', function (evento) {
  evento.preventDefault();
  erroCadastro.textContent = '';

  var senha = document.getElementById('cadSenha').value;
  var senha2 = document.getElementById('cadSenha2').value;

  if (senha.length < 6) {
    erroCadastro.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
    return;
  }

  if (senha !== senha2) {
    erroCadastro.textContent = 'As senhas não são iguais.';
    return;
  }

  var erro = criarUsuario({
    nome: document.getElementById('cadNome').value,
    email: document.getElementById('cadEmail').value,
    telefone: document.getElementById('cadTelefone').value,
    cpf: document.getElementById('cadCpf').value,
    senha: senha
  });

  if (erro !== '') {
    erroCadastro.textContent = erro;
    return;
  }

  avisar('Conta criada! Bem-vindo à Midnight Brew.');

  setTimeout(function () {
    window.location.href = 'perfil.html';
  }, 1200);
});

// link "Entrar"
document.getElementById('linkJaTenho').addEventListener('click', function (evento) {
  evento.preventDefault();
  abrirLogin();
});

// busca do cabeçalho
document.getElementById('formBuscaTopo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  window.location.href = 'produtos.html';
});

// newsletter
document.getElementById('formClube').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var email = document.getElementById('emailClube').value;
  document.getElementById('msgClube').textContent = 'Pronto! ' + email + ' agora faz parte do clube.';
  document.getElementById('emailClube').value = '';
});
