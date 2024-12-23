import bcrypt from 'bcrypt';
import { Usuario } from "../models/usuario";
import { salvarArquivo } from "./csvService";
import { Status } from "../models/usuario"; // Add this line to import Status

// Esta função irá formatar as datas
export function dataFormatada(data: Date): string {
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

    // Criptografando a senha
    const saltRound = 10;
    usuario.senha = await bcrypt.hash(usuario.senha, saltRound)

    //Formatando a data
    dataFormatada(usuario.dataCadastro)

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
    const userencontrado = usuario.find(user => user.id === idPassado);

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
    if (user === -1) {
        console.log(`Usuario com id ${id} não encontrado`);
        return;
    }

    // Remove da lista o usuário filtrado
    usuario.splice(user, 1)
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

    // Validações de email, senha, nome
    if (novosDados.nome && (novosDados.nome.length < 3 || novosDados.nome.length > 25)) {
        return 'Nome inválido, o nome deve ter no mínimo 3 e no máximo 25 caracteres.';
    }

    if (novosDados.email && (!validEmail(novosDados.email))) {
        return `'Este email é inválido, exemplo de email: exemple@gmail.com';`
    }

    if (novosDados.senha && (!validSenha(novosDados.senha))) {
        return 'Senha inválida, sua senha deve conter no mínimo 8 caracteres, letras maiúsculas, letras minúsculas, números e caracteres especiais.';
    }

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

    // Atualizei a data conforme a ultima alteração
    const dataAtualizada = user.dataUltimaAlteracao = new Date();
    dataFormatada(dataAtualizada)
    // Salvando os novos dados no arquivo csv
    salvarArquivo(usuario);
}

// Testando o código
// cadastrarUsuario(usuario, usuario[2])
// deletUsuario(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041')
// atualizarDados(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041', { nome: 'Thiago da Massa' });
// listarUsuarios(usuario);
// listUsuarioId(usuario, 'f03ae71b-f270-4169-b440-4988d19c42041');
