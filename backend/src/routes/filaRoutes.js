const express = require('express');
const router = express.Router();
const filaController = require('../controllers/filaController');

// Rota para adicionar um cliente na fila
router.post('/entrar-fila', filaController.entrarFila);

// Rota para chamar o próximo cliente
router.post('/chamar-proximo', filaController.chamarProximoCliente);

// Rota para obter a posição na fila
router.get('/posicao/:idFila', filaController.obterPosicaoFila);

router.get('/configs-fila/:idFila', filaController.layoutsFiial);

router.delete('/limpar-fila/:idFilial', filaController.limparFila);





module.exports = router;