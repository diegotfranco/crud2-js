const router = require('express').Router();
const ocorrenciaController = require('../controller/ocorrenciaController');

//solicita todas as ocorrencias
router.get('/', ocorrenciaController.view);

//busca ocorrencias com palavras chave
router.post('/', ocorrenciaController.find);

module.exports = router;