import { Papeis } from "../models/papeis";
import { Usuario } from "../models/usuario";
import { usuario } from "../seeds/usuarioSeeds";
import { v4 as uuidv4 } from "uuid"
import { salvarArquivo } from "./csvService";

// Listando os usuários de teste
export const listarUsuarios = (usuarios: Usuario[]): void => {
    console.log('Lista de usuários:');
    usuarios.forEach((usu) => {
        console.log(`>${usu.nome}\n -${usu.email}\n -${usu.papel}\n -${usu.status}`);
    });
};

export const cadastrarUsuario = (usuarios: Usuario[], usuario: Usuario)  => {
    usuarios.push(usuario);
    return usuarios;    
}

const novoUsuario: Usuario = {
    id: uuidv4(),
    nome: 'Valderio',
    email: 'valde@gmail.com',
    senha: 'valDERIO123321#',
    papel: Papeis.Convidado,
    dataCadastro: new Date(),
    dataUltimaAlteracao: new Date(),
    status: "inativo"    
}

listarUsuarios(usuario)
console.log('Cadastrando um novo usuário');
cadastrarUsuario(usuario, novoUsuario)
listarUsuarios(usuario)
salvarArquivo(usuario)
