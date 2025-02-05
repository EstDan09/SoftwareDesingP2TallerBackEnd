const Carro = require("../models/Carro");
const Usuario = require("../models/Usuario");
const Reparacion = require("../models/Reparacion");

exports.crearCarro = async (req, res) => {
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

exports.retiroCarro = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID del carro." });
        }

        const carro = await Carro.findById(id);

        if (!carro) {
            return res.status(404).json({ msg: "Carro no encontrado." });
        }

        // Actualizar el estado del carro a "Circulando"
        carro.estado = "Circulando";
        await carro.save();

        res.status(200).json({
            msg: "El carro ha sido retirado y ahora está en circulación.",
            carro
        });

    } catch (error) {
        console.error("Error al actualizar el estado del carro:", error);
        res.status(500).send("Hubo un error al actualizar el estado del carro.");
    }
};

exports.eliminarCarro = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID del carro." });
        }

        // Buscar el carro
        const carro = await Carro.findById(id);

        if (!carro) {
            return res.status(404).json({ msg: "Carro no encontrado." });
        }

        // Buscar el usuario que tiene el carro en su lista
        const usuario = await Usuario.findOne({ carros: id });

        if (usuario) {
            // Eliminar el carro de la lista de carros del usuario
            usuario.carros = usuario.carros.filter(carId => carId.toString() !== id);
            await usuario.save();
        }

        // Eliminar todas las reparaciones asociadas al carro
        await Reparacion.deleteMany({ _id: { $in: carro.reparaciones } });

        // Eliminar el carro de la base de datos
        await Carro.findByIdAndDelete(id);

        res.status(200).json({ msg: "Carro eliminado correctamente junto con sus reparaciones." });

    } catch (error) {
        console.error("Error al eliminar el carro:", error);
        res.status(500).send("Hubo un error al eliminar el carro.");
    }
};