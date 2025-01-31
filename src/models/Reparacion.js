const mongoose = require("mongoose");

const ReparacionSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        precio: {
            type: String,
            required: true
        },
        encargado: {
            type: String,
            requiered: true
        },
        estado: {
            type: String,
            required: true,
            trim: true
        },
        fotoEstado: {
            type: String,
            default: null,
        },
        aprobado: {
            type: String,
            default: "pending"
        }
    }
);

module.exports = mongoose.model("Reparacion", ReparacionSchema)