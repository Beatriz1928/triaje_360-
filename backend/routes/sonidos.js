/*
Ruta base: /api/sonidos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearSonido, getSonidos, getSonido, actualizarSonido, borrarSonido } = require('../controllers/sonidos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/:tipo', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    check('pageSize', 'Desde debe ser un número').optional().isNumeric(),
    check('currentPage', 'Desde debe ser un número').optional().isNumeric(),
    check('texto', 'Desde debe ser una cadena de texto').optional().isString(),
    check('userId', 'Desde debe ser una cadena de texto').optional().isString(),
    validarCampos
], getSonidos);


router.get('/:tipo/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], getSonido);


router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    check('ruta', 'El argumento ruta es obligatorio').isString(),
    validarCampos,
], crearSonido);

router.put('/:id', [
    validarJWT,

    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarSonido);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarSonido);

module.exports = router;