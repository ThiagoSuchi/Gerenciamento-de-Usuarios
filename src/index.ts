import fs from 'fs';
import { program } from 'commander';
import readline from 'readline';
import { Usuario, Status } from "./models/usuario";
import { cadastrarUsuario, listarUsuarios, listUsuarioId, deletUsuario, atualizarDados, dataFormatada } from "./services/usuarioService";
import { papeisUsuario } from './seeds/papeisSeeds';
import { v4 as uuidv4 } from "uuid";

// Definir o caminho do arquivo CSV
const filePath = './src/data/listUsuario.csv';

// Função para carregar os dados do arquivo CSV
const carregarUsuarios = (): Usuario[] => {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').slice(1); 
        return lines.filter(line => line.trim()).map(line => {

            const [id, nome, email, senha, papel, dataCadastro, dataUltimaAlteracao, status] = line.split(', ');

            return {
                id,
                nome,
                email,
                senha,
                papel,
                dataCadastro: new Date(Date.parse(dataCadastro)),
                dataUltimaAlteracao: new Date(Date.parse(dataUltimaAlteracao)),
                status: status as Status
            };
        });
    } catch (err) {
        console.error('Erro ao carregar os dados:', err);
        return [];
    }
};

const usuarios = carregarUsuarios();

program.version('1.0.0');

// Configurar readline para entrada do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const perguntar = (pergunta: string): Promise<string> => {
    return new Promise(resolve => {
        rl.question(pergunta, resposta => resolve(resposta));
    });
};

// Comando para cadastrar um novo usuário
program
    .command('cadastrar')
    .description('Cadastrar um novo usuário')
    .action(async () => {
        console.log("Por favor, insira os dados do novo usuário:");

        const nome = await perguntar("Nome: ");
        const email = await perguntar("Email: ");
        const senha = await perguntar("Senha: ");
        const papel = await perguntar("Papel (ex: Administrador, Convidado, Professor): ");

        const novoUsuario: Usuario = {
            id: uuidv4(), // Gerar um ID único
            nome,
            email,
            senha,
            papel,
            dataCadastro: new Date(),
            dataUltimaAlteracao: new Date(),
            status: 'ativo'
        };

        await cadastrarUsuario(usuarios, novoUsuario);
        rl.close();
    });

// Comando para listar todos os usuários
program
    .command('listar-todos')
    .description('Listar todos os usuários')
    .action(() => {
        listarUsuarios(usuarios);
    });

// Comando para listar um usuário pelo ID
program
    .command('listar <id>')
    .description('Listar um usuário pelo ID')
    .action((id: string) => {
        const resultado = listUsuarioId(usuarios, id);
        if (resultado) {
            console.log('----------- Usuário encontrado -----------');
            console.log(`Nome: ${resultado.nome}\nEmail: ${resultado.email}\nPapel: ${resultado.papel}\nData de Cadastro: ${resultado.dataCadastro}\nStatus: ${resultado.status}`);
        } else {
            console.log('Usuário inválido, o id fornecido não coincide');
        }
    });    

// Comando para deletar um usuário pelo ID
program
    .command('deletar <id>')
    .description('Deletar um usuário pelo ID')
    .action((id: string) => {
        deletUsuario(usuarios, id);
    });

// Comando para atualizar os dados de um usuário
program
    .command('atualizar <id>')
    .description('Atualizar os dados de um usuário')
    .action((id) => {
        atualizarUsuario(id);
    });

function atualizarUsuario(id: string) {
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
                            status: status as Status || undefined // Ultilizei asserção de tipo para inferir um tipo para minha variável status
                        };

                        // Chamando a função atualizarDados
                        atualizarDados(usuarios, id, dadosAtualizados);
                        rl.close();
                    });
                });
            });
        });
    });
}

// Ver permissões de cada usuário de acordo com seu papel
program
    .command('ver-permissoes <id>')
    .description('Ver permissões de um usuário de acordo com seu papel')
    .action((id) => {
        // Procura o papel de usuário pelo ID
        const useID = usuarios.find(u => u.id === id);

        if (!useID) {
            console.log(`Usuário com o ID ${id} não encontrado.`);
            return;
        }
        
        const papel = papeisUsuario.find(p => p.nome.trim() === useID.papel.trim())

        if (!papel) {
            console.log(`O papel para o usuário ${useID.nome}, não foi encontrado.`);
            return;
        }

        console.log(`Permissões para o papel ${papel.nome}:`);
        papel.permissoes.forEach(perm => console.log(`- ${perm}`));
    });

// Iniciar a aplicação CLI
program.parse(process.argv);
