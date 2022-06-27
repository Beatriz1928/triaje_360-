const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
// funciones
const subirArchivo = async(req, res = response) => {
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
    const id = req.params.id
    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];
    const archivosValidos = {
            fotoEscena: ['jpeg', 'jpg', 'png'],
            pacientes: ['jpeg', 'jpg', 'png']
        }
        //comprobamos tipo operación realizada
    switch (tipo) {
        case 'fotoEscena':
            if (!archivosValidos.fotoEscena.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no es valido (${archivosValidos.fotoEscena}) `,

                });
            }
            break;
        case 'pacientes':
            if (!archivosValidos.fotoVictima.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo ${extension} no es valido (${archivosValidos.fotoVictima}) `,

                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operación no es permitido `,

            });
    }
    const patharchivo = `${process.env.PATHUPLOAD}/${tipo}/${uuidv4()}.${extension}`;
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

const enviarArchivo = async(req, res = response) => {


    res.json({
        ok: true,
        msg: 'enviar archivo',
    });

}

// exportamos las funciones 
module.exports = { subirArchivo, enviarArchivo };