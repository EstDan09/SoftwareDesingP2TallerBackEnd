const usuarioController = require("../controllers/usuarioController");

module.exports = function (app) {
    app.post("/usuario/registro", usuarioController.crearUsuario);
    app.get("/usuario/todos", usuarioController.obtenerUsuarios);
    app.get("/usuario/unique/:id", usuarioController.obtenerUsuario);
}