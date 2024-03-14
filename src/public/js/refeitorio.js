let formData;
let inputTitulo;
let inputImagemUrl;
let inputImagemFile;
let inputVideoUrl;
let inputVideoComSom;
let inputMensagem;
let inputTurno;
let editandoId;

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("informativoForm");
    const informativoList = document.getElementById("informativoList");
    inputImagemFile = document.getElementById("imagemFile");
    inputImagemUrl = document.getElementById("imagemUrl");
    inputTitulo = document.getElementById("titulo");
    inputMensagem = document.getElementById("mensagem");
    inputVideoUrl = document.getElementById("videoUrl");
    inputVideoComSom = document.getElementById("videoComSom");
    inputTurno = document.getElementById("turno");
    const hoje = new Date().toISOString().split('T')[0];
    editandoId = null;  
    formData = new FormData(); 
    window.deleteInformativo = deleteInformativo;
    window.editInformativo = editInformativo;

    inputImagemFile.addEventListener("change", function () {
    console.log("Input imagem file change event");
    console.log("Selected file:", this.files[0]);
    console.log("Form data before setting:", formData.get("imagemFile"));
    formData.set("imagemFile", this.files[0]);
    console.log("Form data after setting:", formData.get("imagemFile"));
    });

    //Listeners da página
    inputImagemUrl.addEventListener("blur", alternarCamposDeEntrada); // Adicionando o evento blur
    inputImagemFile.addEventListener("change", alternarCamposDeArquivo);
    inputVideoUrl.addEventListener("input", alternarCamposDeVideo);
    inputVideoUrl.addEventListener("input", function () {
        inputImagemFile.value = "";
    });
    inputVideoComSom.addEventListener("change", function () {
        inputImagemFile.value = "";
    });

    let imagemFile = null;
    inputImagemFile.addEventListener("change", function () {
        if (this.files.length > 0 && this.files[0].size > 3145728) {
            alert("O arquivo é muito grande! O tamanho máximo é de 3MB.");
            this.value = "";
        } else if (this.files.length > 0) {
            imagemFile = this.files[0];
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const dataInicio = new Date(document.getElementById("dataInicio").value);
        const dataFim = new Date(document.getElementById("dataFim").value);
        const hoje = new Date();
        hoje.setDate(hoje.getDate() - 1); // Subtrai um dia da data atual
        hoje.setHours(0, 0, 0, 0);

        // Verifica se a data inicial é no passado
        if (dataInicio < hoje) {
            alert("A data inicial não pode ser no passado.");
            return;
        }

        // Verifica se a data final é anterior à data inicial
        if (dataFim && dataFim < dataInicio) {
            alert("A data final não pode ser anterior à data inicial de postagem.");
            return;
        }
        console.log("Enviando formulário...");

        const formData = new FormData();
        formData.append("titulo", inputTitulo.value);
        formData.append("mensagem", inputMensagem.value);
        formData.append("imagemUrl", inputImagemUrl.value);
        formData.append("videoUrl", inputVideoUrl.value);
        formData.append("videoComSom", inputVideoComSom.checked.toString());
        formData.append("turno", inputTurno.value);
        formData.append("dataInicio", document.getElementById("dataInicio").value);

        const dataFimValue = document.getElementById("dataFim").value;
        if (dataFimValue) {
            formData.append("dataFim", dataFimValue);
        } else {
            formData.append("dataFim", "");
        }

        formData.append("dataPostagem", hoje);

        // Adiciona a imagem apenas se estiver presente e não estiver editando
        if (imagemFile && !editandoId) {
            formData.append("imagemFile", imagemFile);
        }

        let url = '/api/refeitorio';
        let method = 'POST';

        if (editandoId) {
            url += `/${editandoId}`;
            method = 'PUT';
        }
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
                editandoId = null; // Reset editandoId após a atualização
            }
            loadInformativos();
            limparFormulario(); // Limpa o formulário

            // Remova o atributo hidden dos campos ocultos
            inputImagemUrl.removeAttribute("hidden");
            document.querySelector('label[for="imagemUrl"]').removeAttribute("style");
            inputImagemFile.removeAttribute("hidden");
            document.querySelector('label[for="imagemFile"]').removeAttribute("style");
            inputVideoUrl.removeAttribute("hidden");
            document.querySelector('label[for="videoUrl"]').removeAttribute("style");
            inputVideoComSom.removeAttribute("hidden");
            document.querySelector('label[for="videoComSom"]').removeAttribute("style");
        })    
        .catch(error => {
            alert("Erro ao enviar o informativo: " + error.message);
        });
    });
  loadInformativos();
  loadProgramados();
});

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
    console.log(inputImagemUrl);
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

//Envio informativo para o banco de dados
export function loadInformativos() {
    fetch("/api/refeitorio/listar?filtroPublicados=true")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar informativos. Por favor, tente novamente mais tarde.");
            }
            return response.json();
        })
        .then((data) => {
            informativoList.innerHTML = "";
            if (data.length === 0) {
                informativoList.innerHTML = "<p>Não tem informativos publicados.</p>";
                return;
            }
            data.forEach((informativo) => {
                const turno =
                    informativo.turno === "matutino"
                    ? "Matutino"
                    : informativo.turno === "vespertino"
                    ? "Vespertino"
                    : "Ambos";
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

                const container = document.createElement('div');
                container.classList.add('informativo-container');

                container.innerHTML = `
                    <h3>${informativo.titulo}</h3>
                    <p>${informativo.mensagem}</p>
                    ${
                        informativo.imagemUrl
                        ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">`
                        : ""
                    }
                    ${videoContent}
                    <div class="container">
                        <span class="turno-indicacao"><b>${turno}</b></span>
                        <div class="buttons-container">
                            <button class="delete-button" onclick="deleteInformativo(${
                            informativo.id
                            })">Excluir</button>
                            <button class="edit-button" onclick="editInformativo(${
                            informativo.id
                            })">Editar</button>
                        </div>
                    </div>`;
                        

                informativoList.appendChild(container);
            });
        })
        .catch((error) => {
            alert(error.message);
    });
}

export function loadProgramados() {
    fetch("/api/refeitorio/listar?filtroProgramados=true")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar informativos. Por favor, tente novamente mais tarde.");
            }
            return response.json();
        })
        .then((data) => {
            programadosList.innerHTML = "";
            if (data.length === 0) {
                programadosList.innerHTML = "<p>Não tem informativos programados.</p>";
                return;
            }
            data.forEach((informativo) => {
                const turno =
                    informativo.turno === "matutino"
                    ? "Matutino"
                    : informativo.turno === "vespertino"
                    ? "Vespertino"
                    : "Ambos";
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

                const container = document.createElement('div');
                container.classList.add('programado-container');

                container.innerHTML = `
                    <h3>${informativo.titulo}</h3>
                    <p>${informativo.mensagem}</p>
                    ${
                        informativo.imagemUrl
                        ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">`
                        : ""
                    }
                    ${videoContent}
                    <div class="container">
                        <span class="turno-indicacao"><b>${turno}</b></span>
                        <div class="buttons-container">
                            <button class="delete-button" onclick="deleteInformativo(${
                            informativo.id
                            })">Excluir</button>
                            <button class="edit-button" onclick="editInformativo(${
                            informativo.id
                            })">Editar</button>
                        </div>
                    </div>`;

                programadosList.appendChild(container);
            });
        })
        .catch((error) => {
            alert(error.message);
    });
}

export function deleteInformativo(id) {
fetch(`/api/refeitorio/${id}`, { method: "DELETE" }).then((response) => {
    if (response.ok) {
    loadInformativos();
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

        inputTitulo.value = informativo.titulo;
        inputMensagem.value = informativo.mensagem;
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
    inputMensagem.value = "";
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
