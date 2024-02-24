const db = require('../config/db');

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
            // Lógica para verificar horários disponíveis
            res.json(result);
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
            // Lógica para formatar e retornar as reservas da semana
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuantidadeRecurso = (req, res) => {
    const recurso = req.params.recurso;
    const queryString = 'SELECT quantidade FROM Recursos WHERE nome = ?';
    db.query(queryString, [recurso], (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        // Lógica para retornar a quantidade disponível do recurso
        res.json(result);
    });
};
