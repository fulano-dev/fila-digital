
const db = require('../models/db'); // Arquivo que exporta a conexão com o banco

// Função para atualizar a posição na fila após alterações
async function atualizarPosicaoFila(connection, idFilial) {
    // Obter todos os clientes na fila da filial ordenados por horário de entrada
    const [clientesFila] = await connection.execute(
        'SELECT idFila FROM TabelaFila WHERE idFilial = ? ORDER BY HorarioEntrada',
        [idFilial]
    );

    // Atualizar a posição na fila para cada cliente
    for (let i = 0; i < clientesFila.length; i++) {
        const idFila = clientesFila[i].idFila;
        await connection.execute(
            'UPDATE TabelaFila SET PosicaoFila = ? WHERE idFila = ?',
            [i + 1, idFila]
        );
    }
}

// src/controllers/filaController.js

// Função para adicionar cliente à fila
exports.entrarFila = async (req, res) => {
    const { idFilial, nome, numeroWhatsapp, numeroPessoas, comentario } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const cleanNumeroWhatsapp = numeroWhatsapp ? numeroWhatsapp.replace(/[^\d]/g, '') : null;
        
        // Inserir cliente na tabela Cliente
        const insertClienteQuery = 'INSERT INTO TabelaCliente (Nome, NumeroWhatsApp, Preferencial, NumeroPessoas, Comentario, Chamado) VALUES (?, ?, ?, ?, ?, "NA FILA")';
        const [resultCliente] = await connection.execute(insertClienteQuery, [nome, cleanNumeroWhatsapp, 0, numeroPessoas, comentario]);

        const idCliente = resultCliente.insertId;
        
        // Inserir cliente na fila (sem StatusFila)
        const insertFilaQuery = 'INSERT INTO TabelaFila (idFilial, idCliente, PosicaoFila, HorarioEntrada) VALUES (?, ?, ?, NOW())';
        const [resultFila] = await connection.execute(insertFilaQuery, [idFilial, idCliente, 0]);
        
        // Atualizar posições na fila após inserção
        await atualizarPosicaoFila(connection, idFilial);
        
        await connection.commit();
        
        res.status(201).json({ message: 'Cliente adicionado à fila com sucesso!', idFila: resultFila.insertId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar cliente à fila' });
    } finally {
        connection.release();
    }
};

// Função para chamar o próximo cliente
// Função para chamar o próximo cliente
// Função para chamar o próximo cliente
// Função para chamar o próximo cliente
exports.chamarProximoCliente = async (req, res) => {
    const { idFilial } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Consultar a quantidade de chamados normais
        const [controleFila] = await connection.execute('SELECT chamadosNormal FROM ControlePreferencial WHERE idFilial = ?', [idFilial]);

        if (controleFila.length === 0) {
            return res.status(404).json({ error: 'Filial não encontrada' });
        }

        const { chamadosNormal } = controleFila[0];
        let clienteChamar = null;

        // Caso chamadosNormais >= 4, tenta chamar um cliente preferencial
        if (chamadosNormal >= 4) {
            // Consultar o próximo cliente preferencial da fila
            const [nextPreferencial] = await connection.execute('SELECT idFila, idCliente, PosicaoFila FROM TabelaFila WHERE idFilial = ? AND preferencial = 1 AND Status = 0 ORDER BY PosicaoFila LIMIT 1', [idFilial]);

            if (nextPreferencial.length > 0) {
                clienteChamar = nextPreferencial[0];
                // Atualiza o controle para resetar os chamados normais e incrementar os chamados preferenciais
                await connection.execute('UPDATE ControlePreferencial SET chamadosNormal = 0 WHERE idFilial = ?', [idFilial]);
            } else {
                // Se não houver preferenciais, chama um cliente normal
                const [nextNormal] = await connection.execute('SELECT idFila, idCliente, PosicaoFila FROM TabelaFila WHERE idFilial = ? AND preferencial = 0 AND Status = 0 ORDER BY PosicaoFila LIMIT 1', [idFilial]);

                if (nextNormal.length > 0) {
                    clienteChamar = nextNormal[0];
                    // Atualiza a quantidade de chamados normais sem zerar
                    await connection.execute('UPDATE ControlePreferencial SET chamadosNormal = chamadosNormal + 1 WHERE idFilial = ?', [idFilial]);
                }
            }
        } else {
            // Chama um cliente normal quando o número de chamados normais for menor que 4
            const [nextNormal] = await connection.execute('SELECT idFila, idCliente, PosicaoFila FROM TabelaFila WHERE idFilial = ? AND preferencial = 0 AND Status = 0 ORDER BY PosicaoFila LIMIT 1', [idFilial]);

            if (nextNormal.length > 0) {
                clienteChamar = nextNormal[0];
                // Atualiza a quantidade de chamados normais
                await connection.execute('UPDATE ControlePreferencial SET chamadosNormal = chamadosNormal + 1 WHERE idFilial = ?', [idFilial]);
            }
        }

        if (!clienteChamar) {
            await connection.commit();
            return res.status(404).json({ error: 'Não há clientes para chamar' });
        }

        // Atualizar o status do cliente para "CHAMADO"
        await connection.execute('UPDATE TabelaFila SET Status = 1 WHERE idFila = ?', [clienteChamar.idFila]);

        // Atualizar a posição de todos os clientes na fila após chamar cliente
        await atualizarPosicaoFila(connection, idFilial);  // Atualiza a posição de todos os clientes na fila

        await connection.commit();

        res.status(200).json({ message: 'Cliente chamado com sucesso!', cliente: clienteChamar });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao chamar o próximo cliente' });
    } finally {
        connection.release();
    }
};

// Função para atualizar a posição na fila após a chamada
async function atualizarPosicaoFila(connection, idFilial) {
    // Atualiza a posição para todos os clientes na fila da filial, excluindo os que já foram chamados
    const [clientesFila] = await connection.execute(
        `SELECT idFila, idCliente, Status 
         FROM TabelaFila 
         WHERE idFilial = ? AND Status = 0
         ORDER BY HorarioEntrada`,
        [idFilial]
    );

    // Atualizar a posição de todos os clientes não chamados
    for (let i = 0; i < clientesFila.length; i++) {
        const idFila = clientesFila[i].idFila;
        await connection.execute(
            'UPDATE TabelaFila SET PosicaoFila = ? WHERE idFila = ?',
            [i + 1, idFila] // Atualiza a posição conforme a ordem de chegada
        );
    }

    // Após a atualização das posições, reinicializa o campo PosicaoFila para 0 para os chamados (status = 1)
    await connection.execute(
        'UPDATE TabelaFila SET PosicaoFila = 0 WHERE Status = 1 AND idFilial = ?',
        [idFilial]
    );
}

// Função para atualizar a posição na fila após a chamada
// Função para atualizar a posição na fila após a chamada
// Função para adicionar cliente à fila
exports.entrarFila = async (req, res) => {
    const { idFilial, nome, numeroWhatsapp, numeroPessoas, comentario } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const cleanNumeroWhatsapp = numeroWhatsapp ? numeroWhatsapp.replace(/[^\d]/g, '') : null;
        
        // Inserir cliente na tabela Cliente
        const insertClienteQuery = 'INSERT INTO TabelaCliente (Nome, NumeroWhatsApp, Preferencial, NumeroPessoas, Comentario, Chamado) VALUES (?, ?, ?, ?, ?, "NA FILA")';
        const [resultCliente] = await connection.execute(insertClienteQuery, [nome, cleanNumeroWhatsapp, 0, numeroPessoas, comentario]);

        const idCliente = resultCliente.insertId;
        
        // Inserir cliente na fila (sem StatusFila)
        const insertFilaQuery = 'INSERT INTO TabelaFila (idFilial, idCliente, PosicaoFila, HorarioEntrada, Status) VALUES (?, ?, ?, NOW(), 0)';
        const [resultFila] = await connection.execute(insertFilaQuery, [idFilial, idCliente, 0]);
        
        // Atualizar posições na fila após inserção
        await atualizarPosicaoFila(connection, idFilial); // Chama a função que atualiza a posição na fila

        await connection.commit();
        
        res.status(201).json({ message: 'Cliente adicionado à fila com sucesso!', idFila: resultFila.insertId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar cliente à fila' });
    } finally {
        connection.release();
    }
};

// src/controllers/filaController.js
// Função para obter a posição na fila
// Função para obter a posição na fila
exports.obterPosicaoFila = async (req, res) => {
    const idFila = req.params.idFila;  // Agora, usamos o idFila como parâmetro

    const connection = await db.getConnection();
    try {
        const [posicaoFila] = await connection.execute(
            'SELECT idCliente, PosicaoFila, Status FROM TabelaFila WHERE idFila = ? ORDER BY PosicaoFila LIMIT 1', // Alterado para buscar pelo idFila
            [idFila]
        );

        // Se não houver nenhum cliente na fila com o idFila, ou se o cliente foi chamado (Status = 1)

        const { PosicaoFila, Status } = posicaoFila[0];

        // Caso o status seja 1, o cliente já foi chamado
        if (Status === 1) {
            return res.status(200).json({
                status: 'Chamado',
                message: 'Por favor, dirija-se ao restaurante.',
            });
        }

        // Caso contrário, retorne a posição na fila
        res.status(200).json({
            status: 'Na Fila',
            posicao: PosicaoFila
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter a posição na fila' });
    } finally {
        connection.release();
    }
};

exports.layoutsFiial = async (req, res) => {
    const {idFila} = req.params;
    const connection = await db.getConnection();
    try {
        const [configsFila] = await connection.execute(
            `SELECT 
                    f.idFilial,
                    f.NomeFilial,
                    r.NomeDoRestaurante,
                    r.FotoUrl,
                    r.LogoUrl,
                    c.CorPrincipal,
                    c.CorSecundaria,
                    c.CorTercearia,
                    c.CorNome,
                    c.CorFonte,
                    c.FonteSecundaria
                FROM TabelaFila AS t
                JOIN TabelaFilial AS f ON f.idFilial = t.idFilial
                JOIN TabelaRestaurante AS r ON r.idRestaurante = f.idRestaurante
                JOIN ConfigsLayout AS c ON c.idRestaurante = r.idRestaurante
                WHERE t.idFila = ?`, // Alterado para buscar pelo idFila
            [idFila]
        );
        res.status(200).json({
            configsLayout: configsFila[0]
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar informacoes de layout da fila' });
    } finally {
        connection.release();
    }


};

exports.limparFila = async (req, res) => {
    const { idFilial } = req.params;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        // Remover os clientes da fila que já foram chamados (Chamado = 1)
        const deleteQuery = 'DELETE FROM TabelaFila WHERE idFilial = ? AND idCliente IN (SELECT idCliente FROM TabelaCliente WHERE Chamado = 1)';
        
        const [result] = await connection.execute(deleteQuery, [idFilial]);
        
        await connection.commit();

        res.status(200).json({ message: `Fila limpa com sucesso para a filial ${idFilial}`, deletedCount: result.affectedRows });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao limpar a fila' });
    } finally {
        connection.release();
    }
};