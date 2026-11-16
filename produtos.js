// ---------- elementos da página de produtos ----------
var listaProdutos = document.getElementById('listaProdutos');
var inputBusca = document.getElementById('inputBusca');
var selectOrdenar = document.getElementById('selectOrdenar');
var botoesCategorias = document.querySelectorAll('.categoria');
var contadorProdutos = document.getElementById('contadorProdutos');
var semResultado = document.getElementById('semResultado');

var categoriaAtiva = 'Todos';
var termoBusca = '';
var ordenacaoAtual = 'destaque';

// ---------- desenhar produtos na grade ----------
function desenharProdutos() {
  var filtrados = catalogo.filter(function (produto) {
    var combinaCategoria = (categoriaAtiva === 'Todos' || produto.categoria === categoriaAtiva);
    var combinaBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase());
    return combinaCategoria && combinaBusca;
  });

  // Ordenação
  if (ordenacaoAtual === 'menor-preco') {
    filtrados.sort(function (a, b) { return a.preco - b.preco; });
  } else if (ordenacaoAtual === 'maior-preco') {
    filtrados.sort(function (a, b) { return b.preco - a.preco; });
  } else if (ordenacaoAtual === 'nome') {
    filtrados.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  }

  contadorProdutos.textContent = filtrados.length + ' produtos encontrados';

  if (filtrados.length === 0) {
    listaProdutos.style.display = 'none';
    semResultado.style.display = 'block';
    return;
  }

  listaProdutos.style.display = 'grid';
  semResultado.style.display = 'none';

  var html = '';

  filtrados.forEach(function (produto) {
    // Verifica se o ícone é um ficheiro de imagem ou emoji antigo
    var conteudoFoto = produto.icone.includes('.') 
      ? '<img src="' + produto.icone + '" alt="' + produto.nome + '" style="width: 100%; height: 100%; object-fit: cover;">'
      : produto.icone;

    html += '' +
      '<div class="produto">' +
        '<div class="produto-etiquetas">' +
          '<span class="etiqueta-categoria">' + produto.categoria + '</span>' +
          '<span class="etiqueta-amarela">Disponível</span>' +
        '</div>' +
        '<div class="produto-foto" style="padding: 0; overflow: hidden;">' + conteudoFoto + '</div>' +
        '<h3>' + produto.nome + '</h3>' +
        '<p>Preparado artesanalmente com ingredientes de alta qualidade.</p>' +
        '<span class="cafeina">⚡ Especialidade da Casa</span>' +
        '<div class="produto-rodape">' +
          '<div>' +
            '<small>individual</small>' +
            '<strong>' + formatarPreco(produto.preco) + '</strong>' +
          '</div>' +
          '<button class="botao-adicionar" data-nome="' + produto.nome + '">Adicionar</button>' +
        '</div>' +
      '</div>';
  });

  listaProdutos.innerHTML = html;
}

// ---------- interações (filtros e busca) ----------
if (inputBusca) {
  inputBusca.addEventListener('input', function () {
    termoBusca = this.value;
    desenharProdutos();
  });
}

if (selectOrdenar) {
  selectOrdenar.addEventListener('change', function () {
    ordenacaoAtual = this.value;
    desenharProdutos();
  });
}

botoesCategorias.forEach(function (botao) {
  botao.addEventListener('click', function () {
    botoesCategorias.forEach(function (outro) {
      outro.classList.remove('ativa');
    });
    botao.classList.add('ativa');
    categoriaAtiva = botao.textContent.trim();
    desenharProdutos();
  });
});

// ---------- clique para adicionar ao carrinho a partir da página de produtos ----------
document.addEventListener('click', function (evento) {
  var botao = evento.target.closest('.botao-adicionar');
  if (!botao) {
    return;
  }

  var nome = botao.getAttribute('data-nome');
  adicionarAoCarrinho(nome, 1);
  avisar(nome + ' adicionado ao carrinho!');
});

// Inicia desenhando os produtos na página
desenharProdutos();
