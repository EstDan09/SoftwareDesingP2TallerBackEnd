const Reparacion = require("../models/Reparacion");
const Carro = require("../models/Carro");

exports.crearReparacion = async (req, res, next) => {
    try {

        const { nombre, precio, encargado, estado, placa } = req.body;

        if (!nombre || !precio || !encargado || !estado || !placa) {
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
            estado,
            fotoEstado
        });

        const reparacion = await newReparacion.save();

        carro.reparaciones.push(reparacion._id);

        await carro.save();

        res.status(201).json({
            msg: "Reparacion creada y asociada al carro exitosamente.",
            reparacion
        });

    } catch (error) {
        console.error("Error al crear la reparacion:", error);
        res.status(500).send("Hubo un error al crear la reparacion.");
    }
}

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

        reparacion.estado = "Reparando";
        await reparacion.save();

        res.status(200).json({
            msg: "La reparación ha comenzado.",
            reparacion
        });

    } catch (error) {
        console.error("Error al iniciar la reparación:", error);
        res.status(500).send("Hubo un error al actualizar la reparación.");
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

        res.status(200).json({
            msg: "La reparación ha comenzado.",
            reparacion
        });

    } catch (error) {
        console.error("Error al iniciar la reparación:", error);
        res.status(500).send("Hubo un error al actualizar la reparación.");
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