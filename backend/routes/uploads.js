/*
Ruta base: /api/upload
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { crearImagen, getImagenes, actualizarImagen, borrarImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/:tipo', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    check('pageSize', 'Desde debe ser un número').optional().isNumeric(),
    check('currentPage', 'Desde debe ser un número').optional().isNumeric(),
    //check('imagen', 'Desde debe ser una cadena de texto').optional().isString(),
    check('userId', 'Desde debe ser una cadena de texto').optional().isString(),
    validarCampos
], getImagenes);

router.post('/:tipo', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    validarCampos,
], crearImagen);

router.put('/:tipo/:id', [
    validarJWT,

    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarImagen);

router.delete('/:tipo/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarImagen);

module.exports = router;