const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        carros: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Carro",
            }
        ]
    }
);

module.exports = mongoose.model("Usuario", UsuarioSchema)