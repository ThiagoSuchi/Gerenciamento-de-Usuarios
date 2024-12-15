import fs from 'fs';
import { Usuario } from "../models/usuario";

const filePath = './src/data/listUsuario.csv';



export const salvarArquivo = (usuarios: Usuario[])=> {
    try {
       // Adicionando cabeçalho
        const cabecalho = 'Id | Nome | E-mail | Senha | Papel | Data de Cadastro | Data da Última Alteração | Status';

        const user = usuarios.map((user) =>
            [
                user.id,
                user.nome,
                user.email,
                user.senha,
                user.papel,
                user.dataCadastro,
                user.dataUltimaAlteracao,
                user.status
            ].join(', ')
        );

        // Adicionei o cabeçalho aos dados no arquivo csv
        const csvFormatado = [cabecalho, ...user].join('\n');

        fs.writeFileSync(filePath, csvFormatado, 'utf8');
        console.log('Dados atualizados com sucesso!');
    } catch (err) {
        console.log(`${(err as Error).message}`);
    }
}

