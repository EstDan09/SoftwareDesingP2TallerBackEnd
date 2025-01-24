const Usuario = require("../models/Usuario");

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
    const usuarios = await Usuario.find().populate('carros'); 
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