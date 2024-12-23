export type Status = 'ativo' | 'inativo';

export interface Usuario {
    id: string,
    nome: string,
    email: string,
    senha: string,
    papel: string,
    dataCadastro: Date,
    dataUltimaAlteracao: Date,
    status: Status
}