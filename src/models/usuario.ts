import { Papeis } from "./papeis";

export type Status = 'ativo' | 'inativo';

export interface Usuario {
    id: string,
    nome: string,
    email: string,
    senha: string,
    papel: Papeis,
    dataCadastro: Date,
    dataUltimaAlteracao: Date,
    status: Status
}