// código usado por todas as páginas do site (carrinho e lista de produtos)

var catalogo = [
  { nome: 'Midnight Nitro Cold Brew', categoria: 'Iced & Cold Brew', preco: 22.90, icone: 'iced-vanilla-sweet-cream.jpg' },
  { nome: 'Blue Moon Lavender Latte', categoria: 'Especiais da Meia-Noite', preco: 24.50, icone: 'chai-latte-estrelado.jpg' },
  { nome: 'Eclipse Dark Mocha 70%', categoria: 'Cafés Quentes', preco: 21.90, icone: 'caramel-salted-macchiato.jpg' },
  { nome: 'Croissant Folhado de Amêndoas', categoria: 'Doces & Salgados', preco: 18.90, icone: 'brownie-belga-fudge.jpg' },
  { nome: 'Espresso Duplo Insônia', categoria: 'Cafés Quentes', preco: 12.90, icone: 'espresso-duplo-insonia.jpg' },
  { nome: 'Caramel Salted Night Macchiato', categoria: 'Cafés Quentes', preco: 23.00, icone: 'caramel-salted-macchiato.jpg' },
  { nome: 'Iced Vanilla Sweet Cream Brew', categoria: 'Iced & Cold Brew', preco: 23.90, icone: 'iced-vanilla-sweet-cream.jpg' },
  { nome: 'Orange Tonic Espresso', categoria: 'Iced & Cold Brew', preco: 21.50, icone: 'orange-tonic-espresso.jpg' },
  { nome: 'Nebula Pistachio Frappé', categoria: 'Especiais da Meia-Noite', preco: 27.90, icone: 'nebula-pistachio-frappe.jpg' },
  { nome: 'Chai Latte Estrelado (Sem Café)', categoria: 'Especiais da Meia-Noite', preco: 19.90, icone: 'chai-latte-estrelado.jpg' },
  { nome: 'Brownie Belga Fudge & Flor de Sal', categoria: 'Doces & Salgados', preco: 16.90, icone: 'brownie-belga-fudge.jpg' },
  { nome: 'Toast Brioche Queijo Brie & Mel', categoria: 'Doces & Salgados', preco: 24.90, icone: 'toast-brioche-brie.jpg' }
];

function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function buscarProduto(nome) {
  return catalogo.find(function (produto) {
    return produto.nome === nome;
  });
}

function lerCarrinho() {
  try {
    var salvo = localStorage.getItem('itensCarrinho');
    if (salvo) {
      return JSON.parse(salvo);
    }
  } catch (erro) {}

  return [
    { nome: 'Midnight Nitro Cold Brew', qtd: 1 },
    { nome: 'Blue Moon Lavender Latte', qtd: 2 },
    { nome: 'Croissant Folhado de Amêndoas', qtd: 1 }
  ];
}

function totalDeItens(lista) {
  var total = 0;
  lista.forEach(function (item) {
    total = total + item.qtd;
  });
  return total;
}

function atualizarContador() {
  var contador = document.getElementById('contadorCarrinho');
  if (contador) {
    contador.textContent = totalDeItens(lerCarrinho());
  }
}

function salvarCarrinho(lista) {
  localStorage.setItem('itensCarrinho', JSON.stringify(lista));
  atualizarContador();
}

function adicionarAoCarrinho(nome, quantidade) {
  var lista = lerCarrinho();
  var existente = lista.find(function (item) {
    return item.nome === nome;
  });

  if (existente) {
    existente.qtd = existente.qtd + quantidade;
  } else {
    lista.push({ nome: nome, qtd: quantidade });
  }

  salvarCarrinho(lista);
}

atualizarContador();

// ---------- MODO ESCURO / CLARO ----------
(function iniciarTema() {
  // 1. Verifica se o utilizador já tinha escolhido o modo claro anteriormente
  if (localStorage.getItem('temaMidnight') === 'claro') {
    document.body.classList.add('modo-claro');
  }

  // 2. Cria o botão no menu do cabeçalho automaticamente
  var menu = document.querySelector('.menu');
  if (!menu) return;

  var botaoTema = document.createElement('button');
  botaoTema.type = 'button';
  botaoTema.className = 'botao-tema';
  botaoTema.title = 'Alternar modo claro/escuro';

  function atualizarIconeTema() {
    var claroAtivo = document.body.classList.contains('modo-claro');
    botaoTema.textContent = claroAtivo ? '🌙' : '☀️';
  }

  atualizarIconeTema();

  botaoTema.addEventListener('click', function () {
    document.body.classList.toggle('modo-claro');
    var claroAtivo = document.body.classList.contains('modo-claro');
    localStorage.setItem('temaMidnight', claroAtivo ? 'claro' : 'escuro');
    atualizarIconeTema();
  });

  menu.appendChild(botaoTema);
})();
