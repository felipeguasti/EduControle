# EduControle

## Introdução
EduControle é um sistema de reserva de equipamentos e espaços desenvolvido para a EEEEFM Coronel Olímpio Cunha. Este sistema facilita a reserva de diversos recursos, como tablets, chromebooks, quadros interativos, entre outros, por parte dos usuários.

## Instalação

Para instalar e configurar o EduControle, siga estas etapas:

1. Clone o repositório:
   git clone https://github.com/felipeguasti/EduControle

2. Entre no diretório do projeto:
   cd EduControle

3. Instale as dependências do projeto:
   npm install

4. Baixe e configure o MySQL em seu sistema, se ainda não estiver instalado.

5. Execute o script `syncModels.js` para forçar a gravação das tabelas do banco de dados:
   node syncModels.js

6. Inicie o banco de dados MySQL (O comando pode variar dependendo do sistema operacional):
   sudo service mysql start

7. Para rodar o servidor do EduControle:
   npm start

## Uso
Para iniciar o servidor após a instalação, execute: npm start Acesse `http://localhost:3000` para utilizar a aplicação.

## Contribuição
Contribuições são bem-vindas! Para contribuir com o projeto, siga estas etapas: 1. Fork o repositório. 2. Crie uma nova branch: git checkout -b minha-nova-feature. 3. Faça suas alterações e commit: git commit -am 'Adiciona alguma feature'. 4. Envie para a branch original: git push origin minha-nova-feature. 5. Crie uma pull request.

## Versionamento
### Versão 1.0 (já finalizada)
- Desenvolvimento do sistema de reserva de equipamentos e espaços.
- Criação de interfaces de usuário para reservas e administração.
- Configuração da base de dados para gerenciamento de reservas e usuários.
- Estabelecimento das regras de negócio para reservas e cancelamentos.

### Versão 2.0 (em andamento)
- Introdução de um limite de 30 dias para as reservas, garantindo uma maior rotatividade dos equipamentos.
- Melhoria na navegação das páginas de anúncios, com botões para avançar e voltar, proporcionando uma experiência de usuário mais fluida.
- Lançamento do painel do refeitório e da sala de aula, expandindo as funcionalidades do sistema para cobrir mais áreas da instituição.
- Otimização da área administrativa, tornando-a mais intuitiva e eficiente para os gestores.
- Implementação de uma funcionalidade que permite ao administrador programar anúncios, oferecendo maior flexibilidade na comunicação.
- Aprimoramento da visualização de anúncios na página do administrador, com opções para avançar e recuar, facilitando a gestão de conteúdo.
- Desenvolvimento do lobby de aplicativos, que se tornará a nova página inicial, reorganizando o acesso aos diferentes sistemas e serviços.
- A atual página inicial será renomeada para "Equipamentos", e um ícone no lobby será adicionado para acessar o sistema de reservas de equipamentos.

## Licença
Este projeto e todos os direitos associados estão reservados sob a licença "All Rights Reserved". Qualquer uso, reprodução ou distribuição do software ou de parte dele requer a autorização expressa do desenvolvedor.