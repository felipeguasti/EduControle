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

function carregarAnunciosRecentes() {
    fetch('/admin/anuncios/recentes')
    .then(response => response.json())
    .then(anuncios => {
        const conteudoAnunciosDiv = document.getElementById('conteudoAnuncios');
        conteudoAnunciosDiv.innerHTML = '';

        if (Array.isArray(anuncios)) {
            anuncios.forEach(anuncio => {
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
                    <p><img class="anuncio-icon" src="/images/anunciosRecentes.png"> <b>${anuncio.tituloAnuncio}:</b> ${anuncio.conteudoAnuncio}</p>
                    <h6>Publicado em ${dataFormatada}.</h6>
                `;            
                conteudoAnunciosDiv.appendChild(anuncioElement);
            });
        } else {
            console.error('Os dados retornados não são uma matriz:', anuncios);
        }
    })
    .catch(error => console.error('Erro ao carregar anúncios:', error));
}
