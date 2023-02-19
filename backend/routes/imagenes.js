/*
Ruta base: /api/imagenes
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearImagen, getImagenes, getImagen, actualizarImagen, borrarImagen } = require('../controllers/imagenes');
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

], getImagenes);


router.get('/:tipo/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], getImagen);


router.post('/:tipo', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    check('ruta', 'El argumento ruta es obligatorio').isString(),
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