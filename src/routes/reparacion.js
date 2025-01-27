const reparacionController = require("../controllers/reparacionController");

module.exports = function(app) {
    app.post("/reparacion/registro", reparacionController.crearReparacion);
    app.get("/reparacion/show/:id", reparacionController.obtenerReparaciones);
}