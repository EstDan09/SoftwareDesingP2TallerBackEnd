const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    carros: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Carro",
        },
    ],
    fotoPerfil: {
        type: String, // Almacena la imagen codificada en Base64
        default: null,
    },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
