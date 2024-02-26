const Reserva = require('../models/reserva'); // Certifique-se de que este é o modelo Sequelize
const { Op } = require('sequelize');

// Horários para cada turno e quantidades de recursos
const horariosPorTurno = {
    'Matutino': ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30'],
    'Vespertino': ['13:00', '13:50', '14:40', '15:30', '16:40', '17:30']
};

const quantidades = {
    'Tablets': 1,
    'Chromebooks': 3,
    'QuadroInterativo': 1,
    'SalaRecursos': 1,
    'Biblioteca': 1,
    'Xbox': 2,
    'Switch': 2
};

// Supondo que este arquivo seja 'controladores/recursoControlador.js'
exports.getQuantidadeRecurso = (req, res) => {
    const recurso = req.params.recurso;
    const quantidade = quantidades[recurso];

    if (quantidade !== undefined) {
        res.json({ quantidade: quantidade });
    } else {
        res.status(404).json({ erro: 'Recurso não encontrado' });
    }
};


exports.buscarHorariosDisponiveis = async (req, res) => {
    try {
        const { recurso } = req.params;
        const { data, turno } = req.query;
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

        // Adicionar log para verificar a resposta do banco de dados
        let horariosComDisponibilidade = {};
        const todosHorarios = horariosPorTurno[turno] || [];

        todosHorarios.forEach(horario => {
            const reservasParaHorario = reservasDoDia.filter(reserva => reserva.horario === horario).length;
            horariosComDisponibilidade[horario] = reservasParaHorario < quantidades[recurso];
        });

        res.json(horariosComDisponibilidade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarReservasPorSemana = async (req, res) => {
    try {
        const recurso = req.params.recurso;
        const turno = req.query.turno; // Adicionando o parâmetro de turno
        let dataInicio = new Date(req.query.dataInicio);

        // Ajustar para o domingo anterior
        dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());

        // Calcular a data de término (sábado seguinte)
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);

        // Busca todas as reservas para o recurso na semana selecionada
        const reservasDaSemana = await Reserva.findAll({
            where: {
                recurso: recurso,
                data: {
                    [Op.between]: [dataInicio, dataFim]
                }
            }
        });

        let resultadoSemanal = {};
        for (let dia = 0; dia < 7; dia++) {
            const dataAtual = new Date(dataInicio);
            dataAtual.setDate(dataInicio.getDate() + dia);
            const dataFormatada = dataAtual.toISOString().split('T')[0];

            resultadoSemanal[dataFormatada] = {};

            const horarios = horariosPorTurno[turno]; // Usa apenas os horários do turno especificado

            // Iterar sobre cada turno e horário
            horarios.forEach(horario => {
                const reservasParaHorario = reservasDaSemana.filter(reserva =>
                    reserva.data.toISOString().split('T')[0] === dataFormatada &&
                    reserva.horario === horario
                );
                const disponivel = reservasParaHorario.length < quantidades[recurso];
                resultadoSemanal[dataFormatada][horario] = {
                    disponivel: disponivel,
                    professores: reservasParaHorario.map(reserva => reserva.professor),
                    idsReservas: reservasParaHorario.map(reserva => reserva.id), // Alterado para utilizar o atributo id do Sequelize
                };
            });
        }

        res.json(resultadoSemanal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.atualizarReserva = async (req, res) => {
    const reservaId = req.params.id;
    try {
        const reservaAtualizada = await Reserva.update(req.body, {
            where: { id: reservaId },
            returning: true
        });

        if (!reservaAtualizada[0]) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        res.json({ reservaSalva: true, reserva: reservaAtualizada[1][0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletarReserva = async (req, res) => {
    const reservaId = req.params.id;
    try {
        const reserva = await Reserva.findByPk(reservaId);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        await reserva.destroy();
        res.json({ message: 'Reserva excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarReservasPorSemanaPainel = async (req, res) => {
    try {
        const { recurso } = req.params;
        const { turno } = req.query;
        let dataInicio = new Date(req.query.dataInicio); // Usando a data recebida diretamente da URL
        dataInicio.setHours(0, 0, 0, 0); // Zerar a hora para o início do dia

        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6); // Adiciona 6 dias à data de início
        dataFim.setHours(23, 59, 59, 999); // Ajusta para o final do dia

        const reservasDaSemana = await Reserva.findAll({
            where: {
                recurso: recurso,
                data: {
                    [Op.between]: [dataInicio, dataFim]
                }
            }
        });
        let resultadoSemanal = {};
        for (let dia = 1; dia < 7; dia++) {
            const dataAtual = new Date(dataInicio);
            dataAtual.setDate(dataInicio.getDate() + dia);
            const dataFormatada = dataAtual.toISOString().split('T')[0];

            resultadoSemanal[dataFormatada] = {};
            const horarios = horariosPorTurno[turno];

            horarios.forEach(horario => {
                const reservasParaHorario = reservasDaSemana.filter(reserva => 
                    reserva.data.toISOString().split('T')[0] === dataFormatada && 
                    reserva.horario === horario
                );
                resultadoSemanal[dataFormatada][horario] = {
                    disponivel: reservasParaHorario.length < quantidades[recurso],
                    reservas: reservasParaHorario.map(reserva => ({
                        id: reserva.id,
                        professor: reserva.professor,
                        turma: reserva.turma
                    }))
                };
            });
        }
        console.log('Reservas da :', resultadoSemanal);
        res.json(resultadoSemanal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
