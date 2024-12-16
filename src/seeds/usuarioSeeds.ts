import { Usuario } from "../models/usuario";
import { v4 as uuidv4 } from "uuid"

export const usuario: Usuario[] = [
 {
    id: uuidv4(),
    nome: 'Roberto Carlo Cunha',
    email: 'robertinCarl@gmail.com',
    senha: 'robertCunha2233$',
    papel: 'Administrador',
    dataCadastro: '2024-05-22T15:34:00',
    dataUltimaAlteracao: '2024-11-10T07:40:00',
    status: 'ativo'
 },
 {
    id: uuidv4(),
    nome: 'Letícia Gomes Lionhoff',
    email: 'leleticiaLio@gmail.com',
    senha: 'Leti33gomesS#',
    papel: 'Professor',
    dataCadastro: '2024-01-10T06:55:00',
    dataUltimaAlteracao: '2024-11-16T10:52:00',
    status: 'ativo'
 }
]