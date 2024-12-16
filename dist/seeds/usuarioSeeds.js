"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuario = void 0;
const uuid_1 = require("uuid");
exports.usuario = [
    {
        id: (0, uuid_1.v4)(),
        nome: 'Roberto Carlo Cunha',
        email: 'robertinCarl@gmail.com',
        senha: 'robertCunha2233$',
        papel: 'Administrador',
        dataCadastro: '2024-05-22T15:34:00',
        dataUltimaAlteracao: '2024-11-10T07:40:00',
        status: 'ativo'
    },
    {
        id: (0, uuid_1.v4)(),
        nome: 'Letícia Gomes Lionhoff',
        email: 'leleticiaLio@gmail.com',
        senha: 'Leti33gomesS#',
        papel: 'Professor',
        dataCadastro: '2024-01-10T06:55:00',
        dataUltimaAlteracao: '2024-11-16T10:52:00',
        status: 'ativo'
    }
];
