/* IMPORTACION DE MODULOS */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('./database/configdb');
const { initDB } = require('./helpers/initDB');
const fileUpload = require('express-fileupload');


// Creamos Aplicacion Express
const app = express();
// Llamamos a nuestra cadena de conexion
dbConnection();
// Indicamos que usamos cors
app.use(cors());
//Middleware para acceder a JSON
app.use(express.json());
// Creamos usuario default
initDB();
// Definimos rutas 
//para subir imagenes
app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 }, //limita el tam max de img
    createParentPath: true,
}));
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/asignaturas', require('./routes/asignaturas'));
app.use('/api/ejercicios', require('./routes/ejercicios'));
app.use('/api/ejerciciosUsuario', require('./routes/ejerciciosUsuario'));
app.use('/api/imagenes', require('./routes/imagenes'));
app.use('/api/imagenesPaciente', require('./routes/imagenesPaciente'));
app.use('/api/acciones', require('./routes/acciones'));
app.use('/api/pacientes', require('./routes/pacientes'));
app.use('/api/pacienteEjercicio', require('./routes/pacienteEjercicio'));
app.use('/api/actividades', require('./routes/actividades'));
app.use('/api/upload', require('./routes/uploads'));




// Abrimos la aplicacion en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto', process.env.PORT, '...');
});