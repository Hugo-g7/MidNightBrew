// ---------- lista de pedidos ----------
// etapa: 1 = em preparo, 2 = em rota, 3 = entregue
var pedidos = [
  {
    numero: '#MB-9048',
    data: 'Hoje, 01:15 da madrugada',
    endereco: 'Av. do Contorno, 6500 - Apto 1202, Savassi',
    etapa: 2,
    total: 66.21,
    pagamento: 'PIX (Pago)',
    itens: [
      { quantidade: 2, nome: 'Midnight Nitro Cold Brew', valor: 45.80 },
      { quantidade: 1, nome: 'Brownie Belga Fudge & Flor de Sal', valor: 16.90 }
    ]
  },
  {
    numero: '#MB-8912',
    data: 'Ontem, 23:40',
    endereco: 'Av. do Contorno, 6500 - Apto 1202, Savassi',
    etapa: 3,
    total: 46.40,
    pagamento: 'Mastercard •••• 8492',
    itens: [
      { quantidade: 1, nome: 'Blue Moon Lavender Latte', valor: 24.50 },
      { quantidade: 1, nome: 'Eclipse Dark Mocha 70%', valor: 21.90 }
    ]
  }
];

// ---------- elementos da página ----------
var listaPedidos = document.getElementById('listaPedidos');
var campoBusca = document.getElementById('campoBusca');
var semResultado = document.getElementById('semResultado');
var contadorCarrinho = document.getElementById('contadorCarrinho');
var aviso = document.getElementById('aviso');
var timerAviso;

// ---------- carrinho (guarda o número no navegador) ----------
// o carrinho fica no compartilhado.js

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add('mostrar');

  clearTimeout(timerAviso);
  timerAviso = setTimeout(function () {
    aviso.classList.remove('mostrar');
  }, 2500);
}

function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// ---------- desenhar os pedidos ----------
function desenharPedidos(lista) {
  var html = '';

  lista.forEach(function (pedido) {
    var entregue = pedido.etapa === 3;

    var situacao = entregue
      ? '<span class="situacao concluido">• Concluído</span>'
      : '<span class="situacao a-caminho">• Saiu para entrega</span>';

    // as três etapas
    var etapa1 = '<div class="etapa feita"><span class="etapa-icone">☕</span><div><b>1. Torra &amp; Preparo</b><span>Barista preparando</span></div></div>';
    var etapa2 = '<div class="etapa feita"><span class="etapa-icone">🛵</span><div><b>2. Em Rota Térmica</b><span>Bag selada a caminho</span></div></div>';
    var etapa3 = entregue
      ? '<div class="etapa entregue"><span class="etapa-icone">✔</span><div><b>3. Pedido Entregue</b><span>Aproveite seu Midnight!</span></div></div>'
      : '<div class="etapa pendente"><span class="etapa-icone">✔</span><div><b>3. Pedido Entregue</b><span>Aproveite seu Midnight!</span></div></div>';

    // itens do pedido
    var itens = '';
    pedido.itens.forEach(function (item) {
      itens += '<div class="item-linha">' +
        '<span><i>' + item.quantidade + 'x</i> ' + item.nome + '</span>' +
        '<span>' + formatarPreco(item.valor) + '</span>' +
      '</div>';
    });

    html += '' +
      '<article class="pedido">' +
        '<div class="pedido-topo">' +
          '<div class="pedido-identificacao">' +
            '<span class="numero-pedido">' + pedido.numero + '</span>' +
            '<div>' +
              '<div class="pedido-data">' + pedido.data + '</div>' +
              '<div class="pedido-endereco">' + pedido.endereco + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="pedido-valor">' +
            situacao +
            '<div class="pedido-total"><small>Total do Pedido</small><strong>' + formatarPreco(pedido.total) + '</strong></div>' +
          '</div>' +
        '</div>' +

        '<div class="etapas">' + etapa1 + etapa2 + etapa3 + '</div>' +

        '<div class="itens">' +
          '<h4>ITENS INCLUÍDOS NESTE PEDIDO:</h4>' +
          itens +
        '</div>' +

        '<div class="pedido-rodape">' +
          '<span class="pagamento">Forma de pagamento: <b>' + pedido.pagamento + '</b></span>' +
          '<button class="botao-repetir" data-numero="' + pedido.numero + '">⟳ Pedir Novamente</button>' +
        '</div>' +
      '</article>';
  });

  listaPedidos.innerHTML = html;
  semResultado.style.display = lista.length === 0 ? 'block' : 'none';

  // botões de pedir novamente
  var botoes = document.querySelectorAll('.botao-repetir');
  botoes.forEach(function (botao) {
    botao.addEventListener('click', function () {
      var numero = botao.getAttribute('data-numero');

      var pedido = pedidos.find(function (p) {
        return p.numero === numero;
      });

      pedido.itens.forEach(function (item) {
        adicionarAoCarrinho(item.nome, item.quantidade);
      });

      mostrarAviso('Itens do pedido ' + numero + ' adicionados ao carrinho!');
    });
  });
}

// ---------- buscar por número ou item ----------
function buscarPedidos(texto) {
  var termo = texto.toLowerCase().trim();

  var resultado = pedidos.filter(function (pedido) {
    var conteudo = pedido.numero.toLowerCase();

    pedido.itens.forEach(function (item) {
      conteudo += ' ' + item.nome.toLowerCase();
    });

    return termo === '' || conteudo.indexOf(termo) !== -1;
  });

  desenharPedidos(resultado);
}

campoBusca.addEventListener('input', function () {
  buscarPedidos(campoBusca.value);
});

// busca do cabeçalho joga o texto no campo da página
document.getElementById('formBuscaTopo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  campoBusca.value = document.getElementById('campoBuscaTopo').value;
  buscarPedidos(campoBusca.value);
});

// os botões de login e cadastro ficam no conta.js

document.getElementById('formClube').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var email = document.getElementById('emailClube').value;
  document.getElementById('msgClube').textContent = 'Pronto! ' + email + ' agora faz parte do clube.';
  document.getElementById('emailClube').value = '';
});

// começa mostrando todos
desenharPedidos(pedidos);
