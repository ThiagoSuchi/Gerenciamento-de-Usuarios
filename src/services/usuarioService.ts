import bcrypt from 'bcrypt';
import { Status, Usuario } from "../models/usuario";
import { usuario } from "../seeds/usuarioSeeds";
import { salvarArquivo } from "./csvService";
import { v4 as uuidv4 } from "uuid";

// Função para Validação de email
const validEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

// Função para Validação de senha
const validSenha = (senha: string): boolean => {
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/;
    return senhaRegex.test(senha)
}

// Cadastrar um novo usuário
export const cadastrarUsuario = async (usuarios: Usuario[], usuario: Usuario) => {
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
    usuario.id = uuidv4();

    // Criptografando a senha
    const saltRound = 10;
    usuario.senha = await bcrypt.hash(usuario.senha, saltRound)

    usuarios.push(usuario);
    salvarArquivo(usuarios)
    return usuarios;
}

// Listando os usuários de teste
export const listarUsuarios = (usuarios: Usuario[]): void => {
    console.log('Lista de usuários:');
    usuarios.forEach((usu) => {
        console.log(`>${usu.nome}\n -${usu.email}\n -${usu.papel}\n -${usu.status}`);
    });
};

// Listando por id
export const listUsuarioId = (usuario: Usuario[], idPassado: string) => {
    const userencontrado = usuario.find(user => user.id.trim() === idPassado.trim());

    if (!userencontrado) {
        return `Usuário com ID ${idPassado} não encontrado.`
    }

    return userencontrado;
}

// Deletar o usuário apartir do seu id
export const deletUsuario = (usuario: Usuario[], id: string) => {
    // Aqui encontra o primeiro usuário com o id especificado
    const user = usuario.findIndex(user => user.id.trim() === id.trim())

    /* Como findIndex pode retornar -1 caso não encontre o usuário,
    foi criado uma validação de usuario: */
    if(user === -1) {
        console.log(`Usuario com id ${id} não encontrado`);
        return;
    }

    // Remove da lista o usuário filtrado
    usuario.splice(user, 1)

    // Atualiza o arquivo csv
    salvarArquivo(usuario)
    console.log('Usuário deletado com sucesso!');
}

// Alterar dados do usuário
export const atualizarDados = (usuario: Usuario[], id: string, novosDados:
    {
        nome?: string,
        email?: string,
        senha?: string,
        papel?: string,
        status?: Status
    }) => {

    const user = usuario.find(user => user.id === id)

    if (!user) {
        console.log(`Usuario com id ${id} não encontrado`);
        return;
    }

    // Atualizando os dados 
    if (novosDados.nome) user.nome = novosDados.nome;
    if (novosDados.email) user.email = novosDados.email;
    if (novosDados.senha) user.senha = novosDados.senha;
    if (novosDados.papel) user.papel = novosDados.papel;
    if (novosDados.status) user.status = novosDados.status;

    salvarArquivo(usuario)
}

// Testando o código
deletUsuario(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041')
atualizarDados(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041', { nome: 'Thiago da Massa' });
listarUsuarios(usuario);