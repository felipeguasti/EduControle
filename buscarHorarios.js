const Reserva = require('./src/models/reserva'); // Certifique-se de que este é o modelo Sequelize
const { Op } = require('sequelize');

// Simulando dados que normalmente viriam do front-end
const recursoSimulado = 'Tablet';
const dataSimulada = '2024-02-26'; // Use o formato apropriado
const turnoSimulado = 'Matutino'; // ou 'Vespertino'

// Horários para cada turno e quantidades de recursos
const horariosPorTurno = {
    'Matutino': ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30'],
    'Vespertino': ['13:00', '13:50', '14:40', '15:30', '16:40', '17:30']
};

const quantidades = {
    'RecursoExemplo': 2 // Exemplo, ajuste conforme necessário
};

async function buscarHorariosDisponiveis(recurso, data, turno) {
    try {
        const dataInicio = new Date(data);
        const dataFim = new Date(data);

        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(23, 59, 59, 999);

        const reservasDoDia = await Reserva.findAll({
            where: {
                recurso: recurso,
                data: {
                    [Op.between]: [dataInicio, dataFim]
                }
            }
        });

        console.log("Reservas do Dia:", reservasDoDia);

        let horariosComDisponibilidade = {};
        const todosHorarios = horariosPorTurno[turno] || [];

        todosHorarios.forEach(horario => {
            const reservasParaHorario = reservasDoDia.filter(reserva => reserva.horario === horario).length;
            horariosComDisponibilidade[horario] = reservasParaHorario < quantidades[recurso];
        });

        console.log("Horários com Disponibilidade:", horariosComDisponibilidade);
        return horariosComDisponibilidade;
    } catch (error) {
        console.error("Erro ao buscar horários:", error.message);
        return null;
    }
}

// Executando a função com dados simulados
buscarHorariosDisponiveis(recursoSimulado, dataSimulada, turnoSimulado)
    .then(horarios => {
        if (horarios) {
            console.log("Resultado da Função:", horarios);
        }
    });
