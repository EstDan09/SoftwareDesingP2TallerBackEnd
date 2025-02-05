const Usuario = require("../models/Usuario");
const Carro = require("../models/Carro");
const Reparacion = require("../models/Reparacion");

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID del usuario." });
        }

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const carros = await Carro.find({ _id: { $in: usuario.carros } });

        const reparacionesIds = carros.flatMap(carro => carro.reparaciones);

        await Reparacion.deleteMany({ _id: { $in: reparacionesIds } });

        await Carro.deleteMany({ _id: { $in: usuario.carros } });

        await Usuario.findByIdAndDelete(id);

        res.status(200).json({ msg: "Usuario eliminado junto con sus carros y reparaciones." });

    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).send("Hubo un error al eliminar el usuario.");
    }
};

exports.crearUsuario = async (req, res) => {
  try {
    if (!req.body.correo || !req.body.password || !req.body.nombre) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    // Verifica si se recibió una foto de perfil
    const fotoPerfil = req.body.fotoPerfil || null;

    const newUsuario = {
      nombre: req.body.nombre,
      correo: req.body.correo,
      password: req.body.password,
      fotoPerfil: fotoPerfil, // Guarda la imagen en Base64
    };

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
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .lean(); 

    res.status(200).json({
      msg: "Lista de usuarios obtenida exitosamente.",
      data: usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al obtener los usuarios");
  }
};

exports.obtenerUsuario = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Se requiere ID de usuario." });
    }

    const user = await Usuario.findById(req.params.id);

    res.status(200).json({ msg: "Usuario obtenido exitosamente.", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al obtener el usuario");
  }
};

exports.verificarUsuario = async (req, res) => {
    try {
        if (!req.query.correo) {
            return res.status(400).json({ msg: "Debe colocar un correo electrónico" });
        }
        if (!req.query.password) {
            return res.status(400).json({ msg: "Por favor, ingrese una contraseña" });
        }

        const user = await Usuario.findOne({correo: req.query.correo});

        if (user.password === req.query.password) {
            return res.status(200).json({ msg: "Usuario verificado", data: user });
        }

        res.status(400).json({ msg: "Contraseña incorrecta", data: null });

    } catch (error) {
        console.error(error);
    }
}