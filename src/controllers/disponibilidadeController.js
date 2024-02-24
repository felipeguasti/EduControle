const db = require('../config/db');
const moment = require('moment-timezone');

exports.getQuantidadeRecurso = (req, res) => {
    const recurso = req.params.recurso;
    const queryString = 'SELECT quantidade FROM Recursos WHERE nome = ?';
    db.query(queryString, [recurso], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (result.length > 0) {
            res.json({ quantidade: result[0].quantidade });
        } else {
            res.status(404).json({ erro: 'Recurso não encontrado' });
        }
    });
};

exports.buscarHorariosDisponiveis = async (req, res) => {
    try {
        const recurso = req.params.recurso;
        const data = req.query.data;
        const turno = req.query.turno;
        
        const queryString = 'SELECT horario FROM Reservas WHERE recurso = ? AND data = ?';
        db.query(queryString, [recurso, data], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            const reservasDoDia = result.map(row => row.horario);
            const horariosComDisponibilidade = horariosPorTurno[turno].filter(horario => !reservasDoDia.includes(horario));
            res.json(horariosComDisponibilidade);
        });
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

        const queryString = 'SELECT * FROM Reservas WHERE recurso = ? AND data BETWEEN ? AND ?';
        db.query(queryString, [recurso, dataInicio, dataFim], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            let resultadoSemanal = {};
            for (let dia = 0; dia < 7; dia++) {
                const dataAtual = new Date(dataInicio);
                dataAtual.setDate(dataInicio.getDate() + dia);
                const dataFormatada = dataAtual.toISOString().split('T')[0];
                resultadoSemanal[dataFormatada] = {};
                const horarios = horariosPorTurno[turno];
                horarios.forEach(horario => {
                    const reservasParaHorario = result.filter(reserva => 
                        reserva.data.toISOString().split('T')[0] === dataFormatada && 
                        reserva.horario === horario
                    );
                    const disponivel = reservasParaHorario.length < quantidades[recurso];
                    resultadoSemanal[dataFormatada][horario] = {
                        disponivel: disponivel,
                        professores: reservasParaHorario.map(reserva => reserva.professor),
                        idsReservas: reservasParaHorario.map(reserva => reserva._id), 
                    }; 
                });
            }
            res.json(resultadoSemanal);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.atualizarReserva = async (req, res) => {
    const reservaId = req.params.id;
    try {
        const { data, hora, professor, turma } = req.body;
        const queryString = 'UPDATE Reservas SET data = ?, hora = ?, professor = ?, turma = ? WHERE id = ?';
        db.query(queryString, [data, hora, professor, turma, reservaId], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Reserva não encontrada.' });
            }
            res.json({ message: 'Reserva atualizada com sucesso' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletarReserva = async (req, res) => {
    const reservaId = req.params.id;
    try {
        const queryString = 'DELETE FROM Reservas WHERE id = ?';
        db.query(queryString, [reservaId], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Reserva não encontrada.' });
            }
            res.json({ message: 'Reserva excluída com sucesso' });
        });
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

        const queryString = 'SELECT * FROM Reservas WHERE recurso = ? AND data BETWEEN ? AND ?';
        db.query(queryString, [recurso, dataInicio, dataFim], (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            let resultadoSemanal = {};
            for (let dia = 1; dia < 6; dia++) {
                const dataAtual = new Date(dataInicio);
                dataAtual.setDate(dataInicio.getDate() + dia);
                const dataFormatada = dataAtual.toISOString().split('T')[0];
                resultadoSemanal[dataFormatada] = {};
                const horarios = horariosPorTurno[turno];
                horarios.forEach(horario => {
                    const reservasParaHorario = result.filter(reserva => 
                        reserva.data.toISOString().split('T')[0] === dataFormatada && 
                        reserva.horario === horario
                    );
                    const disponivel = reservasParaHorario.length < quantidades[recurso];
                    resultadoSemanal[dataFormatada][horario] = {
                        disponivel: disponivel,
                        professores: reservasParaHorario.map(reserva => reserva.professor),
                        idsReservas: reservasParaHorario.map(reserva => reserva._id), 
                        turmas: reservasParaHorario.map(reserva => reserva.turma),
                    }; 
                });
            }
            res.json(resultadoSemanal);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
