const mongoose = require("mongoose");

const CarroSchema = mongoose.Schema(
    {
        placa: {
            type: String,
            required: true
        },
        color: {
            type: String,
            requiered: true
        },
        modelo: {
            type: String,
            requiered: true
        },
        marca: {
            type: String,
            requiered: true
        },
        year: {
            type: number,
            requiered: true
        },
        estado: {
            type: String,
            required: true,
            trim: true
        },
        reparacion: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reparacion"
            }
        ]
    }
);

module.exports = mongoose.model("Carro", CarroSchema)