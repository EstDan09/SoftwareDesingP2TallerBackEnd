const usuarioController = require("../controllers/usuarioController");

module.exports = function (app) {
    // Admin
    app.post("/usuario/registro", usuarioController.crearUsuario);
    app.get("/usuario/todos", usuarioController.obtenerUsuarios);
    app.get("/usuario/unique/:id", usuarioController.obtenerUsuario);
    app.delete("/usuario/delete/:id", usuarioController.eliminarUsuario);

    // Cliente
    app.get("/public/usuario/verificar", usuarioController.verificarUsuario);
    app.get("/public/usuario/unique/:id", usuarioController.obtenerUsuario);
}