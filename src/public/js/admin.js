document.addEventListener('DOMContentLoaded', function() {
    const formAnuncio = document.getElementById('formAnuncio');
    const btnEditar = document.querySelectorAll('.btn-editar');
    const btnExcluir = document.querySelectorAll('.btn-excluir');

    formAnuncio.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validarFormulario()) {
            enviarFormulario();
        }
    });

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

    function validarFormulario() {
        const tituloAnuncio = document.getElementById('tituloAnuncio').value;
        const conteudoAnuncio = document.getElementById('conteudoAnuncio').value;

        if (!tituloAnuncio || !conteudoAnuncio) {
            alert('Por favor, preencha todos os campos.');
            return false;
        }
        return true;
    }
    // Supondo que você tenha uma função para carregar os detalhes da reserva selecionada
function carregarDetalhesReserva(idReserva) {
    // Aqui você carrega os detalhes da reserva com o ID fornecido
    // e preenche o formulário, incluindo o campo oculto idReserva
    document.getElementById('idReserva').value = idReserva;
    // Outras ações para preencher o formulário com os detalhes da reserva
}


    function enviarFormulario() {
        const dadosFormulario = {
            tituloAnuncio: document.getElementById('tituloAnuncio').value,
            conteudoAnuncio: document.getElementById('conteudoAnuncio').value
        };
    
        let url = formAnuncio.action;
        let method = 'POST';
    
        // Verifica se a ação do formulário é para edição
        if (url.includes('/anuncios/')) {
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

        fetch(`/admin/anuncios/${id}`)
        .then(response => response.json())
        .then(anuncio => {
            // Preencher o formulário com os dados do anúncio
            document.getElementById('tituloAnuncio').value = anuncio.tituloAnuncio;
            document.getElementById('conteudoAnuncio').value = anuncio.conteudoAnuncio;
    
            // Mudar a ação do formulário para a rota de edição
            const formAnuncio = document.getElementById('formAnuncio');
            formAnuncio.action = `/admin/anuncios/${id}`;
    
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
    
});
