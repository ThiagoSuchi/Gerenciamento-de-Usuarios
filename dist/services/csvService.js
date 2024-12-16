"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarArquivo = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = './src/data/listUsuario.csv';
const salvarArquivo = (usuarios) => {
    try {
        // Adicionando cabeçalho
        const cabecalho = 'Id | Nome | E-mail | Senha | Papel | Data de Cadastro | Data da Última Alteração | Status';
        const user = usuarios.map((user) => [
            user.id,
            user.nome,
            user.email,
            user.senha,
            user.papel,
            user.dataCadastro,
            user.dataUltimaAlteracao,
            user.status
        ].join(', '));
        // Adicionei o cabeçalho aos dados no arquivo csv
        const csvFormatado = [cabecalho, ...user].join('\n');
        fs_1.default.writeFileSync(filePath, csvFormatado, 'utf8');
        console.log('Dados atualizados com sucesso!');
    }
    catch (err) {
        console.log(`${err.message}`);
    }
};
exports.salvarArquivo = salvarArquivo;
