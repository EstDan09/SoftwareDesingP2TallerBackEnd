const carroController = require("../controllers/carroController");

module.exports = function(app) {
    //Admin
    app.post("/carro/registro", carroController.crearCarro);
    app.get("/carro/show/:id", carroController.obtenerCarros);
    app.post("/carro/retiro/:id", carroController.retiroCarro);
    app.delete("/carro/delete/:id", carroController.eliminarCarro);

    //Cliente
    app.get("/public/carro/:id", carroController.obtenerCarros);
}