exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ where: { email } }); // Correção aqui
        if (!usuario) {
            return res.status(401).send('Credenciais inválidas.');
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).send('Credenciais inválidas.');
        }
        // Configurar sessão de usuário (implementação pendente)
        res.send('Usuário logado com sucesso.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
