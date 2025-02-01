const reparacionController = require("../controllers/reparacionController");

module.exports = function(app) {
    //Admin
    app.post("/reparacion/registro", reparacionController.crearReparacion);
    app.get("/reparacion/show/:id", reparacionController.obtenerReparaciones);
    app.get("/reparacion/unique/:id", reparacionController.obtenerReparacion);
    app.post("/reparacion/repair/:id", reparacionController.empezarAReparar);
    app.post("/reparacion/finish/:id", reparacionController.terminarDeReparar);
    
    //Cliente
    app.put("/public/reparacion/approve/:id", reparacionController.aprobarReparacion);
    app.get("/public/reparacion/show/:id", reparacionController.obtenerReparaciones);

}