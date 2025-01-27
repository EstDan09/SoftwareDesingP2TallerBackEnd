const carroController = require("../controllers/carroController");

module.exports = function(app) {
    //Admin
    app.post("/carro/registro", carroController.crearCarro);
    app.get("/carro/show/:id", carroController.obtenerCarros);

    //Cliente
    app.get("/public/carro/:id", carroController.obtenerCarros);
}