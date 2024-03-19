document.addEventListener('DOMContentLoaded', function() {
    const formAnuncio = document.getElementById('formAnuncio');
    const btnEditar = document.querySelectorAll('.btn-editar');
    const btnExcluir = document.querySelectorAll('.btn-excluir');
    const loadSectionButton = document.getElementById('loadRefeitorioSection');
    const loadAnunciosButton = document.getElementById('loadAnunciosSection');

    if (typeof window.isAdminScriptLoaded === 'undefined' || window.isAdminScriptLoaded === false) {
        carregarConteudoListaAnuncios(paginaAtual);
        const btnRecuar = document.getElementById('btnRecuar');
        btnRecuar.addEventListener('click', recuarAnuncios);
        const btnAvancar = document.getElementById('btnAvancar');
        btnAvancar.addEventListener('click', avancarAnuncios);
    }
    
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validarFormulario()) {
                enviarFormulario();
            }
        });
    }
    
    // Script de validação do formulário
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', function(event) {
            event.preventDefault();
            const tituloAnuncio = document.getElementById('tituloAnuncio').value;
            const conteudoAnuncio = document.getElementById('conteudoAnuncio').value;

            if (!tituloAnuncio || !conteudoAnuncio) {
                alert('Por favor, preencha todos os campos.');
                event.preventDefault(); // Impede o envio do formulário
            }
        });
    }
    
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('btn-editar')) {
            const id = target.getAttribute('data-id');
            editarAnuncio(id);
        } else if (target.classList.contains('btn-excluir')) {
            const id = target.getAttribute('data-id');
            excluirAnuncio(id);
        }
    });

    const btnsEditar = document.querySelectorAll('.edit-reserva-icon');
    btnsEditar.forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            editarAnuncio(id);
        };
    });

    const btnsExcluir = document.querySelectorAll('.delete-reserva-icon');
    btnsExcluir.forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            excluirAnuncio(id);
        };
    });
});

function validarFormulario() {
    const tituloAnuncio = document.getElementById('tituloAnuncio').value;
    const conteudoAnuncio = document.getElementById('conteudoAnuncio').value;

    if (!tituloAnuncio || !conteudoAnuncio) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
}

export function enviarFormulario() {
    const dadosFormulario = {
        tituloAnuncio: document.getElementById('tituloAnuncio').value,
        conteudoAnuncio: document.getElementById('conteudoAnuncio').value
    };

    let url = formAnuncio.action;
    let method = 'POST';

    // Verifica se a ação do formulário é para edição
    if (url.includes('/editar/')) {
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosFormulario)
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na resposta do servidor');
        }
        return response.text();
    })
    .then(data => {
        if (method === 'POST') {
            alert('Anúncio adicionado com sucesso!');
        } else {
            alert('Anúncio atualizado com sucesso!');
        }
        // Recarrega os anúncios na página atual
        carregarConteudoListaAnuncios(paginaAtual);
    })
    .catch(error => {
        alert('Erro: ' + error.message);
    });
}    

export function editarAnuncio(id) {
    fetch(`/admin/anuncios/mostrar/${id}`)
    .then(response => response.json())
    .then(anuncio => {
        // Preencher o formulário com os dados do anúncio
        document.getElementById('tituloAnuncio').value = anuncio.tituloAnuncio;
        document.getElementById('conteudoAnuncio').value = anuncio.conteudoAnuncio;

        // Mudar a ação do formulário para a rota de edição
        const formAnuncio = document.getElementById('formAnuncio');
        formAnuncio.action = `/admin/anuncios/editar/${id}`;
        formAnuncio.method = 'POST'; // Definir o método como POST temporariamente para garantir que os dados sejam enviados corretamente
        formAnuncio.addEventListener('submit', function(event) {
            event.preventDefault(); // Impedir o envio do formulário via método POST padrão
            enviarFormulario(); // Enviar o formulário usando o método correto (PUT)
        });

        // Alterar o texto do botão para indicar edição
        const btnSubmit = formAnuncio.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Editar Anúncio';

        // Rolar até o formulário para facilitar a edição
        formAnuncio.scrollIntoView();
    })
    .catch(error => {
        alert('Erro ao carregar dados do anúncio: ' + error.message);
    });
}

export function excluirAnuncio(id) {
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
        fetch(`/admin/anuncios/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Anúncio excluído com sucesso!');
                // Recarrega os anúncios na página atual
                carregarConteudoListaAnuncios(paginaAtual);
            } else {
                alert('Falha ao excluir o anúncio.');
            }
        })
        .catch(error => {
            alert('Erro ao excluir o anúncio: ' + error.message);
        });
    }
}

let paginaAtual = 1; // Mantém controle da página atual de anúncios
const totalAnuncios = 8; // Número de anúncios por página

export function carregarConteudoListaAnuncios(pagina) {
    return new Promise((resolve, reject) => {
        fetch(`/admin/anuncios/listar?format=json&pagina=${pagina}`)
            .then(response => response.json())
            .then(data => {
                const anuncios = data.anuncios;
                const listaAnunciosDiv = document.getElementById('listaAnuncios');
                listaAnunciosDiv.innerHTML = ''; // Limpa o conteúdo atual
                if (Array.isArray(anuncios)) {
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
                        anuncioElement.classList.add('anuncio-container');
                        anuncioElement.innerHTML = `
                            <h3>${anuncio.tituloAnuncio}</h3>
                            <p>${anuncio.conteudoAnuncio}</p>
                            <h6>Publicado em ${dataFormatada}.</h6>
                            <img src="/images/editar.png" class="edit-reserva-icon" data-id="${anuncio.id}" alt="Editar Anúncio">
                            <img src="/images/excluir.png" class="delete-reserva-icon" data-id="${anuncio.id}" alt="Excluir Anúncio">
                        `;
                        listaAnunciosDiv.appendChild(anuncioElement);
                    });
                    resolve(anuncios); // Resolvendo a promessa com os anúncios
                } else {
                    console.error('Os dados de anúncios não estão no formato esperado.');
                    reject(new Error('Os dados de anúncios não estão no formato esperado.'));
                }
                atualizarVisibilidadeBotoes(); // Atualiza a visibilidade dos botões após carregar os anúncios
                mostrarNumeroPagina(pagina);
                adicionarEventListenersEditarExcluir(); // Adiciona event listeners aos novos ícones de editar e excluir
            })
            .catch(error => {
                console.error('Erro ao carregar a seção de anúncios:', error);
                reject(error); // Rejeita a promessa em caso de erro
            });
    });
}

function adicionarEventListenersEditarExcluir() {
    const btnsEditar = document.querySelectorAll('.edit-reserva-icon');
    btnsEditar.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editarAnuncio(id);
        });
    });

    const btnsExcluir = document.querySelectorAll('.delete-reserva-icon');
    btnsExcluir.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            excluirAnuncio(id);
        });
    });
}

export function adicionarDataPublicacao() {
    const anunciosContainers = document.querySelectorAll('.anuncio-container');
    anunciosContainers.forEach(container => {
        const dataPublicacaoElement = container.querySelector('.data-publicacao');
        const dataPublicacao = new Date(dataPublicacaoElement.dataset.timestamp);
        const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const dataPublicacaoTexto = document.createElement('h6');
        dataPublicacaoTexto.textContent = `Publicado em ${dataFormatada}`;
        container.appendChild(dataPublicacaoTexto);
    });
}

export function limparEstilo() {
    var links = document.querySelectorAll('nav ul li a');
    links.forEach(function(link) {
        link.classList.remove('active');
    });
}

export function recuarAnuncios() {
    if (paginaAtual > 1) {
        paginaAtual--; // Decrementa a página atual apenas uma vez
        carregarConteudoListaAnuncios(paginaAtual).then(() => {
        });
    }
    scrollToFirstAnuncio(); // Rolando para o primeiro anúncio após recuar
    atualizarVisibilidadeBotoes();  // Chamada após retornar para a página anterior
}

export function avancarAnuncios() {
    const nextPage = paginaAtual + 1; // Incrementa a página atual para carregar a próxima página de anúncios
    carregarConteudoListaAnuncios(nextPage).then(anuncios => {
        paginaAtual = nextPage; // Atualiza a página atual depois de carregar os anúncios da próxima página
        scrollToFirstAnuncio(); // Rolando para o primeiro anúncio após avançar
        atualizarVisibilidadeBotoes(); // Chamada após avançar para a próxima página
        if (!anuncios || anuncios.length < totalAnuncios) {
            document.getElementById('btnAvancar').disabled = true;
        } else {
            document.getElementById('btnAvancar').disabled = false; // Habilita o botão de avanço se houver mais anúncios a serem carregados
        }
        // Adicione qualquer outra lógica necessária após carregar os anúncios
    }).catch(error => {
        console.error('Erro ao carregar anúncios:', error);
    });
}

export function scrollToFirstAnuncio() {
    const firstAnuncio = document.getElementById('conteudoAnuncio');
    if (firstAnuncio) {
        firstAnuncio.scrollIntoView({ behavior: 'smooth' });
    }
}

export function mostrarNumeroPagina(pagina) {
    fetch('/admin/anuncios/total')
    .then(response => response.json())
    .then(data => {
        const totalPaginas = Math.ceil(data.total / totalAnuncios); // Calculamos o número total de páginas com base no número total de anúncios
        const paginaAtual = pagina;
        document.getElementById('numeroPagina').innerText= `Página ${paginaAtual} de ${totalPaginas}`;

        atualizarVisibilidadeBotoes(totalPaginas, paginaAtual);
    })
    .catch(error => console.error('Erro ao buscar o total de páginas:', error));
}

export function atualizarVisibilidadeBotoes(totalPaginas, paginaAtual) {
    document.getElementById('btnRecuar').disabled = paginaAtual <= 1;
    document.getElementById('btnAvancar').disabled = paginaAtual >= totalPaginas;
}
