const Reparacion = require("../models/Reparacion");
const Carro = require("../models/Carro");
const Usuario = require("../models/Usuario");

exports.crearReparacion = async (req, res, next) => {
    try {
        const { nombre, precio, encargado, estado, placa, infoCarro } = req.body;

        if (!nombre || !precio || !encargado || !estado || !placa || !infoCarro) {
            return res.status(400).json({
                msg: "Todos los campos son obligatorios"
            });
        }

        const carro = await Carro.findOne({ placa });
        if (!carro) {
            return res.status(400).json({
                msg: "Carro no encontrado"
            });
        }

        const fotoEstado = req.body.fotoEstado || null;

        const newReparacion = new Reparacion({
            nombre,
            precio,
            encargado,
            infoCarro,
            estado,
            fotoEstado
        });

        const reparacion = await newReparacion.save();

        carro.reparaciones.push(reparacion._id);

        carro.estado = "Diagnosticando";

        await carro.save();

        res.status(201).json({
            msg: "Reparación creada y asociada al carro exitosamente. Estado del carro actualizado a 'Diagnosticando'.",
            reparacion
        });

    } catch (error) {
        console.error("Error al crear la reparación:", error);
        res.status(500).send("Hubo un error al crear la reparación.");
    }
};

exports.obtenerReparaciones = async (req, res) => {
    try {
        const { id } = req.params;

        let reparaciones;

        if (id === "all") {
            reparaciones = await Reparacion.find();
        } else {
            const carro = await Carro.findById(id).populate("reparaciones");

            if (!carro) {
                return res.status(404).json({ msg: "Carro no encontrado." });
            }

            reparaciones = carro.reparaciones;
        }

        res.status(200).json({
            msg: "Lista de reparaciones obtenida exitosamente.",
            data: reparaciones,
        });

    } catch (error) {
        console.error("Error al obtener las reparaciones:", error);
        res.status(500).send("Hubo un error al obtener las reparaciones.");
    }
}

exports.empezarAReparar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID de la reparación." });
        }

        const reparacion = await Reparacion.findById(id);

        if (!reparacion) {
            return res.status(404).json({ msg: "Reparación no encontrada." });
        }

        // Buscar el carro que contiene esta reparación en su lista
        const carro = await Carro.findOne({ reparaciones: id });

        if (!carro) {
            return res.status(404).json({ msg: "Carro asociado a la reparación no encontrado." });
        }

        // Actualizar estados
        reparacion.estado = "Reparando";
        carro.estado = "Reparando";

        await reparacion.save();
        await carro.save();

        res.status(200).json({
            msg: "La reparación ha comenzado y el estado del carro ha sido actualizado a 'Reparando'.",
            reparacion,
            carro
        });

    } catch (error) {
        console.error("Error al iniciar la reparación:", error);
        res.status(500).send("Hubo un error al actualizar la reparación y el estado del carro.");
    }
};

exports.terminarDeReparar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID de la reparación." });
        }

        const reparacion = await Reparacion.findById(id);

        if (!reparacion) {
            return res.status(404).json({ msg: "Reparación no encontrada." });
        }

        reparacion.estado = "Finalizado";
        await reparacion.save();

        const carro = await Carro.findOne({ reparaciones: id });

        if (!carro) {
            return res.status(404).json({ msg: "Carro asociado a la reparación no encontrado." });
        }

        const reparacionesPendientes = await Reparacion.find({
            _id: { $in: carro.reparaciones },
            estado: { $ne: "Finalizado" }
        });

        if (reparacionesPendientes.length === 0) {
            carro.estado = "Listo para retiro";
            await carro.save();
        }

        res.status(200).json({
            msg: "La reparación ha finalizado.",
            reparacion,
            carro
        });

    } catch (error) {
        console.error("Error al finalizar la reparación:", error);
        res.status(500).send("Hubo un error al actualizar la reparación y el estado del carro.");
    }
};

exports.obtenerReparacion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID de la reparación." });
        }

        const reparacion = await Reparacion.findById(id);

        if (!reparacion) {
            return res.status(404).json({ msg: "Reparación no encontrada." });
        }

        res.status(200).json({
            msg: "Reparación obtenida exitosamente.",
            data: reparacion,
        });

    } catch (error) {
        console.error("Error al obtener la reparación:", error);
        res.status(500).send("Hubo un error al obtener la reparación.");
    }
};

exports.obtenerReparacionesPorUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID del usuario." });
        }

        const usuario = await Usuario.findById(id).populate("carros");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const carrosUsuario = usuario.carros.map(carro => `${carro.marca} - ${carro.modelo} (${carro.placa})`);

        const reparaciones = await Reparacion.find({ infoCarro: { $in: carrosUsuario } });

        res.status(200).json({
            msg: "Lista de reparaciones obtenida exitosamente.",
            data: reparaciones,
        });

    } catch (error) {
        console.error("Error al obtener las reparaciones del usuario:", error);
        res.status(500).send("Hubo un error al obtener las reparaciones del usuario.");
    }
};

exports.aprobarReparacion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID de la reparación." });
        }

        if (!["approved", "declined"].includes(req.query.state)) {
            return res.status(400).json({ msg: "No se envió una opción de aprobación válida" });
        }

        const reparacion = await Reparacion.findById(id);

        if (!reparacion) {
            return res.status(404).json({ msg: "Reparación no encontrada." });
        }

        reparacion.aprobado = req.query.state;
        await reparacion.save();

        res.status(200).json({ msg: "Se actualizó la reparación." });

    } catch (error) {
        console.error("Error al actualizar la reparación:", error);
        res.status(500).send("Hubo un error al actualizar la reparación.");
    }
}

exports.eliminarReparacion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Se requiere el ID de la reparación." });
        }

        const reparacion = await Reparacion.findById(id);
        if (!reparacion) {
            return res.status(404).json({ msg: "Reparación no encontrada." });
        }

        const carro = await Carro.findOne({ reparaciones: id });
        if (carro) {
            carro.reparaciones = carro.reparaciones.filter(repId => repId.toString() !== id);
            await carro.save();
        }

        await Reparacion.findByIdAndDelete(id);

        res.status(200).json({ msg: "Reparación eliminada correctamente." });

    } catch (error) {
        console.error("Error al eliminar la reparación:", error);
        res.status(500).send("Hubo un error al eliminar la reparación.");
    }
};

