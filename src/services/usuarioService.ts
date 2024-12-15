import bcrypt from 'bcrypt';
import { Usuario } from "../models/usuario";
import { usuario } from "../seeds/usuarioSeeds";
import { salvarArquivo } from "./csvService";

// cadastra um novo usuário
export const cadastrarUsuario = async (usuarios: Usuario[], usuario: Usuario) => {
    // Validação do nome
    if (usuario.nome.length < 3 || usuario.nome.length > 25) {
        return 'Nome inválido, o nome deve ter no mínimo 3 e no máximo 25 caracteres.';
    }

    // Validação de email
    const validEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }
    
    if(!validEmail(usuario.email)) {
        return 'Este email é inválido - exemplo de email: exemple@gmail.com';
    }

    // Validação de senha
    const validSenha = (senha: string): boolean => {
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/;
        return senhaRegex.test(senha)
    }
    
    if(!validSenha(usuario.senha)) {
        return 'Senha inválida, sua senha deve conter no mínimo 8 caracteres, letras maiúsculas, letras minúsculas, números e caracteres especiais.';
    }

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


export const listUsuarioId = (usuario: Usuario[], idPassado: string) => {
    return usuario.find(user => user.id === idPassado);
}

listarUsuarios(usuario)
// resolver id, esta retornando undefined
console.log(listUsuarioId(usuario, 'dd55b159-9e63-44c8-adf0-7db7d86cceca'));

