// RUTA BASE: /api/acciones

const { Router } = require('express');
const { getPacientes, crearPaciente, actualizarPaciente, borrarPaciente, getPaciente } = require('../controllers/pacientes');
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
], getPacientes);

router.get('/:id', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    validarCampos
], getPaciente);

router.post('/', [
    validarJWT,
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    check('camina', 'El argumento camina es obligatorio').isBoolean(),
    check('color', 'El argumento color es obligatorio').not().isEmpty(),
    //check('img', 'El argumento img ser un string').optional(),
    //check('acciones', 'El argumento acciones es obligatorio').not().isEmpty(),
    check('empeora', 'El estado debe ser true o false').isBoolean(),
    check('tiempoEmpeora', 'El tiempo debe ser una cantidad').optional().isNumeric(),
    validarCampos
], crearPaciente);

router.put('/:id', [
    validarJWT,
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    check('camina', 'El argumento camina es obligatorio').isBoolean(),
    check('color', 'El argumento color es obligatorio').not().isEmpty(),
    check('img', 'El argumento img ser un string').not().isEmpty(),
    // check('acciones', 'El argumento acciones es obligatorio').not().isEmpty(),
    check('empeora', 'El estado debe ser true o false').isBoolean(),
    check('tiempoEmpeora', 'El tiempo debe ser una cantidad').optional().isNumeric(),
    validarCampos
], actualizarPaciente);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarPaciente);


// Exportamos el modulo
module.exports = router;