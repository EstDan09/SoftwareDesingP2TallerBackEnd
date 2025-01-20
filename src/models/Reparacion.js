const mongoose = require("mongoose");

const ReparacionSchema = mongoose.Schema(
    {
        Nombre: {
            type: String,
            required: true
        },
        Encargado: {
            type: String,
            requiered: true
        },
        Estado: {
            type: String,
            required: true,
            trim: true
        }
    }
);

module.exports = mongoose.model("Reparacion", ReparacionSchema)