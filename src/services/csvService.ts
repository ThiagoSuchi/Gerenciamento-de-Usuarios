import fs from 'fs';
import { Usuario } from "../models/usuario";
import { join } from 'path';

const filePath = './src/data/listUsuario.csv';

export const salvarArquivo = (usuarios: Usuario[]): void => {
    try {
        let linha: string[] = [];

        // Condição de segurança para adcionar cabeçalho, para garantir que o arquivo existe
        if(fs.existsSync(filePath)) {
            const fileExist = fs.readFileSync(filePath, 'utf8').split('\n')
            linha = fileExist.filter((linha) => linha.trim() !== "");
        } else {
            linha.push('Id | Nome | E-mail | Senha | Papel | Data de Cadastro | Data da Última Alteração | Status')
        }
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

        linha.push(...user)

        fs.writeFileSync(filePath, linha.join('\n'), 'utf8');
        console.log('Cadastrado com sucesso!');
    } catch (err) {
        console.log(`${(err as Error).message}`);
    }
}

