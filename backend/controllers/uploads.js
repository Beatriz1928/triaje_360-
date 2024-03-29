const { response } = require('express');
require('dotenv').config();
const { infoToken } = require('../helpers/infotoken');
const Imagen = require('../models/imagenes');
const ImagenPaciente = require('../models/imagenesPaciente');
const { v4: uuidv4 } = require('uuid');
// funciones
const crearImagen = async(req, res = response) => {
    console.log(req);
    //comprobamos si es admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos',
        });
    }
    //comprobamos que se manda un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }
    // comprobamos el peso del archivo y si pesa mucho no lo aceptamos
    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB `

        });
    }
    const tipo = req.params.tipo //fotoEscena o fotoVictima
    console.log(req.body.path);
    const archivo = req.files.archivo;
    archivo.name = req.body.path;
    const nombrePartido = archivo.name.split('.');
    const nom = nombrePartido[0];
    const nom2 = nombrePartido[1]; // para el nombre de los tiles2, si no se rellenaria con la extension,asi que no salta error
    const extension = nombrePartido[nombrePartido.length - 1];
    const archivosValidos = {
        tiles: ['jpeg', 'jpg', 'png', 'PNG'],
        pacientes: ['jpeg', 'jpg', 'png', 'PNG'],
        tiles2: ['jpeg', 'jpg', 'png', 'PNG'],
        sonidos: ['mp3', 'wav']
    }
    let patharchivo = '';
    let ruta = '';
    console.log(req.files.ruta);
    console.log(tipo);

    //comprobamos tipo operación realizada
    switch (tipo) {
        case 'tiles':
            if (!archivosValidos.tiles.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no es valido (${archivosValidos.fotoEscena}) `,

                });
            };
            patharchivo = `${process.env.PATHUPLOAD}/tiles/${req.body.path}`;
            ruta = req.body.path;
            break;
        case 'pacientes':
            if (!archivosValidos.pacientes.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no es valido (${archivosValidos.fotoVictima}) `,

                });
            };
            patharchivo = `${process.env.PATHUPLOAD}/pacientes/${nom}.${extension}`;
            ruta = `${nom}.${extension}`;
            break;
        case 'tiles2':
            console.log(req.files.archivo);
            patharchivo = `${process.env.PATHUPLOAD}/tiles/${req.body.path}`;

            ruta = `${req.body.path}`;
            break;
        case 'sonidos':
            console.log('ESTOY LLEGANDO A IF SONIDOS');
            patharchivo = `${process.env.PATHUPLOAD}/audio/${req.body.path}`;
            ruta = `${req.body.path}`;
            break;
        default:
            patharchivo = `${process.env.PATHUPLOAD}/tiles/${nom}/preview.${extension}`;
            ruta = `${nom}/preview.${extension}`;
            // return res.status(400).json({
            //     ok: false,
            //     msg: `El tipo de operación no es permitido `,

            // });
    }

    console.log(patharchivo);
    archivo.mv(patharchivo, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo guardar el archivo `,
                tipoOperacion: tipo
            });
        }

        res.json({
            ok: true,
            msg: 'Subir archivo',
        });

    });

}

const actualizarImagen = async(req, res = response) => {
    console.log('LLegp a lo de actualizar');
    //comprobamos si es admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar imagenes',
        });
    }
    //comprobamos que se manda un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }
    // comprobamos el peso del archivo y si pesa mucho no lo aceptamos
    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB `

        });
    }
    const { nombre } = req.body;
    const tipo = req.params.tipo //fotoEscena o fotoVictima

    const uid = req.params.id;
    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];
    const archivosValidos = {
        tiles: ['jpeg', 'jpg', 'png'],
        pacientes: ['jpeg', 'jpg', 'png']
    }
    let patharchivo = '';
    let ruta = '';
    try {
        // comprobamos si ya existe el id
        const existeImagen = await Imagen.findById(uid);
        const existeImagen2 = await ImagenPaciente.findById(uid);
        if (!existeImagen && !existeImagen2) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el recurso'
            });
        }

        // comprobamos si ya existe el id
        const existeImagen4 = await ImagenPaciente.findOne({ nombre });
        if (existeImagen4) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra imagen'
            });
        }

        const nom = uuidv4();

        const nombrePartido = archivo.name.split('.');
        const nom1 = nombrePartido[0];
        const nom2 = nombrePartido[1]; // para el nombre de los tiles2, si no se rellenaria con la extension,asi que no salta error
        //comprobamos tipo operación realizada
        switch (tipo) {
            case 'tiles':
                if (!archivosValidos.tiles.includes(extension)) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El tipo de archivo ${extension} no es valido (${archivosValidos.fotoEscena}) `,

                    });
                };

                patharchivo = `${process.env.PATHUPLOAD}${tipo}/${req.body.nombre}/${nom}.${extension}`;
                ruta = `${req.body.nombre}/${nom}.${extension}`;
                break;
            case 'pacientes':
                if (!archivosValidos.pacientes.includes(extension)) {
                    return res.status(400).json({
                        ok: false,
                        msg: `El tipo de archivo ${extension} no es valido (${archivosValidos.fotoVictima}) `,

                    });
                };
            case 'tiles2':
                patharchivo = `${process.env.PATHUPLOAD}/tiles/${nom}/${nom2}.${extension}`;

                ruta = `${nom}/preview.${extension}`;
                break;
                patharchivo = `${process.env.PATHUPLOAD}${tipo}/${nom}.${extension}`;
                ruta = `${nom}.${extension}`;
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de operación no es permitido `,

                });
        }

        console.log(patharchivo);
        archivo.mv(patharchivo, (err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: `No se pudo guardar el archivo `,
                    tipoOperacion: tipo
                });
            }
            switch (tipo) {
                case 'tiles':
                    req.body.ruta = ruta;
                    console.log(req.body.ruta);
                    const imagen = Imagen.findByIdAndUpdate(uid, req.body, { new: true });
                    break;
                case 'pacientes':
                    req.body.ruta = ruta;
                    console.log(req.body.ruta);
                    const img = ImagenPaciente.findByIdAndUpdate(uid, req.body, { new: true });
                    break;
            }


            res.json({
                ok: true,
                msg: 'Actualizar archivo',
            });

        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la imagen'
        });
    }
}



const getImagenes = async(req, res = response) => {

    // parametros
    var ObjectId = require('mongodb').ObjectID;
    const id = req.query.id;
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
                    [imagenes, totalImagenes] = await Promise.all([
                        Imagen
                        .find({}, 'nombre descripcion ruta')
                        .skip(desde).limit(pageSize),
                        Imagen.countDocuments()
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


const borrarImagen = async(req, res = response) => {

    const uid = req.params.id;
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

                // comprobamos si el curso que se esta intentando eliminar existe
                const existeImagen = await Imagen.findById(uid);
                if (!existeImagen) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La imagen no existe'
                    });
                }


                // si se ha superado la comprobacion, eliminamos el curso
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

                // comprobamos si el curso que se esta intentando eliminar existe
                const existeImagen = await ImagenPaciente.findById(uid);
                if (!existeImagen) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La imagen no existe'
                    });
                }


                // si se ha superado la comprobacion, eliminamos el curso
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
module.exports = { crearImagen, getImagenes, actualizarImagen, borrarImagen };