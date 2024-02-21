const Reserva = require('../models/reserva');
// Horários para cada turno
const horariosPorTurno = {
    'Matutino': ['7:00', '7:50', '8:40', '9:50', '10:40', '11:30'],
    'Vespertino': ['13:00', '13:50', '14:40', '15:30', '16:40', '17:30']
};

// Quantidade total disponível para cada tipo de recurso
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
        const recurso = req.params.recurso;
        const data = req.query.data;
        const turno = req.query.turno; // Novo parâmetro para o turno
        const Reserva = require('../models/reserva');
        
        const reservasDoDia = await Reserva.find({
            recurso: recurso,
            data: {
                $gte: new Date(data).setHours(0, 0, 0, 0),
                $lt: new Date(data).setHours(23, 59, 59, 999)
            }
        });
        
        let horariosComDisponibilidade = {};
        const todosHorarios = horariosPorTurno[turno] || [];
        
        todosHorarios.forEach(horario => {
            const reservasParaHorario = reservasDoDia.filter(reserva => reserva.horario === horario).length;
            if (quantidades[recurso] > 0) {
                horariosComDisponibilidade[horario] = reservasParaHorario < quantidades[recurso];
            } else {
                horariosComDisponibilidade[horario] = false; // Não há recursos disponíveis, então o horário não está disponível
            }
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

        const Reserva = require('../models/reserva');

        // Busca todas as reservas para o recurso na semana selecionada
        const reservasDaSemana = await Reserva.find({
            recurso: recurso,
            data: {
                $gte: dataInicio.setHours(0, 0, 0, 0),
                $lte: dataFim.setHours(23, 59, 59, 999)
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
                    idsReservas: reservasParaHorario.map(reserva => reserva._id), 
                }; 
            });
        }

        res.json(resultadoSemanal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.atualizarReserva = async (req, res) => {
    const reservaId = req.params.id; // O ID da reserva é obtido da URL
    try {
        let reserva = await Reserva.findById(reservaId);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        // Atualiza os campos da reserva com os dados do formulário
        reserva.data = req.body.data || reserva.data;
        reserva.hora = req.body.hora || reserva.hora;
        reserva.professor = req.body.professor || reserva.professor;
        reserva.turma = req.body.turma || reserva.turma;
        // Adicione outros campos conforme necessário...

        // Salva as alterações no banco de dados
        const reservaAtualizada = await reserva.save();
        res.json({ reservaSalva: true, reserva: reservaAtualizada });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deletarReserva = async (req, res) => {
    const reservaId = req.params.id; // O ID da reserva é obtido da URL
    try {
        let reserva = await Reserva.findById(reservaId);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        // Exclui a reserva do banco de dados
        await reserva.remove();
        res.json({ message: 'Reserva excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarReservasPorSemanaPainel = async (req, res) => {
    try {
        const recurso = req.params.recurso;
        const turno = req.query.turno; // Adicionando o parâmetro de turno
        let dataInicio = new Date(req.query.dataInicio);

        // Ajustar para o domingo anterior
        dataInicio.setDate(dataInicio.getDate() - dataInicio.getDay());

        // Calcular a data de término (sábado seguinte)
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);

        const Reserva = require('../models/reserva');

        // Busca todas as reservas para o recurso na semana selecionada
        const reservasDaSemana = await Reserva.find({
            recurso: recurso,
            data: {
                $gte: dataInicio.setHours(0, 0, 0, 0),
                $lte: dataFim.setHours(23, 59, 59, 999)
            }
        });

        let resultadoSemanal = {};
        for (let dia = 1; dia < 6; dia++) {
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
                    idsReservas: reservasParaHorario.map(reserva => reserva._id), 
                    turmas: reservasParaHorario.map(reserva => reserva.turma),
                }; 
            });
        }

        res.json(resultadoSemanal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
