let formData;
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("informativoForm");
  const informativoList = document.getElementById("informativoList");
  const inputImagemFile = document.getElementById("imagemFile");
  const inputImagemUrl = document.getElementById("imagemUrl");
  const inputTitulo = document.getElementById("titulo");
  const inputMensagem = document.getElementById("mensagem");
  const inputVideoUrl = document.getElementById("videoUrl");
  const inputVideoComSom = document.getElementById("videoComSom");
  const inputTurno = document.getElementById("turno");
  const hoje = new Date().toISOString().split('T')[0];
  let editandoId = null;  
  formData = new FormData(); 

  inputImagemFile.addEventListener("change", function () {
    console.log("Input imagem file change event");
    console.log("Selected file:", this.files[0]);
    console.log("Form data before setting:", formData.get("imagemFile"));
    formData.set("imagemFile", this.files[0]);
    console.log("Form data after setting:", formData.get("imagemFile"));
  });

  inputImagemUrl.addEventListener("input", function () {
    if (inputImagemUrl.value.trim() === "") {
        inputImagemFile.removeAttribute("hidden");
        document.querySelector('label[for="imagemFile"]').removeAttribute("style");
        formData.set("imagemFile", "");
        inputVideoUrl.removeAttribute("hidden");
        document.querySelector('label[for="videoUrl"]').removeAttribute("style");
        formData.set("videoUrl", "");
        inputVideoComSom.removeAttribute("hidden");
        document.querySelector('label[for="videoComSom"]').removeAttribute("style");
        formData.set("videoComSom", "");
    } else {
        inputImagemFile.setAttribute("hidden", true);
        document.querySelector('label[for="imagemFile"]').style.display = "none";
        formData.delete("imagemFile");
        inputVideoUrl.setAttribute("hidden", true);
        document.querySelector('label[for="videoUrl"]').style.display = "none";
        formData.delete("videoUrl");
        inputVideoComSom.setAttribute("hidden", true);
        document.querySelector('label[for="videoComSom"]').style.display = "none";
        formData.delete("videoComSom");
    }
  });

  inputImagemFile.addEventListener("change", function () {
    if (inputImagemFile.files.length === 0) {
        inputImagemUrl.removeAttribute("hidden");
        document.querySelector('label[for="imagemUrl"]').removeAttribute("style");
        formData.set("imagemUrl", "");
        inputVideoUrl.removeAttribute("hidden");
        document.querySelector('label[for="videoUrl"]').removeAttribute("style");
        formData.set("videoUrl", "");
        inputVideoComSom.removeAttribute("hidden");
        document.querySelector('label[for="videoComSom"]').removeAttribute("style");
        formData.set("videoComSom", "");
    } else {
        inputImagemUrl.setAttribute("hidden", true);
        document.querySelector('label[for="imagemUrl"]').style.display = "none";
        formData.delete("imagemUrl");
        inputVideoUrl.setAttribute("hidden", true);
        document.querySelector('label[for="videoUrl"]').style.display = "none";
        formData.delete("videoUrl");
        inputVideoComSom.setAttribute("hidden", true);
        document.querySelector('label[for="videoComSom"]').style.display = "none";
        formData.delete("videoComSom");
    }
  });

  inputVideoUrl.addEventListener("input", function () {
    if (inputVideoUrl.value.trim() === "") {
        inputImagemFile.removeAttribute("hidden");
        document.querySelector('label[for="imagemFile"]').removeAttribute("style");
        formData.set("imagemFile", "");
        inputImagemUrl.removeAttribute("hidden");
        document.querySelector('label[for="imagemUrl"]').removeAttribute("style");
        formData.set("imagemUrl", "");
    } else {
        inputImagemFile.setAttribute("hidden", true);
        document.querySelector('label[for="imagemFile"]').style.display = "none";
        formData.delete("imagemFile");
        inputImagemUrl.setAttribute("hidden", true);
        document.querySelector('label[for="imagemUrl"]').style.display = "none";
        formData.delete("imagemUrl");
    }
  });


  // Event listener para mudanças no campo de vídeo URL
  inputVideoUrl.addEventListener("input", function () {
      // Limpar o campo de imagem file se uma URL de vídeo for inserida
      inputImagemFile.value = "";
  });

  // Event listener para mudanças no checkbox de vídeo com som
  inputVideoComSom.addEventListener("change", function () {
      // Limpar o campo de imagem file se uma URL de vídeo for inserida
      inputImagemFile.value = "";
  });
  
  //Envio informativo para o banco de dados
  function loadInformativos() {
    fetch("/api/refeitorio/listar")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar informativos. Por favor, tente novamente mais tarde.");
            }
            return response.json();
        })
        .then((data) => {
            informativoList.innerHTML = "";
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

                informativoList.innerHTML += `
                    <div class="informativo-container">
                        <h3>${informativo.titulo}</h3>
                        <p>${informativo.mensagem}</p>
                        ${
                            informativo.imagemUrl
                            ? `<img src="${informativo.imagemUrl}" alt="Imagem do Informativo" class="informativo-imagem">`
                            : ""
                        }
                        ${videoContent}
                        <span class="turno-indicacao">${turno}</span>
                        <button class="delete-button" onclick="deleteInformativo(${
                            informativo.id
                        })">Excluir</button>
                        <button class="edit-button" onclick="editInformativo(${
                            informativo.id
                        })">Editar</button>
                    </div>`;
            });
        })
        .catch((error) => {
            alert(error.message);
        });
  }  

  function deleteInformativo(id) {
    fetch(`/api/refeitorio/${id}`, { method: "DELETE" }).then((response) => {
      if (response.ok) {
        loadInformativos();
      } else {
        alert("Erro ao excluir o informativo");
      }
    });
  }

  window.deleteInformativo = deleteInformativo;

  function editInformativo(id) {
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

  

  window.editInformativo = editInformativo;

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

    const formData = new FormData();
    formData.append("titulo", inputTitulo.value);
    formData.append("mensagem", inputMensagem.value);
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
        form.reset();

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
});