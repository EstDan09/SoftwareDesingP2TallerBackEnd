const reparacionController = require("../controllers/reparacionController");

module.exports = function(app) {
    //Admin
    app.post("/reparacion/registro", reparacionController.crearReparacion);
    app.get("/reparacion/show/:id", reparacionController.obtenerReparaciones);
    app.get("/reparacion/unique/:id", reparacionController.obtenerReparacion);
    app.post("/reparacion/repair/:id", reparacionController.empezarAReparar);
    app.post("/reparacion/finish/:id", reparacionController.terminarDeReparar);
    app.get("/reparacion/user/:id", reparacionController.obtenerReparacionesPorUsuario);
    
    //Cliente
    app.put("/public/reparacion/approve/:id", reparacionController.aprobarReparacion);
    app.get("/public/reparacion/show/:id", reparacionController.obtenerReparaciones);

    app.delete("/reparacion/delete/:id", reparacionController.eliminarReparacion);    
}