// ---------- lista de produtos ----------
var produtos = [
  { nome: 'Midnight Nitro Cold Brew', categoria: 'Iced & Cold Brew', etiqueta: 'Mais Vendido', preco: 22.90, cafeina: 'Extra Forte', icone: '🥤',
    descricao: 'Infusão a frio por 18 horas com gás nitrogênio, criando uma espuma cremosa aveludada e notas intensas de cacau 70%.' },
  { nome: 'Blue Moon Lavender Latte', categoria: 'Especiais da Meia-Noite', etiqueta: 'Assinatura da Casa', preco: 24.50, cafeina: 'Média', icone: '☕',
    descricao: 'Espresso duplo 100% Arábica, leite vaporizado cremoso, calda artesanal de baunilha do Madagascar e toque azul lavanda.' },
  { nome: 'Eclipse Dark Mocha 70%', categoria: 'Cafés Quentes', etiqueta: 'Favorito', preco: 21.90, cafeina: 'Alta', icone: '🥛',
    descricao: 'Combinação intensa de espresso duplo, ganache de chocolate belga meio amargo, leite de aveia vaporizado e raspas de cacau.' },
  { nome: 'Croissant Folhado de Amêndoas', categoria: 'Doces & Salgados', etiqueta: 'Forno Noturno', preco: 18.90, cafeina: 'Sem Cafeína', icone: '🥐',
    descricao: 'Massa folhada francesa com manteiga extra, recheada com creme frangipane de amêndoas tostadas e açúcar de confeiteiro.' },

  { nome: 'Espresso Duplo Insônia', categoria: 'Cafés Quentes', etiqueta: 'Puro Energia', preco: 12.90, cafeina: 'Extrema', icone: '⚡',
    descricao: 'Dose dupla extraída a 9 bar de pressão com grãos de torra escura noturna. Corpo denso e crema aveludada persistente.' },
  { nome: 'Caramel Salted Night Macchiato', categoria: 'Cafés Quentes', etiqueta: '', preco: 23.00, cafeina: 'Média', icone: '☕',
    descricao: 'Leite vaporizado manchado com espresso intenso, calda de caramelo artesanal com flor de sal e espuma cremosa.' },
  { nome: 'Iced Vanilla Sweet Cream Brew', categoria: 'Iced & Cold Brew', etiqueta: 'Refrescante', preco: 23.90, cafeina: 'Alta', icone: '🥤',
    descricao: 'Cold brew extraído lentamente servido com gelo cristalino e finalizado com cascata de creme doce de baunilha.' },
  { nome: 'Orange Tonic Espresso', categoria: 'Iced & Cold Brew', etiqueta: 'Tendência', preco: 21.50, cafeina: 'Alta', icone: '🍊',
    descricao: 'Água tônica artesanal sobre gelo, suco de laranja bahia fresca e um shot de espresso flutuante com ramo de alecrim.' },

  { nome: 'Nebula Pistachio Frappé', categoria: 'Especiais da Meia-Noite', etiqueta: 'Edição Limitada', preco: 27.90, cafeina: 'Média', icone: '🧋',
    descricao: 'Bebida gelada batida com pasta pura de pistache italiano, espresso, chantilly artesanal e farofa crocante de pistache.' },
  { nome: 'Chai Latte Estrelado (Sem Café)', categoria: 'Especiais da Meia-Noite', etiqueta: 'Relaxante', preco: 19.90, cafeina: 'Baixa', icone: '🍵',
    descricao: 'Infusão indiana de chá preto com cardamomo, canela, gengibre, cravo e leite cremoso vaporizado.' },
  { nome: 'Brownie Belga Fudge & Flor de Sal', categoria: 'Doces & Salgados', etiqueta: 'Quentinho', preco: 16.90, cafeina: 'Sem Cafeína', icone: '🍫',
    descricao: 'Brownie denso por dentro e casquinha crocante por fora, feito com chocolate 70% cacau e nozes pecã.' },
  { nome: 'Toast Brioche Queijo Brie & Mel', categoria: 'Doces & Salgados', etiqueta: 'Salgado Gourmet', preco: 24.90, cafeina: 'Sem Cafeína', icone: '🥪',
    descricao: 'Pão brioche de fermentação natural tostado na manteiga com queijo Brie derretido, mel trufado e lâminas de amêndoa.' }
];

// ---------- elementos da página ----------
var listaProdutos = document.getElementById('listaProdutos');
var campoBusca = document.getElementById('campoBusca');
var campoOrdem = document.getElementById('campoOrdem');
var contagem = document.getElementById('contagem');
var semResultado = document.getElementById('semResultado');
var botoesCategoria = document.querySelectorAll('.categoria');
var contadorCarrinho = document.getElementById('contadorCarrinho');
var aviso = document.getElementById('aviso');

var categoriaAtual = 'todos';
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

// ---------- desenhar os cards ----------
function desenharProdutos(lista) {
  var html = '';

  lista.forEach(function (produto, posicao) {
    var etiqueta = '';
    if (produto.etiqueta !== '') {
      etiqueta = '<span class="etiqueta-amarela">' + produto.etiqueta + '</span>';
    }

    html += '' +
      '<article class="produto">' +
        '<div class="produto-etiquetas">' +
          '<span class="etiqueta-categoria">' + produto.categoria.toUpperCase() + '</span>' +
          etiqueta +
        '</div>' +
        '<div class="produto-foto">' + produto.icone + '</div>' +
        '<h3>' + produto.nome + '</h3>' +
        '<p>' + produto.descricao + '</p>' +
        '<span class="cafeina">⚡ Cafeína: ' + produto.cafeina + '</span>' +
        '<div class="produto-rodape">' +
          '<div>' +
            '<small>VALOR UNITÁRIO</small>' +
            '<strong>' + formatarPreco(produto.preco) + '</strong>' +
          '</div>' +
          '<button class="botao-adicionar" data-nome="' + produto.nome + '">⊕ Adicionar</button>' +
        '</div>' +
      '</article>';
  });

  listaProdutos.innerHTML = html;

  contagem.textContent = 'Mostrando ' + lista.length + ' produto(s)';
  semResultado.style.display = lista.length === 0 ? 'block' : 'none';

  // botões de adicionar
  var botoes = document.querySelectorAll('.botao-adicionar');
  botoes.forEach(function (botao) {
    botao.addEventListener('click', function () {
      var nome = botao.getAttribute('data-nome');
      adicionarAoCarrinho(nome, 1);

      mostrarAviso(nome + ' adicionado ao carrinho!');
    });
  });
}

// ---------- filtrar e ordenar ----------
function atualizarLista() {
  var termo = campoBusca.value.toLowerCase().trim();
  var ordem = campoOrdem.value;

  var resultado = produtos.filter(function (produto) {
    var daCategoria = categoriaAtual === 'todos' || produto.categoria === categoriaAtual;

    var texto = (produto.nome + ' ' + produto.descricao + ' ' + produto.categoria + ' ' + produto.cafeina).toLowerCase();
    var daBusca = termo === '' || texto.indexOf(termo) !== -1;

    return daCategoria && daBusca;
  });

  if (ordem === 'menor') {
    resultado.sort(function (a, b) { return a.preco - b.preco; });
  } else if (ordem === 'maior') {
    resultado.sort(function (a, b) { return b.preco - a.preco; });
  } else if (ordem === 'nome') {
    resultado.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  }

  desenharProdutos(resultado);
}

// ---------- eventos ----------
campoBusca.addEventListener('input', atualizarLista);
campoOrdem.addEventListener('change', atualizarLista);

botoesCategoria.forEach(function (botao) {
  botao.addEventListener('click', function () {
    botoesCategoria.forEach(function (outro) {
      outro.classList.remove('ativa');
    });
    botao.classList.add('ativa');

    categoriaAtual = botao.getAttribute('data-categoria');
    atualizarLista();
  });
});

// busca do cabeçalho joga o texto no campo da página
document.getElementById('formBuscaTopo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  campoBusca.value = document.getElementById('campoBuscaTopo').value;
  atualizarLista();
});

// os botões de login e cadastro ficam no conta.js

document.getElementById('formClube').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var email = document.getElementById('emailClube').value;
  document.getElementById('msgClube').textContent = 'Pronto! ' + email + ' agora faz parte do clube.';
  document.getElementById('emailClube').value = '';
});

// começa mostrando tudo
atualizarLista();
