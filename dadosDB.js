const Reserva = require('../src/models/reserva'); // Atualize o caminho conforme necessário


async function adicionarReservasDeTeste() {
    const datas = ['2024-02-25', '2024-02-26', '2024-02-27']; // Adicione mais datas conforme necessário
    const horarios = ['7:00', '8:40', '10:40']; // Adicione mais horários conforme necessário

    try {
        for (let data of datas) {
            for (let horario of horarios) {
                await Reserva.create({
                    recurso: 'Tablets',
                    data: new Date(data),
                    turno: 'Matutino', // ou 'Vespertino', conforme necessário
                    horario: horario,
                    professor: 'João',
                    turma: '7ºV01'
                    // Adicione mais campos conforme o modelo Reserva requer
                });
            }
        }
        console.log('Reservas adicionadas com sucesso.');
    } catch (error) {
        console.error('Erro ao adicionar reservas:', error);
    }
}

// Chame a função para executar a inserção
adicionarReservasDeTeste();
