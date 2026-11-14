// ---------- elementos da página ----------
var listaItens = document.getElementById('listaItens');
var sugestoesLista = document.getElementById('sugestoesLista');
var carrinhoCheio = document.getElementById('carrinhoCheio');
var carrinhoVazio = document.getElementById('carrinhoVazio');
var campoCupom = document.getElementById('campoCupom');
var dicaCupom = document.getElementById('dicaCupom');
var aviso = document.getElementById('aviso');

var modalidade = 'delivery';
var cupomAtivo = true;
var taxaDelivery = 6.90;
var timerAviso;

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add('mostrar');

  clearTimeout(timerAviso);
  timerAviso = setTimeout(function () {
    aviso.classList.remove('mostrar');
  }, 2500);
}

// ---------- desenhar itens do carrinho ----------
function desenharCarrinho() {
  var itens = lerCarrinho();

  if (itens.length === 0) {
    carrinhoCheio.style.display = 'none';
    carrinhoVazio.style.display = 'block';
    return;
  }

  carrinhoCheio.style.display = 'flex';
  carrinhoVazio.style.display = 'none';

  var html = '';
  var subtotal = 0;

  itens.forEach(function (item) {
    var produto = buscarProduto(item.nome);
    var subtotalItem = produto.preco * item.qtd;
    subtotal = subtotal + subtotalItem;

    html += '' +
      '<article class="item-carrinho">' +
        '<div class="item-foto">' + produto.icone + '</div>' +
        '<div class="item-dados">' +
          '<small>' + produto.categoria + '</small>' +
          '<h3>' + produto.nome + '</h3>' +
          '<span>Unitário: ' + formatarPreco(produto.preco) + '</span>' +
        '</div>' +
        '<div class="quantidade">' +
          '<button data-acao="menos" data-nome="' + item.nome + '">-</button>' +
          '<b>' + item.qtd + '</b>' +
          '<button data-acao="mais" data-nome="' + item.nome + '">+</button>' +
        '</div>' +
        '<div class="item-subtotal">' +
          '<small>Subtotal</small>' +
          '<strong>' + formatarPreco(subtotalItem) + '</strong>' +
        '</div>' +
        '<button class="botao-lixeira" data-acao="remover" data-nome="' + item.nome + '" title="Remover item">🗑</button>' +
      '</article>';
  });

  listaItens.innerHTML = html;

  desenharSugestoes(itens);
  calcularResumo(subtotal);
}

// ---------- sugestões ----------
function desenharSugestoes(itens) {
  var nomesNoCarrinho = itens.map(function (item) {
    return item.nome;
  });

  var candidatos = [
    'Eclipse Dark Mocha 70%',
    'Espresso Duplo Insônia',
    'Caramel Salted Night Macchiato',
    'Brownie Belga Fudge & Flor de Sal'
  ];

  var sugeridos = candidatos.filter(function (nome) {
    return nomesNoCarrinho.indexOf(nome) === -1;
  }).slice(0, 2);

  var html = '';
  sugeridos.forEach(function (nome) {
    var produto = buscarProduto(nome);

    html += '' +
      '<div class="sugestao">' +
        '<div>' +
          '<b>' + produto.nome + '</b>' +
          '<span>+ ' + formatarPreco(produto.preco) + '</span>' +
        '</div>' +
        '<button data-acao="sugestao" data-nome="' + produto.nome + '">Adicionar</button>' +
      '</div>';
  });

  sugestoesLista.innerHTML = html;
  document.getElementById('sugestoes').style.display = sugeridos.length === 0 ? 'none' : 'block';
}

// ---------- resumo do pedido ----------
function calcularResumo(subtotal) {
  var entrega = modalidade === 'delivery' ? taxaDelivery : 0;
  var desconto = cupomAtivo ? subtotal * 0.10 : 0;
  var total = subtotal + entrega - desconto;

  document.getElementById('valorSubtotal').textContent = formatarPreco(subtotal);
  document.getElementById('valorEntrega').textContent = formatarPreco(entrega);
  document.getElementById('valorDesconto').textContent = '- ' + formatarPreco(desconto);
  document.getElementById('valorTotal').textContent = formatarPreco(total);
}

// ---------- cliques na lista (mais, menos, remover, sugestão) ----------
document.addEventListener('click', function (evento) {
  var botao = evento.target.closest('[data-acao]');
  if (!botao) {
    return;
  }

  var acao = botao.getAttribute('data-acao');
  var nome = botao.getAttribute('data-nome');
  var itens = lerCarrinho();

  var item = itens.find(function (outro) {
    return outro.nome === nome;
  });

  if (acao === 'sugestao') {
    adicionarAoCarrinho(nome, 1);
    mostrarAviso(nome + ' adicionado ao carrinho!');
  }

  if (acao === 'mais') {
    item.qtd = item.qtd + 1;
    salvarCarrinho(itens);
  }

  if (acao === 'menos' && item.qtd > 1) {
    item.qtd = item.qtd - 1;
    salvarCarrinho(itens);
  }

  if (acao === 'remover') {
    itens = itens.filter(function (outro) {
      return outro.nome !== nome;
    });
    salvarCarrinho(itens);
    mostrarAviso(nome + ' removido do carrinho.');
  }

  desenharCarrinho();
});

// ---------- modalidade de recebimento ----------
var botoesModalidade = document.querySelectorAll('.modalidade');

botoesModalidade.forEach(function (botao) {
  botao.addEventListener('click', function () {
    botoesModalidade.forEach(function (outro) {
      outro.classList.remove('ativa');
    });
    botao.classList.add('ativa');

    modalidade = botao.getAttribute('data-modo');
    desenharCarrinho();
  });
});

// ---------- cupom ----------
document.getElementById('botaoAplicar').addEventListener('click', function () {
  var codigo = campoCupom.value.toUpperCase().trim();

  if (codigo === 'MIDNIGHT10') {
    cupomAtivo = true;
    dicaCupom.className = 'dica-cupom';
    dicaCupom.textContent = 'Cupom MIDNIGHT10 aplicado: 10% OFF ativado!';
  } else {
    cupomAtivo = false;
    dicaCupom.className = 'dica-cupom erro';
    dicaCupom.textContent = 'Cupom inválido. Tente MIDNIGHT10.';
  }

  desenharCarrinho();
});

// ---------- confirmar pedido ----------
document.getElementById('botaoConfirmar').addEventListener('click', function () {
  if (lerCarrinho().length === 0) {
    return;
  }

  mostrarAviso('Pedido enviado! Acompanhe em Meus Pedidos.');
  salvarCarrinho([]);

  setTimeout(function () {
    window.location.href = 'pedidos.html';
  }, 1500);
});

// ---------- outros botões do site ----------
document.getElementById('formBuscaTopo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  window.location.href = 'produtos.html';
});

// os botões de login e cadastro ficam no conta.js

document.getElementById('formClube').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var email = document.getElementById('emailClube').value;
  document.getElementById('msgClube').textContent = 'Pronto! ' + email + ' agora faz parte do clube.';
  document.getElementById('emailClube').value = '';
});

// começa desenhando o carrinho
desenharCarrinho();
