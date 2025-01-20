const Usuario = require("../models/Usuario");
const usuario = require("../routes/usuario");

exports.crearUsuario = async (req, res) => {
    try {
        if (!req.body.correo || !req.body.password || !req.body.nombre) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios." });
        }

        const newUsuario = {
            nombre: req.body.nombre,
            correo: req.body.correo,
            password: req.body.password
        }

        let usuario = new Usuario(newUsuario);

        await usuario.save();

        res.send({ usuario });

    } catch (error) {
        if (error.code === 11000) {
            res.status(409).send("El correo ya existe");
        } else {
            res.status(500).send("Hubo un error al crear un usuario");
        }
    }
}

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();//.populate('carros'); 
        res.status(200).json({ msg: "Lista de usuarios-votos obtenida exitosamente.", data: usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al obtener los usuarios");
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json ({msg: "Se reuqiere ID de usuario."})
        }
        
        const user = await Usuario.findById(req.params.id);

        res.status(200).json({ msg: "Usuario obtenido exitosamente.", data: user });

    } catch (error){
        console.error(error);
        res.status(500).send("Hubo un error al obtener el usuario");
    }
}
