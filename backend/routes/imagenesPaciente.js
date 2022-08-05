// RUTA BASE: /api/imagenPaciente

const { Router } = require('express');
const { getImagenesPaciente, crearImagenPaciente, actualizarImagenPaciente, borrarImagenPaciente } = require('../controllers/imagenesPaciente');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// definimos las rutas
router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    validarCampos
], getImagenesPaciente);



router.post('/:tipo', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    check('ruta', 'El argumento ruta es obligatorio').isString(),
    validarCampos
], crearImagenPaciente);

router.put('/:tipo/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    check('ruta', 'El argumento ruta es obligatorio').isString(),
    validarCampos
], actualizarImagenPaciente);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarImagenPaciente);


// Exportamos el modulo
module.exports = router;