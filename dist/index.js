"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const commander_1 = require("commander");
const readline_1 = __importDefault(require("readline"));
const usuarioService_1 = require("./services/usuarioService");
const papeisSeeds_1 = require("./seeds/papeisSeeds");
// Definir o caminho do arquivo CSV
const filePath = './src/data/listUsuario.csv';
// Função para carregar os dados do arquivo CSV
const carregarUsuarios = () => {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            return [];
        }
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').slice(1); // Ignorar o cabeçalho
        return lines.filter(line => line.trim()).map(line => {
            const [id, nome, email, senha, papel, dataCadastro, dataUltimaAlteracao, status] = line.split(', ');
            return {
                id,
                nome,
                email,
                senha,
                papel,
                dataCadastro: (0, usuarioService_1.dataFormatada)(new Date(dataCadastro)),
                dataUltimaAlteracao: (0, usuarioService_1.dataFormatada)(new Date(dataUltimaAlteracao)),
                status: status
            };
        });
    }
    catch (err) {
        console.error('Erro ao carregar os dados:', err);
        return [];
    }
};
const usuarios = carregarUsuarios();
commander_1.program.version('1.0.0');
// Configurar readline para entrada do usuário
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const perguntar = (pergunta) => {
    return new Promise(resolve => {
        rl.question(pergunta, resposta => resolve(resposta));
    });
};
// Comando para cadastrar um novo usuário
commander_1.program
    .command('cadastrar')
    .description('Cadastrar um novo usuário')
    .action(async () => {
    console.log("Por favor, insira os dados do novo usuário:");
    const nome = await perguntar("Nome: ");
    const email = await perguntar("Email: ");
    const senha = await perguntar("Senha: ");
    const papel = await perguntar("Papel (ex: Administrador, Convidado, Professor): ");
    const novoUsuario = {
        id: (Math.random() * 1e8).toString(36), // Gerar um ID único simples
        nome,
        email,
        senha,
        papel,
        dataCadastro: (0, usuarioService_1.dataFormatada)(new Date()),
        dataUltimaAlteracao: (0, usuarioService_1.dataFormatada)(new Date()),
        status: 'ativo'
    };
    const resultado = await (0, usuarioService_1.cadastrarUsuario)(usuarios, novoUsuario);
    console.log(resultado);
    rl.close();
});
// Comando para listar todos os usuários
commander_1.program
    .command('listar-todos')
    .description('Listar todos os usuários')
    .action(() => {
    (0, usuarioService_1.listarUsuarios)(usuarios);
});
// Comando para listar um usuário pelo ID
commander_1.program
    .command('listar <id>')
    .description('Listar um usuário pelo ID')
    .action((id) => {
    const resultado = (0, usuarioService_1.listUsuarioId)(usuarios, id);
    console.log(resultado);
});
// Comando para deletar um usuário pelo ID
commander_1.program
    .command('deletar <id>')
    .description('Deletar um usuário pelo ID')
    .action((id) => {
    (0, usuarioService_1.deletUsuario)(usuarios, id);
});
// Comando para atualizar os dados de um usuário
commander_1.program
    .command('atualizar <id>')
    .description('Atualizar os dados de um usuário')
    .action((id) => {
    atualizarUsuario(id);
});
function atualizarUsuario(id) {
    rl.question('Novo nome (deixe em branco para não alterar): ', (nome) => {
        rl.question('Novo email (deixe em branco para não alterar): ', (email) => {
            rl.question('Nova senha (deixe em branco para não alterar): ', (senha) => {
                rl.question('Novo papel (deixe em branco para não alterar): ', (papel) => {
                    rl.question('Novo status (ativo/inativo ou deixe em branco para não alterar): ', (status) => {
                        // Verifica se o status informado é válido
                        if (status && !['ativo', 'inativo'].includes(status.toLowerCase())) {
                            console.log('Status inválido. Por favor, insira "ativo" ou "inativo".');
                            return atualizarUsuario(id); // Recomeçar a atualização
                        }
                        // Converte o status para minúsculas e define como undefined se estiver vazio
                        const dadosAtualizados = {
                            nome: nome || undefined,
                            email: email || undefined,
                            senha: senha || undefined,
                            papel: papel || undefined,
                            status: status || undefined
                        };
                        // Chamando a função atualizarDados
                        (0, usuarioService_1.atualizarDados)(usuarios, id, dadosAtualizados);
                        rl.close();
                    });
                });
            });
        });
    });
}
// Ver permissões de cada usuário de acordo com seu papel
commander_1.program
    .command('ver-permissoes <id>')
    .description('Ver permissões de um usuário de acordo com seu papel')
    .action((id) => {
    // Procura o papel de usuário pelo ID
    const papel = papeisSeeds_1.papeisUsuario.find(p => p.id === parseInt(id, 10));
    if (!papel) {
        console.log(`Usuário com ID ${id} não encontrado.`);
        return;
    }
    console.log(`Permissões para o papel ${papel.nome}:`);
    papel.permissoes.forEach(perm => console.log(`- ${perm}`));
});
// Iniciar a aplicação CLI
commander_1.program.parse(process.argv);
