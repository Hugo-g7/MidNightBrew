// código usado por todas as páginas do site (carrinho e lista de produtos)

var catalogo = [
  { nome: 'Midnight Nitro Cold Brew', categoria: 'Iced & Cold Brew', preco: 22.90, icone: '🥤' },
  { nome: 'Blue Moon Lavender Latte', categoria: 'Especiais da Meia-Noite', preco: 24.50, icone: '☕' },
  { nome: 'Eclipse Dark Mocha 70%', categoria: 'Cafés Quentes', preco: 21.90, icone: '🥛' },
  { nome: 'Croissant Folhado de Amêndoas', categoria: 'Doces & Salgados', preco: 18.90, icone: '🥐' },
  { nome: 'Espresso Duplo Insônia', categoria: 'Cafés Quentes', preco: 12.90, icone: '⚡' },
  { nome: 'Caramel Salted Night Macchiato', categoria: 'Cafés Quentes', preco: 23.00, icone: '☕' },
  { nome: 'Iced Vanilla Sweet Cream Brew', categoria: 'Iced & Cold Brew', preco: 23.90, icone: '🥤' },
  { nome: 'Orange Tonic Espresso', categoria: 'Iced & Cold Brew', preco: 21.50, icone: '🍊' },
  { nome: 'Nebula Pistachio Frappé', categoria: 'Especiais da Meia-Noite', preco: 27.90, icone: '🧋' },
  { nome: 'Chai Latte Estrelado (Sem Café)', categoria: 'Especiais da Meia-Noite', preco: 19.90, icone: '🍵' },
  { nome: 'Brownie Belga Fudge & Flor de Sal', categoria: 'Doces & Salgados', preco: 16.90, icone: '🍫' },
  { nome: 'Toast Brioche Queijo Brie & Mel', categoria: 'Doces & Salgados', preco: 24.90, icone: '🥪' }
];

function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function buscarProduto(nome) {
  return catalogo.find(function (produto) {
    return produto.nome === nome;
  });
}

// carrinho: lista de { nome, qtd } guardada no navegador
function lerCarrinho() {
  try {
    var salvo = localStorage.getItem('itensCarrinho');
    if (salvo) {
      return JSON.parse(salvo);
    }
  } catch (erro) {
    // se der erro, usa o carrinho inicial abaixo
  }

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
