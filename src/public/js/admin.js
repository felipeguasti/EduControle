window.isAdminScriptLoaded = true;
let paginaAtual = 1; // Mantém controle da página atual de anúncios
const totalAnuncios = 8; // Número de anúncios por página
let imagemFile = null;

import { 
    carregarConteudoListaAnuncios,
    enviarFormulario,
    editarAnuncio,
    excluirAnuncio,
    adicionarDataPublicacao,
    recuarAnuncios,
    avancarAnuncios 
} from '../js/anuncios.js';

import { 
    loadInformativos,
    displayInformativos,
    fillInformativoContainer,
    loadProgramados,
    displayProgramados,
    fillProgramadoContainer,
    deleteInformativo,
    editInformativo,
    limparFormulario,
    alternarCamposDeEntrada,
    alternarCampo,
    alternarCamposDeArquivo,
    alternarCamposDeVideo,
    registrarOuvintesDeEventos,
    formatarData,
    atualizarBotoesPaginacao,
    avancarPaginaPublicados, 
    recuarPaginaPublicados,
    avancarPaginaProgramados,
    recuarPaginaProgramados,
    getTotalPaginasPublicados,
    getTotalPaginasProgramados,
    quillContainer,
    enviarInformativo,
    inicializar
} from '../js/refeitorio.js';

document.addEventListener('DOMContentLoaded', function() {
    const loadRefeitorioButton = document.getElementById('loadRefeitorioSection');
    const loadAnunciosButton = document.getElementById('loadAnunciosSection');
    const adminContentSection = document.getElementById('adminContentSection');
    const linkAnuncios = document.getElementById('linkAnuncios');
    const linkRefeitorio = document.getElementById('linkRefeitorio');
    limparEstilo();

    const secaoAtiva = sessionStorage.getItem('secaoAtiva');
    if (secaoAtiva === 'anuncios') {
        carregarConteudoAnuncios(paginaAtual);
        linkAnuncios.classList.add('active');
    } else if (secaoAtiva === 'refeitorio') {
        carregarConteudoRefeitorio();
        linkRefeitorio.classList.add('active');
    } else {
        carregarConteudoAnuncios(paginaAtual); // Carrega anúncios por padrão
    }

    // Adiciona event listener para o link de anúncios
    if (document.getElementById('linkAnuncios')) {
        const linkAnuncios = document.getElementById('linkAnuncios');
        linkAnuncios.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            limparEstilo(); // Limpa os estilos de todos os links
            carregarConteudoAnuncios(paginaAtual); // Carrega o conteúdo dos anúncios
            this.classList.add('active'); // Adiciona a classe 'active' ao link atual
        });
    }

    // Adiciona event listener para o link de refeitório
    if (document.getElementById('linkRefeitorio')) {
        const linkRefeitorio = document.getElementById('linkRefeitorio');
        linkRefeitorio.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            limparEstilo(); // Limpa os estilos de todos os links
            carregarConteudoRefeitorio(); // Carrega o conteúdo do refeitório
            this.classList.add('active'); // Adiciona a classe 'active' ao link atual
        });
    }

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
        sessionStorage.setItem('secaoAtiva', 'anuncios'); 
    }    

    async function carregarConteudoRefeitorio() {
        mostrarLoading(); 
        
        try {
            const response = await fetch('/api/refeitorio?section=content');
            const html = await response.text();
            adminContentSection.innerHTML = html;
            const inputImagemFile = document.getElementById("imagemFile");
            const inputImagemUrl = document.getElementById("imagemUrl");
            const inputTitulo = document.getElementById("titulo");
            const inputMensagem = document.getElementById("mensagem");
            const inputVideoUrl = document.getElementById("videoUrl");
            const inputVideoComSom = document.getElementById("videoComSom");
            const inputTurno = document.getElementById("turno");
            
            //Listeners da página            
            document.getElementById("avancarPublicados").addEventListener("click", async () => {
                await avancarPaginaPublicados();
            });
            
            document.getElementById("recuarPublicados").addEventListener("click", async () => {
                await recuarPaginaPublicados();
            });
            
            document.getElementById("avancarProgramados").addEventListener("click", async () => {
                await avancarPaginaProgramados();
            });
            
            document.getElementById("recuarProgramados").addEventListener("click", async () => {
                await recuarPaginaProgramados();
            });    
    
            inputImagemFile.addEventListener("change", function () {
                if (this.files.length > 0 && this.files[0].size > 3145728) {
                    alert("O arquivo é muito grande! O tamanho máximo é de 3MB.");
                    this.value = "";
                } else if (this.files.length > 0) {
                    imagemFile = this.files[0];
                }
            });
    
            // Chame a função registrarOuvintesDeEventos passando as funções apropriadas como argumentos
            registrarOuvintesDeEventos(
                alternarCamposDeEntrada,
                alternarCamposDeArquivo,
                alternarCamposDeVideo
            );
            inicializar();
            quillContainer();
            
        } catch (error) {
            console.error('Erro ao carregar a seção do refeitório:', error);
        } finally {
            esconderLoading(); // Esconder indicador de carregamento após o término do carregamento
        }
        loadInformativos();
        loadProgramados();    
        sessionStorage.setItem('secaoAtiva', 'refeitorio');
    }

    function limparEstilo() {
        var links = document.querySelectorAll('nav ul li a');
        links.forEach(function(link) {
            link.classList.remove('active');
        });
    }
});