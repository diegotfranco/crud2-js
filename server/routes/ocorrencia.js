const router = require('express').Router();
const ocorrenciaController = require('../controller/ocorrenciaController');

//solicita todas as ocorrencias
router.get('/', ocorrenciaController.view);

//busca ocorrencias com palavras chave
router.post('/', ocorrenciaController.find);

//pagina com formulario para nova ocorrencia
router.get('/add-new', ocorrenciaController.addForm);

//adiciona nova ocorrencia
router.post('/add-new', ocorrenciaController.create);

//busca andar com palavras chave
router.get('/add-new/:unidade/:andar?', ocorrenciaController.findAndar);

//editar ocorrencia
router.get('/edit/:id', ocorrenciaController.edit);

module.exports = router;