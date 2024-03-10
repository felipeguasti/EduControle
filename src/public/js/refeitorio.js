let formData = new FormData();
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
  let editandoId = null;

  // Event listener para mudanças no campo de imagem file
  inputImagemFile.addEventListener("change", function () {
      if (this.files.length > 0 && this.files[0].size > 3145728) {
          alert("O arquivo é muito grande! O tamanho máximo é de 3MB.");
          this.value = "";
      } else if (this.files.length > 0) {
          // Limpar o campo de vídeo URL se um arquivo de imagem for selecionado
          inputVideoUrl.value = "";
      }
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
    fetch("/api/refeitorio")
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
        inputTitulo.value = informativo.titulo;
        inputMensagem.value = informativo.mensagem;
        inputImagemUrl.value = informativo.imagemUrl || "";
        inputVideoUrl.value = informativo.videoUrl || "";
        inputVideoComSom.checked = informativo.videoComSom || false;
        inputTurno.value = informativo.turno;
        editandoId = id;

        // Mover a tela para o topo
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error("Erro ao carregar informativo para edição", error);
      });
  }

  window.editInformativo = editInformativo;

  inputImagemFile.addEventListener("change", function () {
    if (this.files.length > 0 && this.files[0].size > 3145728) {
      alert("O arquivo é muito grande! O tamanho máximo é de 3MB.");
      this.value = "";
    } else if (this.files.length > 0) {
      const formData = new FormData();
      formData.append("imagem", this.files[0]);

      fetch("/api/refeitorio", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          inputImagemUrl.value = data.imageUrl;
        })
        .catch((error) => {
          alert("Erro ao fazer upload da imagem");
        });
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    formData = new FormData(informativoForm);
    // Se estiver editando, incluir o ID de edição
    if (editandoId !== null) {
        formData.append("id", editandoId);
    }

    // Adicionar os novos campos de data de início e término ao FormData
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    // Verificar se a data de início está no passado
    const hoje = new Date().toISOString().split('T')[0];
    if (!dataInicio || dataInicio < hoje) {
        // Verificar se o formData já possui o campo dataInicio
        if (!formData.has("dataInicio")) {
            formData.append("dataInicio", hoje);
        } else {
            // Atualizar o valor do campo dataInicio
            formData.set("dataInicio", hoje);
        }
    }

    // Verificar se a data de término é anterior à data de início
    if (dataInicio && dataFim && dataFim < dataInicio) {
        alert("A data de término não pode ser anterior à data de início.");
        return; // Abortar o envio do formulário
    }

    // Adicionar o campo videoComSom ao FormData
    const inputVideoComSom = document.getElementById("videoComSom");
    formData.append("videoComSom", inputVideoComSom.checked ? "true" : "false");

    // Definir a data da postagem como a data atual
    const dataPostagem = hoje;
    formData.append("dataPostagem", dataPostagem);

    fetch("/api/refeitorio", {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Falha ao enviar o informativo");
        }
        return response.json();
    })
    .then((data) => {
        loadInformativos();
        form.reset();
        editandoId = null;
    })
    .catch((error) => {
        // Verifica se há uma mensagem de erro retornada pelo servidor
        if (error.response && error.response.data && error.response.data.error) {
            // Se houver, exibe a mensagem de erro retornada pelo servidor
            alert("Erro ao enviar o informativo: " + error.response.data.error);
        } else {
            // Se não houver mensagem de erro específica, exibe uma mensagem genérica
            alert("Erro ao enviar o informativo. Por favor, tente novamente mais tarde.");
        }
    });

    console.log("Depois de ter enviado:");
    formData.forEach(function(value, key) {
        console.log(key + ": " + value);
    });
  });

  loadInformativos();
});
