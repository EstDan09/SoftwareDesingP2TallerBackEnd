const reparacionController = require("../controllers/reparacionController");

module.exports = function(app) {
    app.post("/reparacion/registro", reparacionController.crearReparacion);
    app.get("/reparacion/show/:id", reparacionController.obtenerReparaciones);
    app.get("/reparacion/unique/:id", reparacionController.obtenerReparacion);
    app.post("/reparacion/repair/:id", reparacionController.empezarAReparar);
    app.post("/reparacion/finish/:id", reparacionController.terminarDeReparar);
    app.get("/reparacion/user/:id", reparacionController.obtenerReparacionesPorUsuario);
    app.delete("/reparacion/delete/:id", reparacionController.eliminarReparacion);    
}