"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarDados = exports.deletUsuario = exports.listUsuarioId = exports.listarUsuarios = exports.cadastrarUsuario = void 0;
exports.dataFormatada = dataFormatada;
const bcrypt_1 = __importDefault(require("bcrypt"));
const csvService_1 = require("./csvService");
const uuid_1 = require("uuid");
// Esta função irá formatar as datas
function dataFormatada(data) {
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).replace(',', '');
}
// Função para Validação de email
const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// Função para Validação de senha
const validSenha = (senha) => {
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/;
    return senhaRegex.test(senha);
};
// Cadastrar um novo usuário
const cadastrarUsuario = async (usuarios, usuario) => {
    // Validação do nome
    if (usuario.nome.length < 3 || usuario.nome.length > 25) {
        return 'Nome inválido, o nome deve ter no mínimo 3 e no máximo 25 caracteres.';
    }
    // Validação do email
    if (!validEmail(usuario.email)) {
        return 'Este email é inválido - exemplo de email: exemple@gmail.com';
    }
    // Validação da senha
    if (!validSenha(usuario.senha)) {
        return 'Senha inválida, sua senha deve conter no mínimo 8 caracteres, letras maiúsculas, letras minúsculas, números e caracteres especiais.';
    }
    // Gerando id único
    usuario.id = (0, uuid_1.v4)();
    // Criptografando a senha
    const saltRound = 10;
    usuario.senha = await bcrypt_1.default.hash(usuario.senha, saltRound);
    // Inicialiando datas
    usuario.dataCadastro = dataFormatada(new Date());
    usuario.dataUltimaAlteracao = dataFormatada(new Date());
    usuarios.push(usuario);
    (0, csvService_1.salvarArquivo)(usuarios);
    return usuarios;
};
exports.cadastrarUsuario = cadastrarUsuario;
// Listando os usuários de teste
const listarUsuarios = (usuarios) => {
    console.log('Lista de usuários:');
    usuarios.forEach((usu) => {
        console.log(`>${usu.nome}\n -${usu.email}\n -${usu.papel}\n -${usu.status}`);
    });
};
exports.listarUsuarios = listarUsuarios;
// Listando por id
const listUsuarioId = (usuario, idPassado) => {
    const userencontrado = usuario.find(user => user.id === idPassado);
    if (!userencontrado) {
        return `Usuário com ID ${idPassado} não encontrado.`;
    }
    return userencontrado;
};
exports.listUsuarioId = listUsuarioId;
// Deletar o usuário apartir do seu id
const deletUsuario = (usuario, id) => {
    // Aqui encontra o primeiro usuário com o id especificado
    const user = usuario.findIndex(user => user.id.trim() === id.trim());
    /* Como findIndex pode retornar -1 caso não encontre o usuário,
    foi criado uma validação de usuario: */
    if (user === -1) {
        console.log(`Usuario com id ${id} não encontrado`);
        return;
    }
    // Remove da lista o usuário filtrado
    usuario.splice(user, 1);
    (0, csvService_1.salvarArquivo)(usuario);
    console.log('Usuário deletado com sucesso!');
};
exports.deletUsuario = deletUsuario;
// Alterar dados do usuário
const atualizarDados = (usuario, id, novosDados) => {
    const user = usuario.find(user => user.id === id);
    if (!user) {
        console.log(`Usuario com id ${id} não encontrado`);
        return;
    }
    // Atualizando os dados 
    if (novosDados.nome)
        user.nome = novosDados.nome;
    if (novosDados.email)
        user.email = novosDados.email;
    if (novosDados.senha)
        user.senha = novosDados.senha;
    if (novosDados.papel)
        user.papel = novosDados.papel;
    if (novosDados.status)
        user.status = 'ativo';
    // Atualizei a data conforme a ultima alteração
    user.dataUltimaAlteracao = dataFormatada(new Date());
    (0, csvService_1.salvarArquivo)(usuario);
};
exports.atualizarDados = atualizarDados;
// Testando o código
// cadastrarUsuario(usuario, usuario[2])
// deletUsuario(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041')
// atualizarDados(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041', { nome: 'Thiago da Massa' });
// listarUsuarios(usuario);
// listUsuarioId(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041');
