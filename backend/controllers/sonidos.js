const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Sonido = require('../models/sonidos');
// funciones
const crearSonido = async(req, res = response) => {
    //comprobamos si es admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear sonidos',
        });
    }
    //comprobamos que se manda un archivo

    const nombre = req.body.nombre;
    const archivo = req.body.ruta;
    // console.log(archivo);
    const nombrePartido = archivo.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];
    const nom = nombrePartido[0];
    // comprobamos si ya existe el nombre
    const existeSonido = await Sonido.findOne({ nombre });
    if (existeSonido) {
        return res.status(400).json({
            ok: false,
            msg: 'El nombre ya existe para otro Sonido'
        });
    }

    req.body.ruta = `${nom}.${extension}`;
    // console.log(req.body.ruta);
    const sonido = new Sonido(req.body);
    sonido.save();
    res.json({
        ok: true,
        msg: 'Subir sonido',
    });
}

const actualizarSonido = async(req, res = response) => {
    //comprobamos si es admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear imagenes',
        });
    }
    try {
        //comprobamos que se manda un archivo
        const uid = req.params.id;
        const nombre = req.body.nombre;
        const archivo = req.body.ruta;
        const nombrePartido = archivo.split('.');
        const extension = nombrePartido[nombrePartido.length - 1];
        const nom = nombrePartido[0];
        // comprobamos si ya existe el nombre

        const existeImagen = await Imagen.findById(uid);
        if (!existeImagen) {
            return res.status(400).json({
                ok: false,
                msg: 'no hay sonido con ese id'
            });
        }


        console.log('Estoy en tiles: ' + uid + ' ' + req.body.nombre + ' ' + req.body.descripcion + ' ' + req.body.ruta);
        req.body.ruta = `${nom}.${extension}`;

        console.log(req.body.ruta);
        const imagen = await Imagen.findByIdAndUpdate(uid, req.body, { new: true });



        res.json({
            ok: true,
            msg: 'Actualizar archivo',
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando sonido'
        });
    }


}



const getSonidos = async(req, res = response) => {

    // parametros
    let texto = req.query.texto;
    const id = req.query.id;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;


    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener recursos',
        });
    }

    try {
        var sonidos, totalSonidos;
        if (id) { // si nos pasan un id
            [sonidos, totalSonidos] = await Promise.all([
                Sonido.findById(id).skip(desde).limit(pageSize),
                Sonido.countDocuments()
            ]);

        } else { // si no nos pasan el id
            [sonidos, totalSonidos] = await Promise.all([
                Sonido.find().skip(desde).limit(pageSize),
                Sonido.countDocuments({})

            ]);
        }
        res.json({
            ok: true,
            msg: 'Recursos obtenidos',
            sonidos,
            totalSonidos
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo sonidos'
        })
    }
}

const getSonido = async(req, res = response) => {

    const uid = req.params.id;
    const token = req.header('x-token');
    // lo puede obtener cualquier usuario
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener el recurso',
        });
    }

    // comprobamos si el sonido que se esta intentando obtener existe
    const existeSonido = await Sonido.findById(uid);
    if (!existeSonido) {
        return res.status(400).json({
            ok: false,
            msg: 'El sonido no existe'
        });
    }
    sonido = existeSonido;

    res.json({
        ok: true,
        msg: 'Sonido obtenida',
        sonido
    });
}


const borrarSonido = async(req, res = response) => {

    const uid = req.params.id;
    console.log('es :' + uid);
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar sonidos',
        });
    }

    try {

        // comprobamos si la imagen que se esta intentando eliminar existe
        const existeSonido = await Sonido.findById(uid);
        if (!existeSonido) {
            return res.status(400).json({
                ok: false,
                msg: 'El sonido no existe'
            });
        }
        // si se ha superado la comprobacion, eliminamos la imagen
        const sonido = await Sonido.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Sonido borrado',
            sonido
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando el sonido'
        });
    }


}


// exportamos las funciones 
module.exports = { crearSonido, getSonidos, actualizarSonido, borrarSonido, getSonido };