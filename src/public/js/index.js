function carregarAnunciosRecentes() {
    fetch('/admin/anuncios/recentes')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: Status ${response.status}`);
        }
        return response.json();
    })
    .then(anuncios => {
        const conteudoAnunciosDiv = document.getElementById('conteudoAnuncios');
        conteudoAnunciosDiv.innerHTML = '';

        // Verifica se 'anuncios' é um array
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
            console.error('A resposta não é um array:', anuncios);
        }
    })
    .catch(error => {
        console.error('Erro ao carregar anúncios:', error);
        // Aqui você pode adicionar uma mensagem de erro no DOM, se desejar
    });
}


function carregarAnunciosRecentes() {
    fetch('/admin/anuncios/recentes')
    .then(response => response.json())
    .then(anuncios => {
        const conteudoAnunciosDiv = document.getElementById('conteudoAnuncios');
        conteudoAnunciosDiv.innerHTML = '';

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
    })
    .catch(error => console.error('Erro ao carregar anúncios:', error));
}


