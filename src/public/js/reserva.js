document.addEventListener("DOMContentLoaded", function () {
  // Function definitions
  function setRecursoFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const recurso = urlParams.get("recurso");
    if (recurso) {
      const selectRecurso = document.getElementById("recurso");
      if (selectRecurso) {
        selectRecurso.value = recurso;
      }
    }
  }

  function setRecursoInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const recurso = urlParams.get("recurso");

    document.getElementById("recursoInfo").textContent =
      "Recurso selecionado: " + recurso;
  }

  async function buscarQuantidadeRecurso(recurso) {
    try {
      const resposta = await fetch(`/reservas/quantidade/${recurso}`);
      if (!resposta.ok) {
        throw new Error("Resposta do servidor não foi OK");
      }
      const dados = await resposta.json();
      return dados.quantidade;
    } catch (erro) {
      console.error("Erro ao buscar quantidade do recurso:", erro);
      return null;
    }
  }

  async function atualizarQuantidadeRecurso() {
    const urlParams = new URLSearchParams(window.location.search);
    const recurso = urlParams.get("recurso");
    const divQuantidade = document.getElementById("recursoQuantidade");

    if (recurso) {
      const quantidade = await buscarQuantidadeRecurso(recurso);
      if (quantidade !== null) {
        divQuantidade.textContent = `Quantidade: ${quantidade} dispositivo${
          quantidade > 1 ? "s" : ""
        }`;
      } else {
        divQuantidade.textContent =
          "Quantidade não disponível para este recurso";
      }
    }
  }

  document.getElementById("data").addEventListener("change", function () {
    const dataSelecionada = new Date(this.value);
    const diaDaSemana = dataSelecionada.getDay();

    // Verifica se é sábado (6) ou domingo (0)
    if (diaDaSemana === 5 || diaDaSemana === 6) {
      alert("Não é possível escolher datas no fim de semana.");
      // Limpa o campo de data
      this.value = "";
    }
  });

  function validarFormulario() {
    const dataReserva = document.getElementById("data").value;
    const recurso = document.getElementById("recurso").value;
    const professor = document.getElementById("professor").value;
    const turma = document.getElementById("turma").value;
    const permiteOutrosMeses = document.querySelector("#permiteOutrosMeses input[type='checkbox']").checked;
    console.log("permiteOutrosMeses:", permiteOutrosMeses);
    const dataReservaDate = new Date(dataReserva);
    const dataAtual = new Date();
    dataReservaDate.setHours(0, 0, 0, 0);
    dataAtual.setHours(0, 0, 0, 0);
    console.log("hoje é", dataAtual);

    let mensagemErro = "";

    if (!recurso) {
        mensagemErro = "Por favor, selecione um recurso para reservar.";
    } else if (!professor) {
        mensagemErro = "Por favor, informe o nome do professor.";
    } else if (!turma) {
        mensagemErro = "Por favor, informe a turma.";
    } else if (!permiteOutrosMeses) {
        const ultimoDiaMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
        const setimoDiaAntesFimMes = new Date(ultimoDiaMesAtual.getFullYear(), ultimoDiaMesAtual.getMonth(), ultimoDiaMesAtual.getDate() - 7);
        console.log("Setimo dia antes do fim", setimoDiaAntesFimMes);
        if (!(dataAtual >= setimoDiaAntesFimMes || dataReservaDate.getMonth() === dataAtual.getMonth())) {
            mensagemErro = "A reserva só pode ser feita para o mês atual ou, nos últimos 7 dias do mês, para o mês seguinte.";
        }
    }
    if (mensagemErro) {
        alert(mensagemErro);
        return false;
    }
    return true;
  }


  function exibirCarregamento(carregando) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (carregando) {
      if (!loadingIndicator) {
        const newLoadingIndicator = document.createElement("div");
        newLoadingIndicator.setAttribute("id", "loadingIndicator");
        newLoadingIndicator.textContent = "Carregando...";
        document.body.appendChild(newLoadingIndicator);
      } else {
        loadingIndicator.style.display = "block";
      }
    } else {
      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }
    }
  }

  function atualizarOpcoesTurma(turno) {
    const opcoesMatutino = [
      "6ºM01",
      "6ºM02",
      "6ºM03",
      "6ºM04",
      "6ºM05",
      "7ºM01",
      "7ºM02",
      "7ºM03",
      "7ºM04",
      "8ºM01",
      "8ºM02",
      "8ºM03",
      "9ºM01",
      "9ºM02",
      "9ºM03",
      "Reunião",
    ];
    const opcoesVespertino = [
      "9ºM01",
      "1ºV01",
      "1ºV02",
      "1ºV03",
      "1ºV04",
      "1ºV05",
      "1ºV06",
      "2ºV01",
      "2ºV02",
      "2ºV03",
      "2ºV04",
      "3ºV01",
      "3ºV02",
      "3ºV03",
      "Reunião",
    ];

    let opcoes = turno === "Matutino" ? opcoesMatutino : opcoesVespertino;
    const selectTurma = document.getElementById("turma");
    selectTurma.innerHTML = "";
    opcoes.forEach((turma) => {
      selectTurma.innerHTML += `<option value="${turma}">${turma}</option>`;
    });
  }

  async function buscarHorariosDisponiveis() {
    const selectData = document.getElementById("data");
    const selectRecurso = document.getElementById("recurso");
    const selectTurno = document.getElementById("turno");
    const data = selectData.value;
    const recurso = selectRecurso.value;
    const turno = selectTurno.value;

    if (!data || !recurso || !turno) {
      return;
    }

    fetch(`/api/disponibilidade/${recurso}?data=${data}&turno=${turno}`)
      .then((response) => response.json())
      .then((horarios) => {
        const containerHorarios = document.getElementById(
          "horariosDisponiveis"
        );
        containerHorarios.innerHTML = "";

        for (const [horario, disponivel] of Object.entries(horarios)) {
          const horarioInput = document.createElement("input");
          horarioInput.type = "radio";
          horarioInput.id = horario;
          horarioInput.name = "horario";
          horarioInput.value = horario;
          horarioInput.disabled = !disponivel;

          const horarioLabel = document.createElement("label");
          horarioLabel.htmlFor = horario;
          horarioLabel.textContent = horario;

          const simboloSpan = document.createElement("span");
          simboloSpan.textContent = disponivel ? " ✓" : " ✗";
          simboloSpan.classList.add(
            disponivel ? "simbolo-disponivel" : "simbolo-indisponivel"
          );

          const textoSpan = document.createElement("span");
          textoSpan.textContent = disponivel ? " Disponível" : " Indisponível";
          textoSpan.classList.add("texto-status");

          const horarioDiv = document.createElement("div");
          horarioDiv.classList.add("horario-item");
          containerHorarios.appendChild(horarioDiv);
          horarioDiv.appendChild(horarioLabel);
          horarioDiv.appendChild(horarioInput);
          horarioDiv.appendChild(simboloSpan);
          horarioDiv.appendChild(textoSpan);
        }
      })
      .catch((error) => console.error("Erro ao buscar horários:", error));
  }

  // Event listeners and initializations
  const formReserva = document.getElementById("formReserva");
  formReserva.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validarFormulario()) return;

    exibirCarregamento(true);
    const formData = new FormData(formReserva);
    const dadosFormulario = {};
    formData.forEach((value, key) => {
      dadosFormulario[key] = value;
    });

    let url = "/api/reservas";
    let method = "POST";

    // Verifica se estamos editando uma reserva existente
    if (dadosFormulario.idReserva) {
      url = `/api/reservas/${dadosFormulario.idReserva}`;
      method = "PUT";
    }
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosFormulario),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        exibirCarregamento(false);

        if (
          method === "POST" &&
          data.reservaSalva &&
          data.reservaSalva.id !== undefined
        ) {
          alert("Reserva realizada com sucesso!");
          atualizarHorariosDisponiveis();
        } else if (method === "PUT" && data && data.id !== undefined) {
          alert("Reserva atualizada com sucesso!");
          atualizarHorariosDisponiveis();
        } else {
          // Tratamento de erro
          alert(
            "Erro ao realizar a reserva: " +
              (data.message || "Erro desconhecido")
          );
        }
      })
      .catch((error) => {
        exibirCarregamento(false);
        console.error("Erro durante a requisição fetch:", error);
        alert("Erro ao realizar a reserva.");
      });
  });

  function atualizarHorariosDisponiveis() {
    document.getElementById("horariosDisponiveis").value = "";
    document.getElementById("observacoes").value = "";
    document.getElementById("calendarioSemanal").value = "";
    buscarHorariosDisponiveis();
    atualizarCalendarioSemanal();
  }

  function abrirPopupSelecaoProfessor(idsReservas, professores) {
    let listaProfessores = "";

    // Criar uma lista de botões para cada professor
    professores.forEach((professor, index) => {
      listaProfessores += `<button class="professor-button" data-id-reserva="${idsReservas[index]}">${professor}</button>`;
    });

    // Inserir a lista de professores no popup modal
    document.getElementById("listaProfessores").innerHTML = listaProfessores;

    // Adicionar eventos de clique aos botões dos professores
    const professorButtons = document.querySelectorAll(".professor-button");
    professorButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const idReserva = this.getAttribute("data-id-reserva");
        carregarDetalhesReserva(idReserva);
        fecharPopupProfessores();
      });
    });

    // Exibir o popup modal
    document.getElementById("popupProfessores").style.display = "block";
  }

  function fecharPopupProfessores() {
    // Esta função agora será chamada diretamente pelo evento de clique no botão "x" do popup
    document.getElementById("popupProfessores").style.display = "none";
  }

  // Adiciona um evento de clique ao elemento "x" do popup para fechar o popup
  document
    .querySelector(".close")
    .addEventListener("click", fecharPopupProfessores);
    
  function carregarDetalhesReserva(reservaId) {
    fetch(`/api/reservas/${reservaId}`)
      .then((response) => response.json())
      .then((reserva) => {
        // Verifica e preenche cada campo do formulário se o dado estiver disponível
        if (reserva.data) {
          const formattedDate = new Date(reserva.data)
            .toISOString()
            .split("T")[0];
          document.getElementById("data").value = formattedDate;
        }
        if (reserva.hora) {
          const horarioSelecionado = reserva.hora;
          const radios = document.getElementsByName("horario");
          for (const radio of radios) {
            if (radio.value === horarioSelecionado) {
              radio.checked = true;
              break;
            }
          }
        }
        if (reserva.professor) {
          document.getElementById("professor").value = reserva.professor;
        }
        if (reserva.turma) {
          document.getElementById("turma").value = reserva.turma;
        }
        // Ajuste para acessar o campo de ID da reserva corretamente
        // Atribuir o ID da reserva ao campo oculto
        const idReservaElement = document.getElementById("idReserva");
        if (idReservaElement) {
          idReservaElement.value = reservaId;
        } else {
          // Se o elemento não existir, crie e adicione ao formulário
          const hiddenIdField = document.createElement("input");
          hiddenIdField.setAttribute("type", "hidden");
          hiddenIdField.setAttribute("id", "idReserva");
          hiddenIdField.setAttribute("name", "idReserva");
          hiddenIdField.value = reservaId;
          document.getElementById("formReserva").appendChild(hiddenIdField);
        }
        // Rolar para o formulário de reserva se necessário
        document.getElementById("formReserva").scrollIntoView();
        atualizarQuantidadeRecurso();
        buscarHorariosDisponiveis();
      })
      .catch((error) => console.error("Erro ao buscar dados da reserva:", error));
  }

  function abrirPopupSelecao(idsReservas, professores, modo) {
    let listaProfessores = "";
    professores.forEach((professor, index) => {
      listaProfessores += `<button class="professor-button" data-id-reserva="${idsReservas[index]}">${professor}</button>`;
    });
    document.getElementById("listaProfessores").innerHTML = listaProfessores;

    const professorButtons = document.querySelectorAll(".professor-button");
    professorButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const idReserva = this.getAttribute("data-id-reserva");
        if (modo === "editar") {
          carregarDetalhesReserva(idReserva);
        } else if (modo === "excluir") {
          excluirReserva(idReserva);
        }
        atualizarHorariosDisponiveis();
        buscarHorariosDisponiveis();
      });
    });
    document.getElementById("popupProfessores").style.display = "block";
  }

  // Função para excluir uma reserva
  function excluirReserva(idReserva) {
    fetch(`/api/reservas/${idReserva}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          alert("Reserva excluída com sucesso");
          // Atualize a interface do usuário aqui
        } else {
          alert("Erro ao excluir a reserva");
        }
        fecharPopupProfessores();
        atualizarHorariosDisponiveis();
      })
      .catch((error) => {
        console.error("Erro ao excluir a reserva:", error);
        alert("Erro ao excluir a reserva");
      });
  }

  function atualizarCalendarioSemanal() {
    const selectRecurso = document.getElementById("recurso");
    const selectData = document.getElementById("data");
    const recurso = selectRecurso.value;
    const data = selectData.value;
    const turno = selectTurno.value;

    if (!data || !recurso) {
      return;
    }

    fetch(
      `/api/disponibilidade/${recurso}/semana?turno=${turno}&dataInicio=${data}`
    )
      .then((response) => response.json())
      .then((reservasPorDia) => {
        const corpoCalendario = document.getElementById("corpoCalendario");
        corpoCalendario.innerHTML = ""; // Limpa o conteúdo atual

        // Assumindo que o primeiro dia na resposta contém todos os horários possíveis
        const primeiroDia = Object.keys(reservasPorDia)[0];
        const horarios = Object.keys(reservasPorDia[primeiroDia]);

        horarios.forEach((horario) => {
          const linhaHorario = document.createElement("tr");
          Object.entries(reservasPorDia).forEach(([dia, reservasDia]) => {
            const celulaHorario = document.createElement("td");
            const reserva = reservasDia[horario];

            // Create a span or strong element for the horario part
            const horarioSpan = document.createElement("strong");
            horarioSpan.textContent = horario;

            // Append the horario part to the cell
            celulaHorario.appendChild(horarioSpan);

            // Add text node for separator
            celulaHorario.appendChild(document.createTextNode(" - "));

            if (reserva && reserva.disponivel) {
              if (reserva.professores != "") {
                const professoresText = document.createTextNode(
                  reserva.professores
                );
                celulaHorario.appendChild(professoresText);
                celulaHorario.classList.add("disponivel");
              } else {
                celulaHorario.appendChild(
                  document.createTextNode("Disponível")
                );
                celulaHorario.classList.add("disponivel");
              }
            } else if (reserva) {
              const professoresText = document.createTextNode(
                reserva.professores.join(", ")
              );
              celulaHorario.appendChild(professoresText);
            }

            // Create a break line element
            const breakLine = document.createElement("br");
            celulaHorario.appendChild(breakLine);

            // Container para ícones
            const iconContainer = document.createElement("div");
            iconContainer.className = "icon-container";

            // Add Edit Icon
            const editIcon = document.createElement("img");
            if (reserva && reserva.disponivel === true) {
              if (reserva.professores != "") {
                editIcon.src = "/images/editar.png";
                editIcon.className = "edit-reserva-icon";
              }
            } else {
              editIcon.src = "/images/editar.png";
              editIcon.className = "edit-reserva-icon";
            }

            if (
              reserva &&
              reserva.idsReservas &&
              reserva.idsReservas.length > 1
            ) {
              // Se houver múltiplas reservas no mesmo horário, ativar o popup
              editIcon.onclick = () => {
                abrirPopupSelecaoProfessor(
                  reserva.idsReservas,
                  reserva.professores
                );
                buscarHorariosDisponiveis();
              };
            } else if (
              reserva &&
              reserva.idsReservas &&
              reserva.idsReservas.length === 1
            ) {
              // Se houver apenas uma reserva, carregar os detalhes diretamente
              editIcon.onclick = async () =>
                carregarDetalhesReserva(reserva.idsReservas[0]);
            }

            celulaHorario.appendChild(editIcon);

            // Adicionando o ícone de exclusão para cada reserva
            const deleteIcon = document.createElement("img");

            if (reserva && reserva.disponivel === true) {
              if (reserva.professores != "") {
                deleteIcon.src = "/images/excluir.png";
                deleteIcon.className = "delete-reserva-icon";
              }
            } else {
              deleteIcon.src = "/images/excluir.png";
              deleteIcon.className = "delete-reserva-icon";
            }

            if (
              reserva &&
              reserva.idsReservas &&
              reserva.idsReservas.length > 1
            ) {
              deleteIcon.onclick = () => {
                abrirPopupSelecao(
                  reserva.idsReservas,
                  reserva.professores,
                  "excluir"
                );
              };
            } else if (
              reserva &&
              reserva.idsReservas &&
              reserva.idsReservas.length === 1
            ) {
              deleteIcon.onclick = () => excluirReserva(reserva.idsReservas[0]);
            }

            celulaHorario.appendChild(deleteIcon);

            // Adicionando o container de ícones à célula
            celulaHorario.appendChild(iconContainer);
            linhaHorario.appendChild(celulaHorario);
          });
          corpoCalendario.appendChild(linhaHorario);
        });
      })
      .catch((error) => console.error("Erro ao buscar reservas:", error));
  }

  function redefinirListeners() {
    const selectData = document.getElementById("data");
    const selectRecurso = document.getElementById("recurso");
    const selectTurno = document.getElementById("turno");

    selectData.removeEventListener("change", buscarHorariosDisponiveis);
    selectData.addEventListener("change", buscarHorariosDisponiveis);

    selectRecurso.removeEventListener("change", buscarHorariosDisponiveis);
    selectRecurso.addEventListener("change", buscarHorariosDisponiveis);

    selectTurno.removeEventListener("change", buscarHorariosDisponiveis);
    selectTurno.addEventListener("change", buscarHorariosDisponiveis);
  }

  function encontrarUltimaSegundaFeira(data) {
    const diaDaSemana = data.getDay();
    const diferencaParaSegunda = diaDaSemana - 1; // 1 é segunda-feira
    const ultimaSegunda = new Date(data);
    ultimaSegunda.setDate(data.getDate() - diferencaParaSegunda);
    return ultimaSegunda;
  }

  function formatarDataParaCabecalho(data) {
    const diasDaSemana = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
    const diaDaSemana = diasDaSemana[data.getDay()];
    const diaDoMes = data.getDate();
    return `${diaDaSemana} (${diaDoMes})`;
  }

  function preencherCabecalhoCalendario() {
    const dataSelecionada = new Date(document.getElementById("data").value);
    const segundaFeira = encontrarUltimaSegundaFeira(dataSelecionada);
    const cabecalhoCalendario = document.getElementById("cabecalhoCalendario");
    cabecalhoCalendario.innerHTML = ""; // Limpa o cabeçalho existente

    for (let i = 0; i < 5; i++) {
      // Apenas 5 dias da semana (segunda a sexta)
      const dataParaCabecalho = new Date(segundaFeira);
      dataParaCabecalho.setDate(segundaFeira.getDate() + i);
      const diaFormatado = formatarDataParaCabecalho(dataParaCabecalho);

      const celulaCabecalho = document.createElement("th");
      celulaCabecalho.textContent = diaFormatado;
      cabecalhoCalendario.appendChild(celulaCabecalho);
    }
  }

  // Adicionar um ouvinte de evento para atualizar o cabeçalho quando a data for alterada
  document.getElementById("data").addEventListener("change", preencherCabecalhoCalendario);
  const selectRecurso = document.getElementById("recurso");
  const selectData = document.getElementById("data");
  const selectTurno = document.getElementById("turno");

  // Definindo a data atual no campo de seleção de data
  const dataAtual = new Date().toISOString().split('T')[0];
  selectData.value = dataAtual;

  // Obter o horário local do navegador
  const hora = new Date().getHours();
  const minutos = new Date().getMinutes();

  // Definir o turno com base no horário local
  if (hora < 12 || (hora === 12 && minutos <= 30)) {
      selectTurno.value = "Matutino";
  } else {
      selectTurno.value = "Vespertino";
  }

    
  selectTurno.addEventListener("change", function () {
    buscarHorariosDisponiveis();
    atualizarCalendarioSemanal();
  });

  selectTurno.addEventListener("change", function () {
    atualizarOpcoesTurma(this.value);
  });
  selectRecurso.addEventListener("change", buscarHorariosDisponiveis);
  selectData.addEventListener("change", buscarHorariosDisponiveis);
  selectTurno.addEventListener("change", buscarHorariosDisponiveis);

  selectRecurso.addEventListener("change", atualizarCalendarioSemanal);
  selectData.addEventListener("change", atualizarCalendarioSemanal);
  selectTurno.addEventListener("change", atualizarCalendarioSemanal);

  const container = document.getElementById("permiteOutrosMeses");
  adicionarCheckbox(container, "Reunião?");

  function atualizarCarregamento() {
    const selectData = document.getElementById("data");
    const dataAtual = new Date().toISOString().split('T')[0];
    selectData.value = dataAtual;
    atualizarCalendarioSemanal();
  }


  // Call functions to initialize the page
  setRecursoFromURL();
  setRecursoInfo();
  buscarHorariosDisponiveis();
  atualizarOpcoesTurma(selectTurno.value);
  atualizarCalendarioSemanal();
  atualizarQuantidadeRecurso();
  atualizarCarregamento();
});

function adicionarCheckbox(container, label) {
  const checkboxDiv = document.createElement("div");
  const checkboxLabel = document.createElement("label");
  checkboxLabel.textContent = label;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = label.toLowerCase().replace("?", "");
  checkboxLabel.appendChild(checkbox);
  checkboxDiv.appendChild(checkboxLabel);
  container.appendChild(checkboxDiv);
}

document.getElementById("turno").addEventListener("change", function () {
  const container = document.getElementById("permiteOutrosMeses");
  container.innerHTML = ""; // Limpa o conteúdo atual antes de adicionar o novo campo de checkbox
  const turnoSelecionado = this.value;
  
  if (turnoSelecionado === "Matutino") {
      adicionarCheckbox(container, "Reunião?");
  } else if (turnoSelecionado === "Vespertino") {
      adicionarCheckbox(container, "Letrus?");
  }
});
