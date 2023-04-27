const { response } = require('express');
require('dotenv').config();
const { infoToken } = require('../helpers/infotoken');
const Imagen = require('../models/imagenes');
const ImagenPaciente = require('../models/imagenesPaciente');
// funciones

generarIdUnico = () => {
    return 'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn'.replace(/[nt]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'n' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



const crearImagen = async(req, res = response) => {

    //comprobamos si es admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear imagenes',
        });
    }
    //comprobamos que se manda un archivo
    const nombre = req.body.nombre;
    const tipo = req.params.tipo //fotoEscena o fotoVictima
    const archivo = req.body.ruta;
    // console.log(archivo);
    const nombreExtension = archivo.split('.');
    const extension = nombreExtension[nombreExtension.length - 1];
    const nom = nombreExtension[0];
    // comprobamos si ya existe el nombre
    const existeImagen = await Imagen.findOne({ nombre });
    if (existeImagen) {
        return res.status(400).json({
            ok: false,
            msg: 'El nombre ya existe para otra imagen'
        });
    }
    // comprobamos si ya existe el nombre
    const existeImagen2 = await ImagenPaciente.findOne({ nombre });
    if (existeImagen2) {
        return res.status(400).json({
            ok: false,
            msg: 'El nombre ya existe para otra imagen'
        });
    }

    switch (tipo) {
        case 'tiles':
            let uid = generarIdUnico();
            req.body.ruta = `${uid}/${nom}.${extension}`;
            // console.log(req.body.ruta);
            const imagen = new Imagen(req.body);
            imagen.save();
            res.json({
                ok: true,
                msg: 'Subir archivo',
                imagen
            });

            break;
        case 'tiles2':
            console.log('Paso por el segundo');

            req.body.ruta = `${nom}/buenas.${extension}`;
            // console.log(req.body.ruta);
            const imagen1 = new Imagen(req.body);
            imagen2.save();
            res.json({
                ok: true,
                msg: 'Subir archivo',
                imagen2
            });

            break;
        case 'pacientes':
            //console.log(req.body.ruta);
            const img = new ImagenPaciente(req.body);
            img.save();
            res.json({
                ok: true,
                msg: 'Subir archivo',
                img
            });

            break;
    }
}

const actualizarImagen = async(req, res = response) => {
    console.log('Estoy actualizando img');
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
        const tipo = req.params.tipo //fotoEscena o fotoVictima
        const archivo = req.body.ruta;
        const nombrePartido = archivo.split('.');
        const extension = nombrePartido[nombrePartido.length - 1];
        const nom = nombrePartido[0];
        // comprobamos si ya existe el nombre

        const existeImagen0 = await Imagen.findById(uid);
        const existeImagen1 = await ImagenPaciente.findById(uid);
        if (!existeImagen0 && !existeImagen1) {
            return res.status(400).json({
                ok: false,
                msg: 'no hay imagen con ese id'
            });
        }
        switch (tipo) {
            case 'tiles':

                console.log('Estoy en tiles: ' + uid + ' ' + req.body.nombre + ' ' + req.body.descripcion + ' ' + req.body.ruta);
                req.body.ruta = `${req.body.ruta}`;
                console.log(req.body.ruta);
                const imagen = await Imagen.findByIdAndUpdate(uid, req.body, { new: true });
                imagen.save();
                res.json({
                    ok: true,
                    msg: 'Actualizar archivo',
                    imagen
                });

                break;
            case 'pacientes':
                console.log('Estoy en pacientes: ' + uid + ' ' + req.body.nombre + ' ' + req.body.descripcion + ' ' + req.body.ruta);
                console.log(req.body.ruta);
                const img = await ImagenPaciente.findByIdAndUpdate(uid, req.body, { new: true });
                res.json({
                    ok: true,
                    msg: 'Actualizar archivo',
                    img
                });

                break;
        }



    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando imagen'
        });
    }


}



const getImagenes = async(req, res = response) => {

    // parametros
    var ObjectId = require('mongodb').ObjectID;
    const id = req.query.id;
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
    //const imagen = req.query.;
    const userId = req.query.userId;
    const tipo = req.params.tipo //fotoEscena o fotoVictima
        // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener recursos',
        });
    }
    switch (tipo) {
        case 'tiles':
            try {
                var imagenes, totalImagenes;

                if (id) { // si nos pasan un id
                    [imagenes, totalImagenes] = await Promise.all([
                        Imagen.findById(id),
                        Imagen.countDocuments()
                    ]);

                } else { // si no nos pasan el id


                    if (texto != undefined) {
                        [imagenes, totalImagenes] = await Promise.all([
                            Imagen.find({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] }, 'nombre descripcion').skip(desde).limit(pageSize),
                            Imagen.countDocuments({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] })
                        ]);
                    } else {
                        [imagenes, totalImagenes] = await Promise.all([
                            Imagen.find({}, 'nombre descripcion ruta').skip(desde).limit(pageSize),
                            Imagen.countDocuments()
                        ]);
                    }
                }

                res.json({
                    ok: true,
                    msg: 'Recursos obtenidos',
                    imagenes,
                    totalImagenes,
                });

            } catch (error) {
                console.log(error);
                res.status(400).json({
                    ok: false,
                    msg: 'error obteniendo imagenes'
                })
            }
            break;
        case 'pacientes':
            try {
                var imagenes, totalImagenes;

                if (id) { // si nos pasan un id
                    [imagenes, totalImagenes] = await Promise.all([
                        ImagenPaciente.findById(id),
                        ImagenPaciente.countDocuments()
                    ]);

                } else { // si no nos pasan el id
                    [imagenes, totalImagenes] = await Promise.all([
                        ImagenPaciente
                        .find({}, 'nombre descripcion ruta')
                        .skip(desde).limit(pageSize),
                        ImagenPaciente.countDocuments()
                    ]);

                }
                res.json({
                    ok: true,
                    msg: 'Recursos obtenidos',
                    imagenes,
                    totalImagenes,
                });

            } catch (error) {
                console.log(error);
                res.status(400).json({
                    ok: false,
                    msg: 'error obteniendo imagenes'
                })
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operación no es permitido `,

            });
    }


}


const getImagen = async(req, res = response) => {

    const uid = req.params.id;
    const tipo = req.params.tipo //fotoEscena o fotoVictima
        // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede obtener cualquier usuario
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener el recurso',
        });
    }

    switch (tipo) {
        case 'tiles':
            try {
                // comprobamos si la imagen que se esta intentando obtener existe
                const existeImagen = await Imagen.findById(uid);
                if (!existeImagen) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La imagen no existe'
                    });
                }
                imagen = existeImagen;

                res.json({
                    ok: true,
                    msg: 'Imagen obtenida',
                    imagen
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    ok: false,
                    msg: 'Error obteniendo la imagen'
                });
            }
            break;
        case 'pacientes':
            try {
                // comprobamos si la imagen que se esta intentando obtener existe
                const existeImagen = await ImagenPaciente.findById(uid);
                if (!existeImagen) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La imagen no existe'
                    });
                }
                imagen = existeImagen;

                res.json({
                    ok: true,
                    msg: 'Imagen obtenida',
                    imagen
                });
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    ok: false,
                    msg: 'Error obteniendo la imagen'
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operación no es permitido `,

            });
    }


}



const borrarImagen = async(req, res = response) => {

    const uid = req.params.id;
    console.log('es :' + uid);
    const tipo = req.params.tipo //fotoEscena o fotoVictima
        // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar imagenes',
        });
    }

    switch (tipo) {
        case 'tiles':

            try {

                // comprobamos si la imagen que se esta intentando eliminar existe
                const existeImagen = await Imagen.findById(uid);
                if (!existeImagen) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La imagen no existe'
                    });
                }


                // si se ha superado la comprobacion, eliminamos la imagen
                const imagen = await Imagen.findByIdAndRemove(uid);

                res.json({
                    ok: true,
                    msg: 'Imagen borrada',
                    imagen
                });


            } catch (error) {
                console.log(error);
                res.status(400).json({
                    ok: false,
                    msg: 'Error borrando la imagen'
                });
            }
            break;
        case 'pacientes':

            try {

                // comprobamos si la imagen que se esta intentando eliminar existe
                const existeImagen = await ImagenPaciente.findById(uid);
                if (!existeImagen) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La imagen no existe'
                    });
                }


                // si se ha superado la comprobacion, eliminamos la imagen
                const imagen = await ImagenPaciente.findByIdAndRemove(uid);

                res.json({
                    ok: true,
                    msg: 'Imagen borrada',
                    imagen
                });


            } catch (error) {
                console.log(error);
                res.status(400).json({
                    ok: false,
                    msg: 'Error borrando la imagen'
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operación no es permitido `,

            });
    }



}


// exportamos las funciones 
module.exports = { crearImagen, getImagenes, actualizarImagen, borrarImagen, getImagen };