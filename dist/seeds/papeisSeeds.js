"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.papeisUsuario = void 0;
exports.papeisUsuario = [
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
