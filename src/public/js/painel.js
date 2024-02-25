// Variável global para manter o rastreamento do recurso atualmente selecionado
let recursoAtual = 'Tablets';
let dataInicioSemana = obterDataInicioSemanaAtual();

document.addEventListener('DOMContentLoaded', function() {  
    atualizarCalendarioParaRecurso(recursoAtual);
    carregarAnunciosRecentes();

    // Definindo event listeners para cada botão de recurso
    const botoesRecursos = document.querySelectorAll('button[data-recurso]');
    botoesRecursos.forEach(botao => {
        botao.addEventListener('click', function() {
            botoesRecursos.forEach(b => b.classList.remove('botao-ativo'));
            recursoAtual = this.getAttribute('data-recurso');
            this.classList.add('botao-ativo');
            atualizarCalendarioParaRecurso(recursoAtual);
        });
    });

    // Marcar o botão do recurso atualmente selecionado como ativo
    const botaoAtivo = document.querySelector(`button[data-recurso='${recursoAtual}']`);
    if (botaoAtivo) {
        botaoAtivo.classList.add('botao-ativo');
    }

    // Atualizações automáticas a cada minuto
    setInterval(function() {
        atualizarCalendarioParaRecurso(recursoAtual);
        carregarAnunciosRecentes();
    }, 60000); // 60000 milissegundos = 1 minuto
});

function carregarAnunciosRecentes() {
    fetch('/admin/anuncios/recentes')
    .then(response => response.json())
    .then(anuncios => {
        const conteudoAnunciosDiv = document.getElementById('conteudoAnuncios');
        conteudoAnunciosDiv.innerHTML = '';

        anuncios.forEach(anuncio => {
            const dataPublicacao = new Date(anuncio.dataPublicacao);
            const dataFormatada = dataPublicacao.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const anuncioElement = document.createElement('div');
            anuncioElement.innerHTML = `
                <p><img class="anuncio-icon" src="/images/anunciosRecentes.png"> <b>${anuncio.tituloAnuncio}:</b> ${anuncio.conteudoAnuncio}</p>
                <h6>Publicado em ${dataFormatada}.</h6>
            `;            
            conteudoAnunciosDiv.appendChild(anuncioElement);
        });
    })
    .catch(error => console.error('Erro ao carregar anúncios:', error));
}

function atualizarCalendarioParaRecurso(recurso) {
    const data = obterDataInicioSemanaAtual();
    const turno = obterTurnoAtual();

    // Atualiza o cabeçalho do calendário com os dias da semana
    criarCabecalhoCalendario();

    fetch(`/api/disponibilidade/${recurso}/painel?turno=${turno}&dataInicio=${data}`)
        .then(response => response.json())
        .then(reservasPorDia => {
            const corpoCalendario = document.getElementById('corpoCalendario');
            corpoCalendario.innerHTML = '';

            // Assumindo que todos os dias têm os mesmos horários disponíveis
            const horarios = Object.keys(reservasPorDia[Object.keys(reservasPorDia)[0]]);

            horarios.forEach(horario => {
                const linhaHorario = document.createElement('tr');

                Object.keys(reservasPorDia).forEach(dia => {
                    const reserva = reservasPorDia[dia][horario];
                    const celulaHorario = document.createElement('td');

                    if (reserva) {
                        celulaHorario.classList.add(reserva.disponivel ? 'disponivel' : 'indisponivel');
                        celulaHorario.innerHTML = `<strong>${horario}</strong>: ${reserva.disponivel ? 'Disponível' : 'Indisponível'}<br>`;

                        // Verificar se há professores e se a informação de turmas está disponível
                        if (reserva.professores && reserva.professores.length > 0 && reserva.turmas) {
                            const professoresFormatados = reserva.professores.map((prof, index) => `${prof} (${reserva.turmas[index]})`).join(', ');
                            celulaHorario.innerHTML += `Professores:<br>${professoresFormatados}`;
                        }
                    }

                    linhaHorario.appendChild(celulaHorario);
                });

                corpoCalendario.appendChild(linhaHorario);
            });
        })
        .catch(error => console.error('Erro ao buscar reservas:', error));
}    

function obterTurnoAtual() {
    // Criar um objeto de data/hora atual
    var agora = new Date();

    // Definir o fuso horário de Brasília (UTC-3)
    var offsetBrasilia = -3;
    var utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
    var horaBrasilia = new Date(utc + (3600000 * offsetBrasilia));

    // Obter as horas e minutos atuais
    var horas = horaBrasilia.getHours();
    var minutos = horaBrasilia.getMinutes();

    // Definir o horário de corte para 12:30
    if (horas < 12 || (horas === 12 && minutos <= 30)) {
        return 'Matutino';
    } else {
        return 'Vespertino';
    }
}

document.getElementById('btnSemanaAnterior').addEventListener('click', function() {
    // Subtrair 7 dias da dataInicioSemana
    dataInicioSemana.setDate(dataInicioSemana.getDate() - 7);
    atualizarCalendarioParaRecurso(recursoAtual);
});

document.getElementById('btnProximaSemana').addEventListener('click', function() {
    // Adicionar 7 dias à dataInicioSemana
    dataInicioSemana.setDate(dataInicioSemana.getDate() + 7);
    atualizarCalendarioParaRecurso(recursoAtual);
});

// Usar a função para definir o turno
var turno = obterTurnoAtual();

function obterDataInicioSemanaAtual() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // Domingo é 0, Segunda é 1, e assim por diante
    const diferencaDias = diaDaSemana === 0 ? 0 - 6 : 0 - (diaDaSemana - 1); // Se for domingo, considere 6 dias para trás, caso contrário diaDaSemana - 1
    hoje.setDate(hoje.getDate() + diferencaDias); // Ajusta a data para o domingo da semana atual
    hoje.setHours(0, 0, 0, 0); // Zera a hora, minuto, segundo e milissegundo

    return hoje;
}

function obterDiasDaSemanaAtual() {
    let datas = [];
    let diaAtual = new Date(dataInicioSemana); // Utiliza a data de início da semana

    // Adiciona cada dia da semana (domingo a sábado) com base na data de início
    for (let i = 0; i < 7; i++) {
        datas.push(new Date(diaAtual));
        diaAtual.setDate(diaAtual.getDate() + 1);
    }

    return datas;
}

function criarCabecalhoCalendario() {
    const diasDaSemana = obterDiasDaSemanaAtual();
    const cabecalhoCalendario = document.getElementById('cabecalhoCalendario');
    cabecalhoCalendario.innerHTML = ''; // Limpa o cabeçalho atual

    diasDaSemana.forEach(dia => {
        let th = document.createElement('th');
        th.textContent = formatarDataParaCabecalho(dia);
        cabecalhoCalendario.appendChild(th);
    });
}

function formatarDataParaCabecalho(data) {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaDaSemana = diasDaSemana[data.getDay()];
    const diaDoMes = data.getDate();
    return `${diaDaSemana} (${diaDoMes})`;
}

function obterHorarios() {
    return ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30', '13:00', '13:50', '14:40', '15:30', '16:40', '17:30'];
}
