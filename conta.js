// login, cadastro e usuário logado (tudo guardado no navegador)
// esse arquivo é carregado em todas as páginas, depois do compartilhado.js

// ---------- usuários ----------
function lerUsuarios() {
  var lista = [];

  try {
    lista = JSON.parse(localStorage.getItem('usuarios')) || [];
  } catch (erro) {
    lista = [];
  }

  // conta de teste (a mesma do perfil do protótipo)
  if (lista.length === 0) {
    lista.push({
      nome: 'Lucas Mendonça',
      email: 'lucas.mendonca@midnightbrew.com.br',
      senha: '123456',
      cpf: '128.456.789-00',
      telefone: '(31) 99876-5432',
      leite: 'Leite Vegetal de Aveia (Barista)',
      torra: 'Torra Midnight Intensa (Extra Cafeína)',
      pontos: 420,
      pedidos: 14,
      favorito: 'Midnight Nitro Cold Brew',
      enderecos: [
        { nome: 'Home Studio / Casa', rua: 'Av. do Contorno, 6500 - Apto 1202, Savassi', cidade: 'Belo Horizonte - MG • CEP 30110-044', principal: true },
        { nome: 'Escritório / Coworking', rua: 'Rua Sergipe, 1140 - Sala 804, Funcionários', cidade: 'Belo Horizonte - MG • CEP 30130-174', principal: false }
      ],
      pagamentoAtivo: 'cartao'
    });
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }

  return lista;
}

function salvarUsuarios(lista) {
  localStorage.setItem('usuarios', JSON.stringify(lista));
}

function usuarioAtual() {
  var email = localStorage.getItem('usuarioLogado');
  if (!email) {
    return null;
  }

  var achado = lerUsuarios().find(function (usuario) {
    return usuario.email === email;
  });

  return achado || null;
}

function atualizarUsuario(email, campos) {
  var lista = lerUsuarios();

  lista.forEach(function (usuario) {
    if (usuario.email === email) {
      for (var campo in campos) {
        usuario[campo] = campos[campo];
      }
    }
  });

  salvarUsuarios(lista);
}

function entrar(email, senha) {
  var emailLimpo = email.toLowerCase().trim();

  var achado = lerUsuarios().find(function (usuario) {
    return usuario.email === emailLimpo && usuario.senha === senha;
  });

  if (achado) {
    localStorage.setItem('usuarioLogado', achado.email);
  }

  return achado || null;
}

function sair() {
  localStorage.removeItem('usuarioLogado');
}

// devolve um texto de erro, ou '' se deu certo
function criarUsuario(dados) {
  var lista = lerUsuarios();
  var email = dados.email.toLowerCase().trim();

  var jaExiste = lista.some(function (usuario) {
    return usuario.email === email;
  });

  if (jaExiste) {
    return 'Já existe uma conta com esse e-mail.';
  }

  lista.push({
    nome: dados.nome.trim(),
    email: email,
    senha: dados.senha,
    cpf: dados.cpf,
    telefone: dados.telefone,
    leite: 'Leite Integral',
    torra: 'Torra Média Equilibrada',
    pontos: 0,
    pedidos: 0,
    favorito: '',
    enderecos: [],
    pagamentoAtivo: 'pix'
  });

  salvarUsuarios(lista);
  localStorage.setItem('usuarioLogado', email);
  return '';
}

function primeiroNome(usuario) {
  return usuario.nome.split(' ')[0];
}

// ---------- aviso flutuante ----------
var timerAvisoConta;

function avisar(texto) {
  var aviso = document.getElementById('aviso');
  if (!aviso) {
    return;
  }

  aviso.textContent = texto;
  aviso.classList.add('mostrar');

  clearTimeout(timerAvisoConta);
  timerAvisoConta = setTimeout(function () {
    aviso.classList.remove('mostrar');
  }, 2500);
}

// ---------- pop-up de login ----------
document.body.insertAdjacentHTML('beforeend',
  '<div class="modal-fundo" id="modalLogin">' +
    '<div class="modal">' +
      '<button class="modal-fechar" id="modalFechar" aria-label="Fechar">✕</button>' +
      '<small>BEM-VINDO DE VOLTA, CORUJA</small>' +
      '<h2>Entrar na Midnight Brew</h2>' +
      '<form id="formLogin">' +
        '<label>E-MAIL</label>' +
        '<input type="email" id="loginEmail" placeholder="seu@email.com" required>' +
        '<label>SENHA</label>' +
        '<input type="password" id="loginSenha" placeholder="Sua senha" required>' +
        '<p class="modal-erro" id="loginErro"></p>' +
        '<button type="submit" class="modal-botao">Entrar</button>' +
      '</form>' +
      '<p class="modal-dica">Conta de teste: lucas.mendonca@midnightbrew.com.br<br>Senha: 123456</p>' +
      '<p class="modal-rodape">Ainda não tem conta? <a href="cadastro.html">Cadastre-se</a></p>' +
    '</div>' +
  '</div>'
);

var modalLogin = document.getElementById('modalLogin');

function abrirLogin() {
  modalLogin.classList.add('aberto');
  document.getElementById('loginErro').textContent = '';
  document.getElementById('loginEmail').focus();
}

function fecharLogin() {
  modalLogin.classList.remove('aberto');
}

document.getElementById('modalFechar').addEventListener('click', fecharLogin);

modalLogin.addEventListener('click', function (evento) {
  if (evento.target === modalLogin) {
    fecharLogin();
  }
});

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    fecharLogin();
  }
});

document.getElementById('formLogin').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var usuario = entrar(
    document.getElementById('loginEmail').value,
    document.getElementById('loginSenha').value
  );

  if (!usuario) {
    document.getElementById('loginErro').textContent = 'E-mail ou senha incorretos.';
    return;
  }

  fecharLogin();
  avisar('Bem-vindo de volta, ' + primeiroNome(usuario) + '!');

  setTimeout(function () {
    window.location.reload();
  }, 800);
});

// ---------- botões do cabeçalho ----------
var botaoLogin = document.getElementById('botaoLogin');
var botaoCadastro = document.getElementById('botaoCadastro');
var logado = usuarioAtual();

if (logado) {
  botaoLogin.textContent = 'Sair';
  botaoCadastro.textContent = '👤 ' + primeiroNome(logado);
  botaoCadastro.setAttribute('href', 'perfil.html');

  botaoLogin.addEventListener('click', function (evento) {
    evento.preventDefault();
    sair();
    avisar('Você saiu da conta.');

    setTimeout(function () {
      window.location.href = 'index.html';
    }, 700);
  });
} else {
  botaoCadastro.setAttribute('href', 'cadastro.html');

  botaoLogin.addEventListener('click', function (evento) {
    evento.preventDefault();
    abrirLogin();
  });
}

// ---------- outros links que levam para login, cadastro e perfil ----------
var botaoJaTenhoConta = document.getElementById('botaoJaTenhoConta');
if (botaoJaTenhoConta) {
  botaoJaTenhoConta.addEventListener('click', function (evento) {
    evento.preventDefault();

    if (logado) {
      window.location.href = 'perfil.html';
    } else {
      abrirLogin();
    }
  });
}

var botaoCriarConta = document.getElementById('botaoCriarConta');
if (botaoCriarConta) {
  botaoCriarConta.setAttribute('href', logado ? 'perfil.html' : 'cadastro.html');
}

document.querySelectorAll('a').forEach(function (link) {
  var texto = link.textContent.trim();

  if (texto === 'Perfil' || texto === 'Perfil do Usuário') {
    link.setAttribute('href', 'perfil.html');
  }

  if (texto === 'Página de Cadastro') {
    link.setAttribute('href', 'cadastro.html');
  }

  if (texto === 'Pop-up de Login') {
    link.addEventListener('click', function (evento) {
      evento.preventDefault();
      abrirLogin();
    });
  }
});
