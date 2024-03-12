window.isAdminScriptLoaded = true;
let paginaAtual = 1; // Mantém controle da página atual de anúncios
const totalAnuncios = 8; // Número de anúncios por página
import { 
    carregarConteudoListaAnuncios,
    enviarFormulario,
    editarAnuncio,
    excluirAnuncio,
    adicionarDataPublicacao,
    recuarAnuncios,
    avancarAnuncios 
} from '../js/anuncios.js';


document.addEventListener('DOMContentLoaded', function() {
    const loadRefeitorioButton = document.getElementById('loadRefeitorioSection');
    const loadAnunciosButton = document.getElementById('loadAnunciosSection');
    const adminContentSection = document.getElementById('adminContentSection');
    
    
    if (loadRefeitorioButton) {
        loadRefeitorioButton.addEventListener('click', carregarConteudoRefeitorio);
    }

    if (loadAnunciosButton) {
        loadAnunciosButton.addEventListener('click', carregarConteudoAnuncios);
    }

    // Seleciona os links de anúncios e refeitório
    const linkAnuncios = document.getElementById('linkAnuncios');
    const linkRefeitorio = document.getElementById('linkRefeitorio');

    // Adiciona event listener para o link de anúncios
    linkAnuncios.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        limparEstilo(); // Limpa os estilos de todos os links
        carregarConteudoAnuncios(); // Carrega o conteúdo dos anúncios
        this.classList.add('active'); // Adiciona a classe 'active' ao link atual
    });

    // Adiciona event listener para o link de refeitório
    linkRefeitorio.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        limparEstilo(); // Limpa os estilos de todos os links
        carregarConteudoRefeitorio(); // Carrega o conteúdo do refeitório
        this.classList.add('active'); // Adiciona a classe 'active' ao link atual
    });

    function mostrarLoading() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        } else {
            console.error('Elemento de indicador de carregamento não encontrado.');
        }
    }
    
    function esconderLoading() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        } else {
            console.error('Elemento de indicador de carregamento não encontrado.');
        }
    }
    
    async function carregarConteudoRefeitorio() {
        mostrarLoading(); // Mostrar indicador de carregamento antes de iniciar o carregamento
    
        try {
            const refeitorioModule = await import('../js/refeitorio.js');
            const response = await fetch('/api/refeitorio?section=content');
            const html = await response.text();
            document.getElementById('adminContentSection').innerHTML = html;
        } catch (error) {
            console.error('Erro ao carregar a seção do refeitório:', error);
        } finally {
            esconderLoading(); // Esconder indicador de carregamento após o término do carregamento
        }
    }
    
    async function carregarConteudoAnuncios(pagina) {
        mostrarLoading(); // Mostrar indicador de carregamento antes de iniciar o carregamento
    
        try {
            const anunciosModule = await import('../js/anuncios.js');
            const response = await fetch(`/admin/anuncios/listar?section=content&pagina=${pagina}`);
            const html = await response.text();
            document.getElementById('adminContentSection').innerHTML = html;
    
            // Adicionar event listeners aos botões de edição e exclusão
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
    
            // Adicionar event listeners aos botões de paginação
            const btnRecuar = document.getElementById('btnRecuar');
            btnRecuar.addEventListener('click', recuarAnuncios);
            const btnAvancar = document.getElementById('btnAvancar');
            btnAvancar.addEventListener('click', avancarAnuncios);
    
        } catch (error) {
            console.error('Erro ao carregar a seção dos anúncios:', error);
        } finally {
            esconderLoading(); // Esconder indicador de carregamento após o término do carregamento
        }
    }    

    function limparEstilo() {
        var links = document.querySelectorAll('nav ul li a');
        links.forEach(function(link) {
            link.classList.remove('active');
        });
    }
    carregarConteudoAnuncios(paginaAtual);
});