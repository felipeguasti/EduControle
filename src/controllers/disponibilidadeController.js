const Reserva = require('../models/reserva'); // Certifique-se de que este é o modelo Sequelize
const { Op } = require('sequelize');

// Horários para cada turno e quantidades de recursos
const horariosPorTurno = {
    'Matutino': ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30'],
    'Vespertino': ['13:00', '13:50', '14:40', '15:30', '16:40', '17:30']
};

const quantidades = {
    'Tablets': 2,
    'Chromebooks': 4,
    'QuadroInterativo': 1,
    'SalaRecursos': 1,
    'Biblioteca': 1
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
        const { turno } = req.query;
        const { recurso } = req.params;
        let dataInicio = new Date(req.query.dataInicio);
        dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);
        
        console.log("Recurso:", recurso);
        console.log("Turno:", turno);
        console.log("Data de Início:", dataInicio);
      
      

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

            const horarios = horariosPorTurno[turno];

            if (horarios) { 
                console.log('Horários:', horarios);
                console.log('Reservas da semana:', reservasDaSemana);
                console.log('Resultado semanal antes do forEach:', resultadoSemanal);
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
            } else {
                console.log("Horários não encontrados para o turno:", turno); // Adiciona uma mensagem de log caso os horários não sejam encontrados
            }
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
        const { recurso, turno } = req.params;
        let dataInicio = new Date(req.query.dataInicio);
        dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);

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

        res.json(resultadoSemanal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
