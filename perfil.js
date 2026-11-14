var conteudo = document.getElementById('perfilConteudo');
var bloqueado = document.getElementById('perfilBloqueado');

var usuario = usuarioAtual();

// ---------- sem login: mostra o aviso e abre o pop-up ----------
if (!usuario) {
  conteudo.style.display = 'none';
  bloqueado.style.display = 'block';

  document.getElementById('botaoEntrarPerfil').addEventListener('click', abrirLogin);
  abrirLogin();
} else {
  montarPerfil();
}

// ---------- montar a página com os dados do usuário ----------
function montarPerfil() {
  var pontos = usuario.pontos || 0;
  var meta = 500;

  // cartão do usuário
  var palavras = usuario.nome.trim().split(' ');
  var iniciais = palavras[0].charAt(0);
  if (palavras.length > 1) {
    iniciais = iniciais + palavras[palavras.length - 1].charAt(0);
  }

  var nivel = 'Bronze';
  if (pontos >= 400) {
    nivel = 'Ouro';
  } else if (pontos >= 200) {
    nivel = 'Prata';
  }

  document.getElementById('avatarIniciais').textContent = iniciais.toUpperCase();
  document.getElementById('nivelMembro').textContent = '👑 Membro Coruja Noturna Nível ' + nivel;
  document.getElementById('nomeUsuario').textContent = usuario.nome;
  document.getElementById('emailUsuario').textContent = usuario.email;
  document.getElementById('chipFavorito').textContent = '☕ Favorito: ' + (usuario.favorito || 'ainda não escolhido');
  document.getElementById('chipPedidos').textContent = '🍪 ' + (usuario.pedidos || 0) + ' pedidos realizados';

  // fidelidade
  var porcentagem = Math.min(100, Math.round((pontos / meta) * 100));
  var selos = Math.min(10, Math.floor(pontos / 50));
  var faltam = Math.max(0, meta - pontos);

  document.getElementById('pontosTotal').innerHTML = pontos + ' <span>pts</span>';
  document.getElementById('pontosFaltam').textContent = faltam > 0 ? 'Faltam ' + faltam + ' pts p/ bebida grátis' : 'Bebida grátis liberada!';
  document.getElementById('barraPontos').style.width = porcentagem + '%';
  document.getElementById('selosTexto').textContent = selos + ' de 10 selos noturnos conquistados';
  document.getElementById('porcentagemPontos').textContent = porcentagem + '%';

  // formulário
  document.getElementById('dadosNome').value = usuario.nome;
  document.getElementById('dadosCpf').value = usuario.cpf || '';
  document.getElementById('dadosEmail').value = usuario.email;
  document.getElementById('dadosTelefone').value = usuario.telefone || '';
  document.getElementById('dadosLeite').value = usuario.leite;
  document.getElementById('dadosTorra').value = usuario.torra;

  desenharEnderecos();
  desenharPagamentos();
}

// ---------- resgatar prêmio ----------
document.getElementById('botaoResgatar').addEventListener('click', function () {
  if (!usuario) {
    return;
  }

  var pontos = usuario.pontos || 0;

  if (pontos >= 500) {
    atualizarUsuario(usuario.email, { pontos: pontos - 500 });
    avisar('Prêmio resgatado! Sua bebida grátis foi liberada.');
    setTimeout(function () {
      window.location.reload();
    }, 1200);
  } else {
    avisar('Faltam ' + (500 - pontos) + ' pontos para resgatar sua bebida grátis.');
  }
});

// ---------- máscaras simples ----------
document.getElementById('dadosCpf').addEventListener('input', function () {
  var numeros = this.value.replace(/\D/g, '').slice(0, 11);

  numeros = numeros.replace(/(\d{3})(\d)/, '$1.$2');
  numeros = numeros.replace(/(\d{3})(\d)/, '$1.$2');
  numeros = numeros.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  this.value = numeros;
});

document.getElementById('dadosTelefone').addEventListener('input', function () {
  var numeros = this.value.replace(/\D/g, '').slice(0, 11);

  numeros = numeros.replace(/^(\d{2})(\d)/, '($1) $2');
  numeros = numeros.replace(/(\d{5})(\d{1,4})$/, '$1-$2');

  this.value = numeros;
});

// ---------- salvar dados ----------
document.getElementById('formDados').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var novoEmail = document.getElementById('dadosEmail').value.toLowerCase().trim();

  // não deixa usar o e-mail de outra conta
  var emailEmUso = lerUsuarios().some(function (outro) {
    return outro.email === novoEmail && outro.email !== usuario.email;
  });

  if (emailEmUso) {
    avisar('Esse e-mail já pertence a outra conta.');
    return;
  }

  atualizarUsuario(usuario.email, {
    nome: document.getElementById('dadosNome').value.trim(),
    cpf: document.getElementById('dadosCpf').value,
    email: novoEmail,
    telefone: document.getElementById('dadosTelefone').value,
    leite: document.getElementById('dadosLeite').value,
    torra: document.getElementById('dadosTorra').value
  });

  localStorage.setItem('usuarioLogado', novoEmail);
  avisar('Perfil atualizado com sucesso!');

  setTimeout(function () {
    window.location.reload();
  }, 900);
});

// ---------- endereços ----------
function desenharEnderecos() {
  var lista = usuario.enderecos || [];
  var area = document.getElementById('listaEnderecos');

  if (lista.length === 0) {
    area.innerHTML = '<p class="sem-itens">Nenhum endereço cadastrado ainda. Clique em "+ Novo".</p>';
    return;
  }

  var html = '';

  lista.forEach(function (endereco, posicao) {
    var selo = endereco.principal ? '<em>Principal</em>' : '';
    var marca = endereco.principal ? '<span class="marca-verde">✔</span>' : '';

    html += '' +
      '<button class="endereco ' + (endereco.principal ? 'principal' : '') + '" data-posicao="' + posicao + '">' +
        '<div>' +
          '<b>' + endereco.nome + selo + '</b>' +
          '<span>' + endereco.rua + '</span>' +
          '<span class="cidade">' + endereco.cidade + '</span>' +
        '</div>' +
        marca +
      '</button>';
  });

  area.innerHTML = html;

  // clicar num endereço deixa ele como principal
  area.querySelectorAll('.endereco').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var escolhido = parseInt(botao.getAttribute('data-posicao'));

      usuario.enderecos.forEach(function (endereco, posicao) {
        endereco.principal = posicao === escolhido;
      });

      atualizarUsuario(usuario.email, { enderecos: usuario.enderecos });
      desenharEnderecos();
      avisar('Endereço principal atualizado!');
    });
  });
}

document.getElementById('botaoNovoEndereco').addEventListener('click', function () {
  var nome = prompt('Nome do endereço (ex: Casa da praia):');
  if (!nome) {
    return;
  }

  var rua = prompt('Rua, número e bairro:');
  if (!rua) {
    return;
  }

  var cep = prompt('CEP (ex: 30110-044):');
  if (!cep) {
    return;
  }

  var enderecos = usuario.enderecos || [];

  enderecos.push({
    nome: nome,
    rua: rua,
    cidade: 'Belo Horizonte - MG • CEP ' + cep,
    principal: enderecos.length === 0
  });

  usuario.enderecos = enderecos;
  atualizarUsuario(usuario.email, { enderecos: enderecos });
  desenharEnderecos();
  avisar('Endereço adicionado!');
});

// ---------- pagamento rápido ----------
function desenharPagamentos() {
  var ativo = usuario.pagamentoAtivo || 'cartao';
  var area = document.getElementById('listaPagamentos');

  var formas = [];

  // o cartão só aparece para quem já tem um cadastrado (conta de teste)
  if (usuario.email === 'lucas.mendonca@midnightbrew.com.br') {
    formas.push({ id: 'cartao', icone: '💳', classe: '', titulo: 'Mastercard Black •••• 8492', detalhe: 'Validade 09/2029 • Padrão' });
  }

  formas.push({ id: 'pix', icone: 'PIX', classe: 'pix', titulo: 'PIX Instantâneo (5% Cashback)', detalhe: 'Aprovação imediata 24h' });

  var html = '';

  formas.forEach(function (forma) {
    var estaAtiva = forma.id === ativo;

    html += '' +
      '<button class="forma-pagamento ' + (estaAtiva ? 'ativa' : '') + '" data-forma="' + forma.id + '">' +
        '<span class="icone-pagamento ' + forma.classe + '">' + forma.icone + '</span>' +
        '<span class="texto">' +
          '<b>' + forma.titulo + '</b>' +
          '<span>' + forma.detalhe + '</span>' +
        '</span>' +
        (estaAtiva ? '<span class="status">Ativo</span>' : '') +
      '</button>';
  });

  area.innerHTML = html;

  area.querySelectorAll('.forma-pagamento').forEach(function (botao) {
    botao.addEventListener('click', function () {
      usuario.pagamentoAtivo = botao.getAttribute('data-forma');
      atualizarUsuario(usuario.email, { pagamentoAtivo: usuario.pagamentoAtivo });
      desenharPagamentos();
      avisar('Forma de pagamento atualizada!');
    });
  });
}

// ---------- outros botões ----------
document.getElementById('formBuscaTopo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  window.location.href = 'produtos.html';
});

document.getElementById('formClube').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var email = document.getElementById('emailClube').value;
  document.getElementById('msgClube').textContent = 'Pronto! ' + email + ' agora faz parte do clube.';
  document.getElementById('emailClube').value = '';
});
