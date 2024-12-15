export enum Papeis {
    Administrador = 'Administrador',
    Convidado = 'Convidado',
    Professor = 'Professor'
}

const  listPermissaoConvidado = [
    'Listar produtos', 
    'Listar produtos por id'
];
const listPermissaoAdmin = [
    'Listar produtos',
    'Listar produtos por id',
    'Cadastrar produtos',
    'Alterar produtos',
    'Deletar produtos'
];

export const permissaoUserPapel = {
    [Papeis.Administrador]: listPermissaoAdmin,
    [Papeis.Convidado]: listPermissaoConvidado
}