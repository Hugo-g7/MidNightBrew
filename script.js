// ---------- elementos da página ----------
var contadorCarrinho = document.getElementById('contadorCarrinho');
var aviso = document.getElementById('aviso');
var listaProdutos = document.getElementById('listaProdutos');
var avisoBusca = document.getElementById('avisoBusca');
var produtos = document.querySelectorAll('.produto');
var botoesAdicionar = document.querySelectorAll('.botao-adicionar');

var timerAviso;

// ---------- aviso flutuante ----------
function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add('mostrar');

  clearTimeout(timerAviso);
  timerAviso = setTimeout(function () {
    aviso.classList.remove('mostrar');
  }, 2500);
}

// ---------- adicionar ao carrinho ----------
botoesAdicionar.forEach(function (botao) {
  botao.addEventListener('click', function () {
    var produto = botao.closest('.produto');
    var nome = produto.querySelector('h3').textContent;

    adicionarAoCarrinho(nome, 1);

    mostrarAviso(nome + ' adicionado ao carrinho!');
  });
});

// ---------- buscar produtos ----------
function buscarProdutos(texto) {
  var termo = texto.toLowerCase().trim();
  var encontrados = 0;

  produtos.forEach(function (produto) {
    var nome = produto.getAttribute('data-nome');

    if (termo === '' || nome.indexOf(termo) !== -1) {
      produto.classList.remove('escondido');
      encontrados = encontrados + 1;
    } else {
      produto.classList.add('escondido');
    }
  });

  if (termo === '') {
    avisoBusca.style.display = 'none';
  } else if (encontrados === 0) {
    avisoBusca.style.display = 'block';
    avisoBusca.textContent = 'Nenhum item encontrado para "' + texto + '".';
  } else {
    avisoBusca.style.display = 'block';
    avisoBusca.textContent = encontrados + ' item(ns) encontrado(s) para "' + texto + '".';
  }

  document.getElementById('favoritos').scrollIntoView();
}

document.getElementById('formBuscaTopo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  buscarProdutos(document.getElementById('campoBuscaTopo').value);
});

document.getElementById('formBuscaDestaque').addEventListener('submit', function (evento) {
  evento.preventDefault();
  buscarProdutos(document.getElementById('campoBuscaDestaque').value);
});

// mostrar todos de novo
document.getElementById('botaoCardapioCompleto').addEventListener('click', function () {
  document.getElementById('campoBuscaTopo').value = '';
  document.getElementById('campoBuscaDestaque').value = '';
  buscarProdutos('');
});

// ---------- copiar cupom ----------
document.getElementById('cupom').addEventListener('click', function () {
  var codigo = this.textContent;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(codigo);
  }

  mostrarAviso('Cupom ' + codigo + ' copiado!');
});

// ---------- botões de login e cadastro ----------
// os botões de login e cadastro ficam no conta.js

// ---------- newsletter do clube ----------
document.getElementById('formClube').addEventListener('submit', function (evento) {
  evento.preventDefault();

  var email = document.getElementById('emailClube').value;
  document.getElementById('msgClube').textContent = 'Pronto! ' + email + ' agora faz parte do clube.';
  document.getElementById('emailClube').value = '';
});

// ---------- menu ativo conforme a rolagem ----------
var linksMenu = document.querySelectorAll('.menu-link');

window.addEventListener('scroll', function () {
  var posicao = window.scrollY + 140;
  var favoritos = document.getElementById('favoritos').offsetTop;

  linksMenu.forEach(function (link) {
    link.classList.remove('ativo');
  });

  if (posicao >= favoritos) {
    linksMenu[1].classList.add('ativo');
  } else {
    linksMenu[0].classList.add('ativo');
  }
});
