const { Op } = require('sequelize');
const Reserva = require('../models/reserva');

exports.getQuantidadeRecurso = async (req, res) => {
    const recurso = req.params.recurso;
    try {
        const quantidade = await Recurso.findOne({
            attributes: ['quantidade'],
            where: { nome: recurso }
        });
        if (!quantidade) {
            return res.status(404).json({ erro: 'Recurso não encontrado' });
        }
        res.json({ quantidade: quantidade.quantidade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarHorariosDisponiveis = async (req, res) => {
    try {
        const recurso = req.params.recurso;
        const data = req.query.data;
        const turno = req.query.turno;
        
        const reservasDoDia = await Reserva.findAll({
            attributes: ['horario'],
            where: { recurso, data }
        });
        const horariosComDisponibilidade = horariosPorTurno[turno].filter(horario => !reservasDoDia.map(r => r.horario).includes(horario));
        res.json(horariosComDisponibilidade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarReservasPorSemana = async (req, res) => {
    try {
        const recurso = req.params.recurso;
        const turno = req.query.turno;
        let dataInicio = new Date(req.query.dataInicio);
        dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);

        const resultadoSemanal = {};
        for (let dia = 0; dia < 7; dia++) {
            const dataAtual = new Date(dataInicio);
            dataAtual.setDate(dataInicio.getDate() + dia);
            const dataFormatada = dataAtual.toISOString().split('T')[0];
            resultadoSemanal[dataFormatada] = {};
            const horarios = horariosPorTurno[turno];
            for (const horario of horarios) {
                const reservasParaHorario = await Reserva.findAll({
                    where: {
                        recurso,
                        data: { [Op.eq]: dataFormatada },
                        horario
                    }
                });
                const disponivel = reservasParaHorario.length < quantidades[recurso];
                resultadoSemanal[dataFormatada][horario] = {
                    disponivel,
                    professores: reservasParaHorario.map(reserva => reserva.professor),
                    idsReservas: reservasParaHorario.map(reserva => reserva.id)
                }; 
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
        const { data, hora, professor, turma } = req.body;
        const reserva = await Reserva.findByPk(reservaId);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }
        await reserva.update({ data, hora, professor, turma });
        res.json({ message: 'Reserva atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletarReserva = async (req, res) => {
    const reservaId = req.params.id;
    try {
        const deletedRows = await Reserva.destroy({ where: { id: reservaId } });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }
        res.json({ message: 'Reserva excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarReservasPorSemanaPainel = async (req, res) => {
    try {
        const recurso = req.params.recurso;
        const turno = req.query.turno;
        let dataInicio = new Date(req.query.dataInicio);
        dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);

        const resultadoSemanal = {};
        for (let dia = 1; dia < 6; dia++) {
            const dataAtual = new Date(dataInicio);
            dataAtual.setDate(dataInicio.getDate() + dia);
            const dataFormatada = dataAtual.toISOString().split('T')[0];
            resultadoSemanal[dataFormatada] = {};
            const horarios = horariosPorTurno[turno];
            for (const horario of horarios) {
                const reservasParaHorario = await Reserva.findAll({
                    where: {
                        recurso,
                        data: { [Op.eq]: dataFormatada },
                        horario
                    }
                });
                const disponivel = reservasParaHorario.length < quantidades[recurso];
                resultadoSemanal[dataFormatada][horario] = {
                    disponivel,
                    professores: reservasParaHorario.map(reserva => reserva.professor),
                    idsReservas: reservasParaHorario.map(reserva => reserva.id),
                    turmas: reservasParaHorario.map(reserva => reserva.turma)
                }; 
            }
        }
        res.json(resultadoSemanal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
