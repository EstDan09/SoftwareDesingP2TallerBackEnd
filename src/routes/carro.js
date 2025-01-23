const carroController = require("../controllers/carroController");

module.exports = function(app) {
    app.post("/carro/registro", carroController.crearCarro);
    app.get("/carro/:id", carroController.obtenerCarros);
}