import { Papel } from "../models/papeis";


export const papeisUsuario: Papel[] = [
    {
        nome: 'Administrador',
        permissoes: [
            'Listar todos os produtos',
            'Listar produtos por id',
            'Cadastrar produtos',
            'Alterar produtos',
            'Deletar produtos'
        ]
    },
    {
        nome: 'Convidado',
        permissoes: [
            'Listar todos produtos', 
            'Listar produtos por id'
        ]
    },
    {
        nome: 'Professor',
        permissoes: [
            'Listar todos os produtos',
            'Listar produtos por id',
            'Cadastrar produtos',
        ]
    }
];