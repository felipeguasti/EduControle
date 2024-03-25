let formData;
let inputTitulo;
let inputImagemUrl;
let inputImagemFile;
let inputVideoUrl;
let inputVideoComSom;
let inputMensagem;
let inputTurno = 'Matutino';
let editandoId;
let recuarProgramados;
let avancarPublicados;
let recuarPublicados;
let avancarProgramados;
let form;

document.addEventListener("DOMContentLoaded", function () {
    const hoje = new Date().toISOString().split('T')[0];
    inputImagemFile = document.getElementById("imagemFile");
    inputImagemUrl = document.getElementById("imagemUrl");
    inputTitulo = document.getElementById("titulo");
    inputMensagem = document.getElementById("mensagem");
    inputVideoUrl = document.getElementById("videoUrl");
    inputVideoComSom = document.getElementById("videoComSom");
    inputTurno = document.getElementById("turno");
    recuarProgramados = document.getElementById("recuarProgramados");
    avancarPublicados = document.getElementById("avancarPublicados");
    recuarPublicados = document.getElementById("recuarPublicados");
    avancarProgramados = document.getElementById("avancarProgramados");
    const informativoList = document.getElementById("informativoList");
    const programadosList = document.getElementById("programadosList");
    let conteudoQuill;

    if (typeof window.isAdminScriptLoaded === 'undefined' || window.isAdminScriptLoaded === false) {
        const informativoList = document.getElementById("informativoList");
        const programadosList = document.getElementById("programadosList");
    }
    
    if (typeof window.isAdminScriptLoaded === 'undefined' || window.isAdminScriptLoaded === false) {
        loadInformativos();
        loadProgramados();
        quillContainer();
    }

    editandoId = null;  
    formData = new FormData(); 

    window.deleteInformativo = deleteInformativo;
    window.editInformativo = editInformativo;
    
    //Listeners da página
    if (inputImagemFile) {
        inputImagemFile.addEventListener("change", function () {
        console.log("Input imagem file alterado");
        console.log("Arquivo selecionado:", this.files[0]);    
        console.log("Input imagem file change event");
        console.log("Selected file:", this.files[0]);
        console.log("Form data before setting:", formData.get("imagemFile"));
        formData.set("imagemFile", this.files[0]);
        console.log("Form data after setting:", formData.get("imagemFile"));
        
        });
    }
    if (inputImagemUrl) {
        inputImagemUrl.addEventListener("blur", alternarCamposDeEntrada); // Adicionando o evento blur
    }
    if (inputImagemFile) {
        inputImagemFile.addEventListener("change", alternarCamposDeArquivo);
    }
    if (inputVideoUrl) {
        inputVideoUrl.addEventListener("input", alternarCamposDeVideo);
    }
    if (inputVideoUrl) {
        inputVideoUrl.addEventListener("input", function () {
            inputImagemFile.value = "";
        });
    }
    if (inputVideoComSom) {
        inputVideoComSom.addEventListener("change", function () {
            inputImagemFile.value = "";
        });
    }
    if (avancarPublicados) {
        avancarPublicados.addEventListener("click", async () => {
            await avancarPaginaPublicados();
        });    
    }
    if (recuarPublicados) {
        recuarPublicados.addEventListener("click", async () => {
            await recuarPaginaPublicados();
        });
    }
    if (avancarProgramados) {
        avancarProgramados.addEventListener("click", async () => {
            await avancarPaginaProgramados();
        });
    }
    if (recuarProgramados) {
        recuarProgramados.addEventListener("click", async () => {
            await recuarPaginaProgramados();
        });    
    }
    let imagemFile = null;
    if (recuarProgramados) {
        inputImagemFile.addEventListener("change", function () {
            if (this.files.length > 0 && this.files[0].size > 3145728) {
                alert("O arquivo é muito grande! O tamanho máximo é de 3MB.");
                this.value = "";
            } else if (this.files.length > 0) {
                imagemFile = this.files[0];
            }
        });
    }
    if (typeof window.isAdminScriptLoaded === 'undefined' || window.isAdminScriptLoaded === false) {
        form = document.getElementById("informativoForm");
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                enviarInformativo();
            });
        }
    }
    const totalPaginasPublicados = getTotalPaginasPublicados();
    atualizarBotoesPaginacao('publicados', totalPaginasPublicados);
    const totalPaginasProgramados = getTotalPaginasProgramados();
    atualizarBotoesPaginacao('programados', totalPaginasProgramados);
});

export function inicializar() {
    form = document.getElementById("informativoForm");

    if (!form) {
        console.error("Formulário informativoForm não encontrado!");
        return;
    }

    inputImagemFile = document.getElementById("imagemFile");
    inputImagemUrl = document.getElementById("imagemUrl");
    inputTitulo = document.getElementById("titulo");
    inputMensagem = document.getElementById("mensagem");
    inputVideoUrl = document.getElementById("videoUrl");
    inputVideoComSom = document.getElementById("videoComSom");
    inputTurno = document.getElementById("turno");

    // Adiciona os event listeners se os elementos correspondentes forem encontrados
    if (inputImagemFile) {
        inputImagemFile.addEventListener("change", function () {
            console.log("Input imagem file alterado");
            console.log("Arquivo selecionado:", this.files[0]);
            // Atualiza o formData com o arquivo
            formData.set("imagemFile", this.files[0]);
        });
    }

    // Adicione aqui outros event listeners conforme necessário...

    // Listener para o evento submit do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Evento submit capturado");
        enviarInformativo();
    });

    // Se houver mais lógica de inicialização, coloque aqui
}


export function enviarInformativo() {
    const formData = new FormData();

    // Usando moment.js para manipular as datas
    const hoje = moment();
    const dataPostagemFormatada = hoje.format('YYYY-MM-DD');

    let dataInicioInput = document.getElementById("dataInicio").value;
    let dataInicio = dataInicioInput ? moment(dataInicioInput) : hoje;

    if (dataInicio.isBefore(hoje, 'day')) {
        console.log("A data inicial é no passado");
        alert("A data inicial não pode ser no passado.");
        return;
    }

    // Adiciona a data de início ao formData sem zerar a hora
    formData.append("dataInicio", dataInicio.format('YYYY-MM-DD HH:mm:ss'));

    const dataFimInput = document.getElementById("dataFim").value;
    if (dataFimInput) {
        let dataFim = moment(dataFimInput);
        if (dataFim.isBefore(dataInicio, 'day')) {
            alert("A data final não pode ser anterior à data inicial de postagem.");
            return;
        }
        // Adiciona a data de fim ao formData sem zerar a hora
        formData.append("dataFim", dataFim.format('YYYY-MM-DD HH:mm:ss'));
    } else {
        formData.append("dataFim", "");
    }

    formData.append("dataPostagem", dataPostagemFormatada);

    const conteudoQuill = document.querySelector('.ql-editor').innerHTML;
    formData.append("titulo", inputTitulo.value);
    formData.append("mensagem", conteudoQuill);
    formData.append("imagemUrl", inputImagemUrl.value);
    formData.append("videoUrl", inputVideoUrl.value);
    formData.append("videoComSom", inputVideoComSom.checked.toString());
    formData.append("turno", inputTurno.value);

    if (imagemFile && !editandoId) {
        formData.append("imagemFile", imagemFile);
    }

    if (inputImagemFile.files.length > 0) {
        formData.set("imagemFile", inputImagemFile.files[0]);
    }

    console.log("Enviando formulário...");
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    let url = '/api/refeitorio';
    let method = 'POST';

    if (editandoId) {
        url += `/${editandoId}`;
        method = 'PUT';
    }
    console.log("Preparando para enviar a requisição fetch");
    fetch(url, {
        method: method,
        body: formData,
    })
    .then(response => {
        console.log("Resposta recebida:", response);
        if (!response.ok) {
            throw new Error("Falha ao enviar o informativo");
        }
        return response.json();
    })
    .then(data => {
        if (method === 'POST') {
            alert("Informativo enviado com sucesso!");
        } else if (method === 'PUT') {
            alert("Informativo atualizado com sucesso!");
            editandoId = null;
        }
        loadInformativos();
        loadProgramados();
        limparFormulario();
    })
    .catch(error => {
        alert("Erro ao enviar o informativo: " + error.message);
    });
}



export function quillContainer () {
    const quill = new Quill('#editor', {
        theme: 'snow', // or 'bubble'
    });
}

// Define as funções que registram os ouvintes de eventos
export function registrarOuvintesDeEventos(alternarCamposDeEntrada, alternarCamposDeArquivo, alternarCamposDeVideo) {
    inputImagemUrl = document.getElementById("imagemUrl");
    inputImagemFile = document.getElementById("imagemFile");
    inputVideoUrl = document.getElementById("videoUrl");
    inputVideoComSom = document.getElementById("videoComSom");

    //Listeners da página
    inputImagemUrl.addEventListener("input", alternarCamposDeEntrada);
    inputImagemFile.addEventListener("change", alternarCamposDeArquivo);
    inputVideoUrl.addEventListener("input", alternarCamposDeVideo);
    inputVideoUrl.addEventListener("input", function () {
        inputImagemFile.value = "";
    });
    inputVideoComSom.addEventListener("change", function () {
        inputImagemFile.value = "";
    });
}

export function alternarCamposDeEntrada() {
    if (inputImagemUrl.value.trim() === "") {
        alternarCampo(inputImagemFile, 'imagemFile');
        alternarCampo(inputVideoUrl, 'videoUrl');
        alternarCampo(inputVideoComSom, 'videoComSom');
    } else {
        alternarCampo(inputImagemFile, 'imagemFile', true);
        alternarCampo(inputVideoUrl, 'videoUrl', true);
        alternarCampo(inputVideoComSom, 'videoComSom', true);
    }
}

export function alternarCamposDeArquivo() {
    if (inputImagemFile.files.length === 0) {
        alternarCampo(inputImagemUrl, 'imagemUrl');
        alternarCampo(inputVideoUrl, 'videoUrl');
        alternarCampo(inputVideoComSom, 'videoComSom');
    } else {
        alternarCampo(inputImagemUrl, 'imagemUrl', true);
        alternarCampo(inputVideoUrl, 'videoUrl', true);
        alternarCampo(inputVideoComSom, 'videoComSom', true);
    }
}

export function alternarCamposDeVideo() {
    if (inputVideoUrl.value.trim() === "") {
        alternarCampo(inputImagemFile, 'imagemFile');
        alternarCampo(inputImagemUrl, 'imagemUrl');
    } else {
        alternarCampo(inputImagemFile, 'imagemFile', true);
        alternarCampo(inputImagemUrl, 'imagemUrl', true);
    }
}

export function alternarCampo(elemento, nomeCampo, esconder = false) {
    if (esconder) {
        elemento.setAttribute("hidden", true);
        document.querySelector(`label[for="${nomeCampo}"]`).style.display = "none";
        if (elemento.tagName === 'INPUT') {
            elemento.value = ''; // Limpar o valor
        }
        formData.delete(nomeCampo);
    } else {
        elemento.removeAttribute("hidden");
        document.querySelector(`label[for="${nomeCampo}"]`).removeAttribute("style");
    }
}

export function formatarData(data) {
    const dataMoment = moment.utc(data); // Cria um objeto moment em UTC com a data fornecida
    return dataMoment.format('DD.MM.YYYY'); // Formata a data no padrão desejado
}

let bufferInformativos = [];
let bufferIndex = 0;

export function loadInformativos(page = 1) {
    // Verifica se já temos dados pré-carregados disponíveis no buffer
    if (bufferIndex < bufferInformativos.length) {
        // Exibe os dados do buffer
        displayInformativos(bufferInformativos.slice(bufferIndex, bufferIndex + itensPorPagina));
        bufferIndex += itensPorPagina;
    } else {
        // Se não houver dados no buffer, faz a requisição para carregar mais
        fetch(`/api/refeitorio/listar?filtroPublicados=true&page=${page}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar informativos. Por favor, tente novamente mais tarde.");
                }
                return response.json();
            })
            .then(data => {
                // Reinicia o buffer com os novos dados carregados
                bufferInformativos = data;
                bufferIndex = 0;
                displayInformativos(bufferInformativos.slice(bufferIndex, bufferIndex + itensPorPagina));
                bufferIndex += itensPorPagina;
            })
            .catch(error => {
                alert(error.message);
            });
    }
}

export function displayInformativos(informativos, pageIndex, totalInformativos) {
    if (!informativoList) {
        console.error("informativoList não encontrado no DOM.");
        return;
    }
    informativoList.innerHTML = "";
    if (informativos.length === 0) {
        informativoList.innerHTML = "<p>Não tem informativos publicados.</p>";
        return;
    }

    // Adiciona o último informativo da página anterior se não for a primeira página
    if (pageIndex > 1) {
        const lastOfPreviousIndex = (pageIndex - 2) * informativos.length + (informativos.length - 1);
        const lastOfPrevious = totalInformativos[lastOfPreviousIndex];
        const container = document.createElement('div');
        container.classList.add('informativo-container', 'item-pela-metade');
        
        // Preenchimento do container com informações do lastOfPrevious
        fillInformativoContainer(container, lastOfPrevious);

        informativoList.appendChild(container);
    }

    informativos.forEach((informativo, index) => {
        const container = document.createElement('div');
        container.classList.add('informativo-container');

        // Preenchimento do container com informações do informativo
        fillInformativoContainer(container, informativo);

        // Na primeira página, marca o último informativo para ser exibido pela metade
        if (pageIndex === 1 && index === informativos.length - 1) {
            container.classList.add('item-pela-metade');
        }

        informativoList.appendChild(container);
    });
}


export function fillInformativoContainer(container, informativo) {
    const turno = informativo.turno === "matutino" ? "Matutino" :
                  informativo.turno === "vespertino" ? "Vespertino" : "Ambos";

    let videoContent = "";
    if (informativo.videoUrl) {
        if (informativo.videoUrl.includes("youtube")) {
            const videoId = informativo.videoUrl.split("v=")[1];
            const autoplay = "&autoplay=1";
            const loop = "&loop=1";
            const mute = informativo.videoComSom ? "" : "&mute=1";
            const embedUrl = `https://www.youtube.com/embed/${videoId}?playlist=${videoId}${autoplay}${loop}${mute}&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0`;

            videoContent = `<iframe width="100%" height="480" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            videoContent = `<video src="${informativo.videoUrl}" ${
                informativo.videoComSom ? "controls" : "muted"
            } loop autoplay></video>`;
        }
    }

    const dataInicioFormatada = informativo.dataInicio ? formatarData(informativo.dataInicio) : null;
    const dataFimFormatada = informativo.dataFim ? formatarData(informativo.dataFim) : null;
    const mensagemInicio = dataInicioFormatada ? `Publicado no dia ${dataInicioFormatada}` : "Publicado recentemente";
    const mensagemFim = dataFimFormatada ? `será excluído no dia ${dataFimFormatada}` : 'terá duração indeterminada';

    container.innerHTML = `
        <h3>${informativo.titulo}</h3>
        <p>${informativo.mensagem}</p>
        ${informativo.imagemUrl ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">` : ""}
        ${videoContent}
        <h6>${mensagemInicio} e <br />${mensagemFim}</h6>
        <div class="container-infooter">
            <span class="turno-indicacao"><b>${turno}</b></span>
            <div class="buttons-container">
                <button class="delete-button" onclick="deleteInformativo(${informativo.id})">Excluir</button>
                <button class="edit-button" onclick="editInformativo(${informativo.id})">Editar</button>
            </div>
        </div>`;
}

let bufferProgramados = [];
let bufferProgramadosIndex = 0;

export function loadProgramados(page = 1) {
    if (bufferProgramadosIndex < bufferProgramados.length) {
        displayProgramados(bufferProgramados.slice(bufferProgramadosIndex, bufferProgramadosIndex + itensPorPagina));
        bufferProgramadosIndex += itensPorPagina;
    } else {
        fetch(`/api/refeitorio/listar?filtroProgramados=true&page=${page}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar informativos programados. Por favor, tente novamente mais tarde.");
                }
                return response.json();
            })
            .then(data => {
                bufferProgramados = data;
                bufferProgramadosIndex = 0;
                displayProgramados(bufferProgramados.slice(bufferProgramadosIndex, bufferProgramadosIndex + itensPorPagina));
                bufferProgramadosIndex += itensPorPagina;
            })
            .catch(error => {
                alert(error.message);
            });
    }
}

export function displayProgramados(programados, pageIndex, totalProgramados) {
    if (!programadosList) {
        console.error("programadosList não encontrado no DOM.");
        return;
    }
    programadosList.innerHTML = "";
    if (programados.length === 0) {
        programadosList.innerHTML = "<p>Não tem informativos programados.</p>";
        return;
    }

    // Adiciona o último informativo da página anterior se não for a primeira página
    if (pageIndex > 1) {
        const lastOfPreviousIndex = (pageIndex - 2) * programados.length + (programados.length - 1);
        const lastOfPrevious = totalProgramados[lastOfPreviousIndex];
        const container = document.createElement('div');
        container.classList.add('programado-container', 'item-pela-metade');
        
        // Preenchimento do container com informações do lastOfPrevious
        fillProgramadoContainer(container, lastOfPrevious);

        programadosList.appendChild(container);
    }

    programados.forEach((informativo, index) => {
        const container = document.createElement('div');
        container.classList.add('programado-container');

        // Preenchimento do container com informações do informativo
        fillProgramadoContainer(container, informativo);

        // Na primeira página, marca o último informativo para ser exibido pela metade
        if (pageIndex === 1 && index === programados.length - 1) {
            container.classList.add('item-pela-metade');
        }

        programadosList.appendChild(container);
    });
}

export function fillProgramadoContainer(container, informativo) {
    const turno = informativo.turno === "matutino" ? "Matutino" :
                  informativo.turno === "vespertino" ? "Vespertino" : "Ambos";

    let videoContent = "";
    if (informativo.videoUrl) {
        if (informativo.videoUrl.includes("youtube")) {
            const videoId = informativo.videoUrl.split("v=")[1];
            const autoplay = "&autoplay=1";
            const loop = "&loop=1";
            const mute = informativo.videoComSom ? "" : "&mute=1";
            const embedUrl = `https://www.youtube.com/embed/${videoId}?playlist=${videoId}${autoplay}${loop}${mute}&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0`;

            videoContent = `<iframe width="100%" height="480" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            videoContent = `<video src="${informativo.videoUrl}" ${
                informativo.videoComSom ? "controls" : "muted"
            } loop autoplay></video>`;
        }
    }

    const dataInicioFormatada = informativo.dataInicio ? formatarData(informativo.dataInicio) : null;
    const dataFimFormatada = informativo.dataFim ? formatarData(informativo.dataFim) : null;

    container.innerHTML = `
        <h3>${informativo.titulo}</h3>
        <p>${informativo.mensagem}</p>
        ${informativo.imagemUrl ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">` : ""}
        ${videoContent}
        <h6>Será publicado no dia ${dataInicioFormatada} e <br />${dataFimFormatada ? `será excluído no dia ${dataFimFormatada}` : 'terá duração indeterminada'}</h6>
        <div class="container-infooter">
            <span class="turno-indicacao"><b>${turno}</b></span>
            <div class="buttons-container">
                <button class="delete-button" onclick="deleteInformativo(${informativo.id})">Excluir</button>
                <button class="edit-button" onclick="editInformativo(${informativo.id})">Editar</button>
            </div>
        </div>`;
}

export function deleteInformativo(id) {
fetch(`/api/refeitorio/${id}`, { method: "DELETE" }).then((response) => {
    if (response.ok) {
        loadInformativos();
        loadProgramados();
        limparFormulario();
    } else {
        alert("Erro ao excluir o informativo");
    }
});
}

export function editInformativo(id) {
    fetch(`/api/refeitorio/${id}`)
      .then((response) => response.json())
      .then((informativo) => {
        // Restaurar campos ocultos
        inputImagemFile.removeAttribute("hidden");
        document.querySelector('label[for="imagemFile"]').removeAttribute("style");
        formData.set("imagemFile", "");
        inputVideoUrl.removeAttribute("hidden");
        document.querySelector('label[for="videoUrl"]').removeAttribute("style");
        formData.set("videoUrl", "");
        inputVideoComSom.removeAttribute("hidden");
        document.querySelector('label[for="videoComSom"]').removeAttribute("style");
        formData.set("videoComSom", "");
        const editorElement = document.querySelector('[informativo-mensagem="true"]');
        const conteudoQuill = new Quill('#editor');

        if (editorElement) {
            const conteudoDB = informativo.mensagem;
            conteudoQuill.root.innerHTML = conteudoDB;
        } else {
            console.error('Elemento do editor não encontrado.');
        }

        inputTitulo.value = informativo.titulo;
        inputImagemUrl.value = informativo.imagemUrl || "";
        inputVideoUrl.value = informativo.videoUrl || "";
        inputVideoComSom.checked = informativo.videoComSom || false;
        inputTurno.value = informativo.turno;

        // Formatar as datas antes de atribuí-las aos inputs
        if (informativo.dataInicio) {
          const dataInicio = new Date(informativo.dataInicio).toISOString().split('T')[0];
          document.getElementById("dataInicio").value = dataInicio;
        }

        if (informativo.dataFim) {
          const dataFim = new Date(informativo.dataFim).toISOString().split('T')[0];
          document.getElementById("dataFim").value = dataFim;
        }
        editandoId = id;
        window.scrollTo(0, 0);
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Editar Informativo';
        })
        .catch((error) => {
        console.error("Erro ao carregar informativo para edição", error);
    });
}

export function limparFormulario() {
    inputTitulo.value = "";
    const editorQuill = document.querySelector('.ql-editor');
    editorQuill.innerHTML = ""; // Define o conteúdo do Quill para uma string vazia
    inputImagemUrl.value = "";
    inputImagemFile.value = "";
    inputVideoUrl.value = "";
    inputVideoComSom.checked = false;
    inputTurno.value = "Matutino";
    document.getElementById("dataInicio").value = "";
    document.getElementById("dataFim").value = "";
    editandoId = null;
    const btnSubmit = document.querySelector('button[type="submit"]');
    btnSubmit.textContent = 'Enviar Informativo';
}

let paginaAtualPublicados = 1;
let paginaAtualProgramados = 1; 
const itensPorPagina = 10;

export async function atualizarBotoesPaginacao(tipo, totalPaginas) {
    const botaoRecuar = document.getElementById(`recuar${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    const botaoAvancar = document.getElementById(`avancar${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    
    if (botaoRecuar && botaoAvancar) {
        if (tipo === 'publicados') {
            if (paginaAtualPublicados === 1) {
                botaoRecuar.classList.add('disabled');
                botaoRecuar.disabled = true;
                botaoAvancar.classList.add('disabled');
                botaoAvancar.disabled = true;
            } else {
                botaoRecuar.classList.remove('disabled');
                botaoRecuar.disabled = false;
            }
        
            if (paginaAtualPublicados === totalPaginas || totalPaginas === 0) {
                botaoAvancar.classList.add('disabled');
                botaoAvancar.disabled = true;
            } else {
                botaoAvancar.classList.remove('disabled');
                botaoAvancar.disabled = false;
            }
        } else if (tipo === 'programados') {
            if (paginaAtualProgramados === 1) {
                botaoRecuar.classList.add('disabled');
                botaoRecuar.disabled = true;
            } else {
                botaoRecuar.classList.remove('disabled');
                botaoRecuar.disabled = false;
            }
        
            if (paginaAtualProgramados === totalPaginas || totalPaginas === 0) {
                botaoAvancar.classList.add('disabled');
                botaoAvancar.disabled = true;
            } else {
                botaoAvancar.classList.remove('disabled');
                botaoAvancar.disabled = false;
            }
        }
    }
}

export async function avancarPaginaPublicados() {
    const totalPaginas = await getTotalPaginasPublicados();
    if (paginaAtualPublicados < totalPaginas) {
        paginaAtualPublicados++;
        loadInformativos(paginaAtualPublicados);
        atualizarBotoesPaginacao('publicados', totalPaginas);
    }
}

export async function recuarPaginaPublicados() {
    if (paginaAtualPublicados > 1) { 
        paginaAtualPublicados--;
        loadInformativos(paginaAtualPublicados); 
        const totalPaginas = await getTotalPaginasPublicados();
        atualizarBotoesPaginacao('publicados', totalPaginas);
    }
}

export async function avancarPaginaProgramados() {
    const totalPaginas = await getTotalPaginasProgramados();
    if (paginaAtualProgramados < totalPaginas) {
        paginaAtualProgramados++; 
        loadProgramados(paginaAtualProgramados);
        atualizarBotoesPaginacao('programados', totalPaginas);
    }
}

export async function recuarPaginaProgramados() {
    if (paginaAtualProgramados > 1) {
        paginaAtualProgramados--; 
        loadProgramados(paginaAtualProgramados); 
        const totalPaginas = await getTotalPaginasProgramados();
        atualizarBotoesPaginacao('programados', totalPaginas);
    }
}

export async function getTotalPaginasPublicados() {
    const response = await fetch(`/api/refeitorio/total?tipo=publicados`);
    if (!response.ok) {
        throw new Error('Erro ao buscar total de páginas para publicados');
    }
    const data = await response.json();
    return data.totalPaginas;
}

export async function getTotalPaginasProgramados() {
    const response = await fetch(`/api/refeitorio/total?tipo=programados`);
    if (!response.ok) {
        throw new Error('Erro ao buscar total de páginas para programados');
    }
    const data = await response.json();
    return data.totalPaginas;
}