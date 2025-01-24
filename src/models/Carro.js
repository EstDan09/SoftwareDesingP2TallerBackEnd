const mongoose = require("mongoose");

const CarroSchema = mongoose.Schema(
    {
        placa: {
            type: String,
            required: true,
            unique: true,
        },
        color: {
            type: String,
            required: true
        },
        modelo: {
            type: String,
            required: true
        },
        marca: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true,
            trim: true
        },
        reparaciones: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reparacion"
            }
        ],
        fotoCarro: {
            type: String,
            default: null,
        },

    }
);

module.exports = mongoose.model("Carro", CarroSchema)