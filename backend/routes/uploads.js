/*
Ruta base: /api/upload
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { subirArchivo, enviarArchivo } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/:tipo/:nombrearchivo', [
    validarJWT,

], enviarArchivo);
router.post('/:tipo/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], subirArchivo);

module.exports = router;