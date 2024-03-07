document.addEventListener('DOMContentLoaded', function() {
    const formAnuncio = document.getElementById('formAnuncio');
    const btnEditar = document.querySelectorAll('.btn-editar');
    const btnExcluir = document.querySelectorAll('.btn-excluir');
    const loadSectionButton = document.getElementById('loadRefeitorioSection');
    const loadAnunciosButton = document.getElementById('loadAnunciosSection');

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
            // Implementar funções editarAnuncio e excluirAnuncio em admin.js
        });
    }

    const adminContentSection = document.getElementById('adminContentSection');

    adminContentSection.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('btn-editar')) {
            const id = target.getAttribute('data-id');
            editarAnuncio(id);
        } else if (target.classList.contains('btn-excluir')) {
            const id = target.getAttribute('data-id');
            excluirAnuncio(id);
        }
    });   
    
    if (loadSectionButton) {
        loadSectionButton.addEventListener('click', carregarConteudoRefeitorio);
    }

    if (loadAnunciosButton) {
        loadAnunciosButton.addEventListener('click', function() {
            fetch('/admin/anuncios/listar?section=content')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('adminContentSection').innerHTML = html;
                })
                .catch(error => console.error('Erro ao carregar a seção de anúncios:', error));
        });
    }

    const btnsEditar = document.querySelectorAll('.btn-editar');
    btnsEditar.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editarAnuncio(id);
        });
    });

    const btnsExcluir = document.querySelectorAll('.btn-excluir');
    btnsExcluir.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            excluirAnuncio(id);
        });
    });

    // Supondo que você tenha uma função para carregar os detalhes da reserva selecionada
    function carregarDetalhesReserva(idReserva) {
        // Aqui você carrega os detalhes da reserva com o ID fornecido
        // e preenche o formulário, incluindo o campo oculto idReserva
        document.getElementById('idReserva').value = idReserva;
        // Outras ações para preencher o formulário com os detalhes da reserva
    }

});

function carregarConteudoRefeitorio() {
    fetch('/admin/refeitorio?section=content')
        .then(response => response.text())
        .then(html => {
            document.getElementById('adminContentSection').innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar a seção do refeitório:', error));
}

function validarFormulario() {
    const tituloAnuncio = document.getElementById('tituloAnuncio').value;
    const conteudoAnuncio = document.getElementById('conteudoAnuncio').value;

    if (!tituloAnuncio || !conteudoAnuncio) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
}

function enviarFormulario() {
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
            location.reload(); // Recarrega a página
        } else {
            alert('Anúncio atualizado com sucesso!');
            location.reload(); // Recarrega a página
        }
        // Limpar formulário ou outras ações após o sucesso
    })
    .catch(error => {
        alert('Erro: ' + error.message);
    });
}    

function editarAnuncio(id) {
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

function excluirAnuncio(id) {
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
        fetch(`/admin/anuncios/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Anúncio excluído com sucesso!');
                location.reload(); // Recarrega a página

                // Localizar e remover o elemento HTML do anúncio
                const anuncioElement = document.querySelector(`.anuncio[data-id="${id}"]`);
                if (anuncioElement) {
                    anuncioElement.remove();
                }
            } else {
                alert('Falha ao excluir o anúncio.');
            }
        })
        .catch(error => {
            alert('Erro ao excluir o anúncio: ' + error.message);
        });
    }
}

function carregarConteudoAnuncios() {
    fetch('/admin/anuncios/listar?section=content')
        .then(response => response.text())
        .then(html => {
            document.getElementById('adminContentSection').innerHTML = html;
            adicionarDataPublicacao();
        })
        .catch(error => console.error('Erro ao carregar a seção de anúncios:', error));
}

function adicionarDataPublicacao() {
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



function limparEstilo() {
    var links = document.querySelectorAll('nav ul li a');
    links.forEach(function(link) {
        link.classList.remove('active');
    });
}

// Supondo que você tenha uma função para carregar os detalhes da reserva selecionada
function carregarDetalhesReserva(idReserva) {
    // Aqui você carrega os detalhes da reserva com o ID fornecido
    // e preenche o formulário, incluindo o campo oculto idReserva
    document.getElementById('idReserva').value = idReserva;
    // Outras ações para preencher o formulário com os detalhes da reserva
}

carregarConteudoAnuncios()
