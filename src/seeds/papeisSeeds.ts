import { Papel } from "../models/papeis";


export const papeisUsuario: Papel[] = [
    {
        id: 1,
        nome: 'Administrador',
        permissoes: [
            'Listar produtos',
            'Listar produtos por id',
            'Cadastrar produtos',
            'Alterar produtos',
            'Deletar produtos'
        ]
    },
    {
        id: 2,
        nome: 'Convidado',
        permissoes: ['Listar produtos', 'Listar produtos por id']
    },
    {
        id: 3,
        nome: 'Professor',
        permissoes: [
            'Listar produtos',
            'Listar produtos por id',
            'Cadastrar produtos',
        ]
    }
];