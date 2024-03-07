document.addEventListener('DOMContentLoaded', function() {    
    carregarAnunciosRecentes();

    // Exemplo de ouvinte de evento para um botão
    document.querySelectorAll('.btnReservar').forEach(btn => {
        btn.addEventListener('click', function() {
            const recurso = this.getAttribute('data-recurso');
            window.location.href = `/reserva?recurso=${recurso}`;
        });
    });        
    // Outros ouvintes de eventos conforme necessário
});

document.querySelectorAll('button[data-recurso]').forEach(btn => {
    btn.addEventListener('click', function() {
        const recurso = this.getAttribute('data-recurso');
        window.location.href = `/reserva?recurso=${recurso}`;
    });
});


document.querySelectorAll('button[data-recurso]').forEach(btn => {
    btn.addEventListener('click', function() {
        const recurso = this.getAttribute('data-recurso');
        window.location.href = `/reserva?recurso=${recurso}`;
    });
});
        
    // Outros ouvintes de eventos conforme necessário

let paginaAtual = 1; // Mantém controle da página atual de anúncios
const totalAnuncios = 8; // Número de anúncios por página

document.addEventListener('DOMContentLoaded', function() {
    carregarAnunciosRecentes(paginaAtual);
    document.getElementById('btnRecuar').addEventListener('click', recuarAnuncios);
    document.getElementById('btnAvancar').addEventListener('click', avancarAnuncios);
});

function recuarAnuncios() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarAnunciosRecentes(paginaAtual).then(() => {
            scrollToFirstAnuncio(); // Rolando para o primeiro anúncio após recuar
            atualizarVisibilidadeBotoes();  // Chamada após retornar para a página anterior
        });
    }
}

function avancarAnuncios() {
    paginaAtual++;
    carregarAnunciosRecentes(paginaAtual).then(anuncios => {
        scrollToFirstAnuncio(); // Rolando para o primeiro anúncio após avançar
        atualizarVisibilidadeBotoes();  // Chamada após avançar para a próxima página
        if (!anuncios || anuncios.length < totalAnuncios) {
            document.getElementById('btnAvancar').disabled = true;
        }
        // Adicione qualquer outra lógica necessária após carregar os anúncios
    }).catch(error => {
        console.error('Erro ao carregar anúncios:', error);
    });
}

function carregarAnunciosRecentes(pagina) {
    return fetch(`/admin/anuncios/recentes?pagina=${pagina}`) // Adiciona return aqui
    .then(response => response.json())
    .then(anuncios => {
        const conteudoAnunciosDiv = document.getElementById('conteudoAnuncios');
        conteudoAnunciosDiv.innerHTML = '';

        anuncios.forEach((anuncio, index) => {
            const dataPublicacao = new Date(anuncio.dataPublicacao);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const anuncioElement = document.createElement('div');
            anuncioElement.innerHTML = `
                <p id="anuncio${index + 1}"><img class="anuncio-icon" src="/images/anunciosRecentes.png"> <b>${anuncio.tituloAnuncio}:</b> ${anuncio.conteudoAnuncio}</p>
                <h6>Publicado em ${dataFormatada}.</h6>
            `;
            conteudoAnunciosDiv.appendChild(anuncioElement);
        });
        return anuncios; // Garante que anúncios sejam retornados
    }).then(() => {
        atualizarVisibilidadeBotoes(); 
    })
    .catch(error => console.error('Erro ao carregar anúncios:', error));
}

function scrollToFirstAnuncio() {
    const firstAnuncio = document.getElementById('anunciosRecentes');
    if (firstAnuncio) {
        firstAnuncio.scrollIntoView({ behavior: 'smooth' });
    }
}

function atualizarVisibilidadeBotoes() {
    fetch('/admin/anuncios/total')
    .then(response => response.json())
    .then(data => {
        const totalPaginas = Math.ceil(data.total / totalAnuncios);
        document.getElementById('btnRecuar').disabled = paginaAtual <= 1;
        document.getElementById('btnAvancar').disabled = paginaAtual >= totalPaginas;
    })
    .catch(error => console.error('Erro ao buscar o total de anúncios:', error));
}

