const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Configuración del puerto
const port = process.env.PORT || 3000;
const app = express();

// Conectar a la base de datos
connectDB();
//
// Middleware para habilitar CORS
const mobileCorsOptions = {
  origin: process.env.MOBILE_URL, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
};

const webCorsOptions = {
  origin: process.env.WEB_URL, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(webCorsOptions));
app.use("/public", cors(mobileCorsOptions));

// Middleware para analizar JSON y aumentar el límite
app.use(express.json({ limit: "100mb" }));

// Rutas de la aplicación
require("./routes/usuario")(app);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

// Evento para confirmar que el servidor está escuchando
app.on("listening", function () {
  console.log(
    "Express server started on port %s at %s",
    app.address().port,
    app.address().address
  );
});
