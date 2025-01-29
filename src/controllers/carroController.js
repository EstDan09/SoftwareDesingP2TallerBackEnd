const Carro = require("../models/Carro");
const Usuario = require("../models/Usuario");

exports.crearCarro = async (req, res, next) => {
    try {
        const { correo, placa, color, modelo, marca, year, estado } = req.body;

        if (!correo || !placa || !color || !modelo || !marca || !year || !estado) {
            return res.status(400).json({
                msg: "Todos los campos son obligatorios"
            });
        }

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const fotoCarro = req.body.fotoCarro || null;

        const newCarro = new Carro({
            placa,
            color,
            modelo,
            marca,
            year,
            estado,
            fotoCarro,
        });

        const carro = await newCarro.save();

        usuario.carros.push(carro._id);

        await usuario.save();

        res.status(201).json({
            msg: "Carro creado y asociado al usuario exitosamente.",
            carro,
        });


    } catch (error) {
        console.error("Error al crear el carro:", error);
        res.status(500).send("Hubo un error al crear el carro.");
    }
};

exports.obtenerCarros = async (req, res) => {
    try {
        const { id } = req.params;

        let carros;
        if (id === "all") {
            carros = await Carro.find().populate("reparaciones"); 
        } else {
            const usuario = await Usuario.findById(id).populate("carros");

            if (!usuario) {
                return res.status(404).json({ msg: "Usuario no encontrado." });
            }

            carros = usuario.carros;
        }

        res.status(200).json({
            msg: "Lista de carros obtenida exitosamente.",
            data: carros,
        });
    } catch (error) {
        console.error("Error al obtener los carros:", error);
        res.status(500).send("Hubo un error al obtener los carros.");
    }
};

exports.obtenerCarro = async (req, res) => {
    try {
        if (!req.params.id) {
          return res.status(400).json({ msg: "Se requiere ID de carro." });
        }
    
        const user = await Usuario.findById(req.params.id);
    
        res.status(200).json({ msg: "Carro obtenido exitosamente.", data: user });
      } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al obtener el carro");
      }
};