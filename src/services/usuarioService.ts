import { Usuario } from "../models/usuario";
import { usuario } from "../seeds/usuarioSeeds";

export const listarUsuarios = (usuarios: Usuario[]): void => {
    console.log('Lista de usuários:');
    usuarios.forEach((usu) => {
        console.log(`>${usu.nome}\n -${usu.email}\n -${usu.papel}\n -${usu.status}`);
    });
};

listarUsuarios(usuario)

 

